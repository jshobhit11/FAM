import { Component, Input, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/shared/search.service.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-search-by-account-id',
  templateUrl: './search-by-account-id.component.html',
  styleUrls: ['./search-by-account-id.component.scss'],
})
export class SearchByAccountIdComponent implements OnInit {
  data: any[] = [];
  cols: any[] = [];
  filterFields: string[] = [];
  searchBy: any;
  searchType: any;
  statusCode: string = '';
  searchData: any;
  @Input() loading: boolean = true;

  constructor(private searchService: SearchService, private route: ActivatedRoute, private loader: LoaderService) {}

  async ngOnInit() {
    this.loader.show('Loading Data');
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      const searchValue = params.get('accountId');
      this.searchBy = params.get('searchBy');
      this.searchType = params.get('searchType');
      const statusCode = params.get('statusCode');
      this.statusCode = statusCode;
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const officeId = sessionStorage.getItem('office-id');
      const indentfilters: any = { apiKey, serviceKey, userRole, userName, userCode };
      
      const filter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        officeId,
        searchBy: this.searchBy,
        searchValue,
        searchType: this.searchType,
      };
      
      if (this.searchBy === "ACCOUNT_ID" || this.searchBy === "REFERENCE_NO") {
        this.searchData = await this.searchService.getDataByAccountIdAndOfficeId(filter);
      } else if (this.searchBy === "ESTIMATION_NO") {
        const estimateFilter = { ...filter, estimationNo: searchValue };
        this.searchData = await this.searchService.getDataByEstimationNo(estimateFilter);
      } else if (this.searchBy === "WORKORDER_NO") {
        const workOrderFilter = { ...filter, workorderNo: searchValue };
        this.searchData = await this.searchService.getDataByWorkorderNo(workOrderFilter);
      } else if (this.searchBy === "INDENT_NO") {
        const indentFilter = { ...indentfilters, materialsIndentNo: searchValue };
        this.searchData = await this.searchService.getDataByIndentNo(indentFilter);
      }

      if (this.searchData && this.searchData.length) {
        this.data = this.searchData.map((v: any) => ({
          ...v,
          category: v.categoryName !== "null" ? `${v.categoryName} / ${v.phase}` : '',
          appliedLoad: v.totalContractedLoad !== "null" ? `${v.totalContractedLoad} ${v.loadUnit}` : '',
          consumerDetails: v.consumerDetails !== "null" ? `${v.applicantName} ${v.address}` : '',
          applicationTypeName: v.applicationTypeName && v.applicationTypeName !== "null" ? `${v.applicationTypeName}` : '',
          connectionTypeName: v.connectionTypeName !== "null" ? `${v.connectionTypeName}` : '',
          applicationTypeCode: v.applicationTypeCode !== "null" ? `${v.applicationTypeCode}` : '',
          meterRequiredFlag: v.meterRequiredFlag,
          statusCode: this.statusCode,
          registeredOnFormatted: this.calculateDaysToPresent(v.registeredOn),
          materialsIndentDateFormatted: this.calculateDaysToPresent(v.materialsIndentDate),
        }));

        // Sort data based on the date field in descending order
        if (this.searchBy === "INDENT_NO") {
          this.data.sort((a, b) => new Date(b.materialsIndentDate).getTime() - new Date(a.materialsIndentDate).getTime());
        } else {
          this.data.sort((a, b) => new Date(b.registeredOn).getTime() - new Date(a.registeredOn).getTime());
        }
      } else {
        this.data = [];
      }
      
      this.setCols();
    });
  }

  private calculateDaysToPresent(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const today = new Date();
    const diffInTime = today.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
    return `${date.toLocaleDateString()} (${diffInDays} days ago)`;
  }

  private setCols() {
    if (this.searchBy === "ACCOUNT_ID" || this.searchBy === "REFERENCE_NO") {
      this.cols = [
        { key: 'referenceNumber', title: 'Case Id', route: 'true' },
        { key: 'accountId', title: 'Account ID', route: 'true' },
        { key: 'category', title: 'Category / Phase' },
        { key: 'appliedLoad', title: 'Applied Load' },
        { key: 'consumerDetails', title: 'Consumer Details' },
        { key: 'officeName', title: 'Office' },
        { key: 'statusName', title: 'Status' },
        { key: 'designationCode', title: 'Designation' },
        { key: 'applicationTypeName', title: 'Application Type' },
        { key: 'connectionTypeName', title: 'Connection Type' },
        { key: 'registeredOnFormatted', title: 'Registered On' },
        { key: 'icon', title: 'Status', route: `/main/full-details` },
      ];
    } else if (this.searchBy === "ESTIMATION_NO") {
      this.cols = [
        { key: 'referenceNumber', title: 'Case ID', route: 'true' },
        { key: 'estimationNo', title: 'Estimation No.', route: 'true' },
        { key: 'category', title: 'Category / Phase' },
        { key: 'appliedLoad', title: 'Applied Load' },
        { key: 'consumerDetails', title: 'Consumer Details' },
        { key: 'officeName', title: 'Office' },
        { key: 'statusName', title: 'Status' },
        { key: 'designationCode', title: 'Designation' },
        { key: 'applicationTypeName', title: 'Application Type' },
        { key: 'connectionTypeName', title: 'Connection Type' },
        { key: 'registeredOnFormatted', title: 'Registered On' },
        { key: 'icon', title: 'Status', route: `/main/full-details` },
      ];
    } else if (this.searchBy === "WORKORDER_NO") {
      this.cols = [
        { key: 'referenceNumber', title: 'Case ID', route: 'true' },
        { key: 'workorderNo', title: 'Work Order No.', route: 'true' },
        { key: 'category', title: 'Category / Phase' },
        { key: 'appliedLoad', title: 'Applied Load' },
        { key: 'consumerDetails', title: 'Consumer Details' },
        { key: 'officeName', title: 'Office' },
        { key: 'statusName', title: 'Status' },
        { key: 'designationCode', title: 'Designation' },
        { key: 'applicationTypeName', title: 'Application Type' },
        { key: 'connectionTypeName', title: 'Connection Type' },
        { key: 'registeredOnFormatted', title: 'Registered On' },
        { key: 'icon', title: 'Status', route: `/main/full-details` },
      ];
    } else if (this.searchBy === "INDENT_NO") {
      this.cols = [
        { key: 'materialsIndentNo', title: 'Material Indent Request No.', route: 'true' },
        { key: 'materialsIndentDateFormatted', title: 'Material Indent Date' },
        { key: 'statusName', title: 'Material Indent Status' },
        { key: 'typeOfIndent', title: 'Indent Type' },
        { key: 'designationCode', title: 'Pending At' },
        { key: 'officeName', title: 'Office'},
        { key: 'icon', title: 'Status', route: `/main/full-details` },
      ];
    }

    this.filterFields = this.cols.map((v) => v.key);
  }
}
