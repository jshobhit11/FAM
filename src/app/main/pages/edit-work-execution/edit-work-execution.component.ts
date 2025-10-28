import { Component, OnInit } from '@angular/core';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { WorkExecutionService } from '../../../services/work-execution.service';
@Component({
  selector: 'app-edit-work-execution',
  templateUrl: './edit-work-execution.component.html',
  styleUrls: ['./edit-work-execution.component.scss'],
})
export class EditWorkExecutionComponent implements OnInit {
  tableData: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private workExecutionService: WorkExecutionService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      const wmWorkorderRegisteredId = params['wmWorkorderRegisteredId'];
      const apiKey = sessionStorage.getItem('api-key');
      const serviceKey = sessionStorage.getItem('service-key');
      const userRole = sessionStorage.getItem('user-role');
      const userName = sessionStorage.getItem('user-name');
      const userCode = sessionStorage.getItem('user-code');
      const filter: any = {
        apiKey,
        serviceKey,
        userRole,
        userName,
        userCode,
        wmWorkorderRegisteredId,
      };
      this.tableData = await this.workExecutionService.getAmAssetDetails(filter);
      console.log(this.tableData);
    });
  }

  navigate() {
    this.router.navigate(['/main/work-order-summary'], {
      queryParams: {
        statusCode: 16,
        label: 'WORK EXECUTION',
      },
    });
  }
}
