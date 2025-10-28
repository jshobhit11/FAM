import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from '../../../shared/components/confirmation-popup/confirmation-popup.component';
import { AssignCrewService } from '../../../services/assign-crew.service';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { AbstractControl, ValidationErrors } from '@angular/forms';
// import { LoaderService } from 'src/app/services/loader.service';
const assignCrewForm = new FormGroup({
  store: new FormControl('', []),
  name: new FormControl('', []),
  startDate: new FormControl('', []), 
  endDate:new FormControl('',[])
});
@Component({
  selector: 'app-assign-crew-form',
  templateUrl: './assign-crew-form.component.html',
  styleUrls: ['./assign-crew-form.component.scss'],
})
export class AssignCrewFormComponent implements OnInit {
  employeeOptions: any[] = [];
  employees: any = [];
  newEmployee: any = {};
  store: any;
  selectedStore: any = {};
  workOrderRegisteredId: any;
  data: any = {};
  storeData: any = {}; 
  type:any
  assignCrewForm: FormGroup = assignCrewForm;
  workorderDate: Date = this.data.workorderDate;
  workorderEndDate: Date = this.data.workorderEndDate;
  error: string;
  isLoading: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private assignCrew: AssignCrewService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    // private loader: LoaderService,
  ) {}

  async ngOnInit() {
    // Subscribe to route query parameters
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      this.workOrderRegisteredId = params['workOrderRegisteredId'];
      this.type = params['type'];
  
      if (this.workOrderRegisteredId !== 'null') {
        // Fetch work order data
        this.data = await this.assignCrew.getAssignCrewData({
          apiKey: sessionStorage.getItem('api-key'),
          serviceKey: sessionStorage.getItem('service-key'),
          userRole: sessionStorage.getItem('user-role'),
          userName: sessionStorage.getItem('user-name'),
          userCode: sessionStorage.getItem('user-code'),
          wmWorkorderRegisteredId: this.workOrderRegisteredId,
        });

        // Set workorder dates after data is fetched
        this.workorderDate = new Date(this.data?.wmWorkorderRegisteredDTO?.workorderDate);
        this.workorderEndDate = new Date(this.data?.wmWorkorderRegisteredDTO?.workorderEndDate);

        // Re-validate startDate and endDate fields after workorder dates are set
      this.assignCrewForm.get('startDate').updateValueAndValidity();
      this.assignCrewForm.get('endDate').updateValueAndValidity();
      
      // Initialize form with validators
    this.assignCrewForm = this.fb.group({
      store: ['', Validators.required],
      name: ['', Validators.required],
      startDate: ['', [Validators.required, this.validateStartDate.bind(this)]],
      endDate: ['', [Validators.required, this.validateEndDate.bind(this)]]
    });
  
        // Fetch store data
        this.storeData = await this.assignCrew.getAssignCrewStoreData({
          apiKey: sessionStorage.getItem('api-key'),
          serviceKey: sessionStorage.getItem('service-key'),
          userRole: sessionStorage.getItem('user-role'),
          userName: sessionStorage.getItem('user-name'),
          userCode: sessionStorage.getItem('user-code'),
          officeId: sessionStorage.getItem('office-id'), // Assuming officeId is retrieved from sessionStorage
        });
  
        this.employeeOptions = this.storeData;
        this.store = 11;
  
        
      } else {
        alert('Work Order Registered Id not found!');
      }
    });
  
    this.resetForm();
  }
  
  validateStartDate(control: AbstractControl): ValidationErrors | null {
    const startDate = new Date(control.value);
    if (this.workorderDate && this.workorderEndDate) {
      const workorderStart = new Date(this.workorderDate);
      const workorderEnd = new Date(this.workorderEndDate);
      if (startDate < workorderStart || startDate > workorderEnd  ) {
        return { dateRangeError: true }; // Date is out of range
      }
    }
    return null;
  }
  
  validateEndDate(control: AbstractControl): ValidationErrors | null {
    const endDate = new Date(control.value);
    const startDate = new Date(this.assignCrewForm?.get('startDate')?.value);
    if (this.workorderDate && this.workorderEndDate) {
      if (endDate < startDate || endDate > this.workorderEndDate) {
        return { dateRangeError: true }; // End date is before start date or out of range
      }
    }
    return null;
  }
  
  
  
  resetForm() {
    this.assignCrewForm = new FormGroup({
      store: new FormControl('', []),
      name: new FormControl('', Validators.required),
      startDate:new FormControl('',[Validators.required, this.validateStartDate.bind(this)]),
      endDate: new FormControl('',[Validators.required, this.validateStartDate.bind(this)])
    });
  }
  addEmployee() {
    console.log(this.newEmployee);

    if (this.newEmployee.employeeName.trim() === '' && this.newEmployee.designation.trim() === '') {
      return;
    }

    const formattedStartDate = this.formatDate(this.newEmployee.startDate);
    const formattedEndDate = this.formatDate(this.newEmployee.endDate);

    if (formattedEndDate == 'NaN-NaN-NaN' || formattedStartDate == 'NaN-NaN-NaN') {
      return;
    }

    const employee = {
      ...this.newEmployee,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };

    const nextRow = this.employees.length + 1;
    this.employees.splice(nextRow - 1, 0, employee);

    this.newEmployee = {};
  }

  removeEmployee(index: number): void {
    this.employees.splice(index, 1);
  }

  async onEmployeeChange() {
    const selectedEmployee = this.employeeOptions.find((option) => option.employeeName === this.newEmployee.name);
    this.newEmployee = selectedEmployee;

    const designationData = await this.assignCrew.getDesignationData({
      apiKey: sessionStorage.getItem('api-key'),
      serviceKey: sessionStorage.getItem('service-key'),
      userRole: sessionStorage.getItem('user-role'),
      userName: sessionStorage.getItem('user-name'),
      userCode: sessionStorage.getItem('user-code'),
      designationMasterId: selectedEmployee.designationId,
    });
    if (selectedEmployee) {
      this.newEmployee.designation = designationData.designationName;
    } else {
      this.newEmployee.designation = '';
    }
  }

  private formatDate(date: string): string {
    const formattedDate = new Date(date);
    const day = formattedDate.getDate();
    const month = formattedDate.getMonth() + 1;
    const year = formattedDate.getFullYear();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }

  onStoreChange() {
    const s = this.data?.storeMasterDTO.find((store: any) => store.storeMasterId == this.store);
    this.selectedStore = s;
  }

  submitAssignCrew() {
    if (this.employees.length == 0) {
      this.snackBar.open('Please select employee', 'OK');
      return;
    }
    this.isLoading = true;
    let j = 0;
    if (Object.keys(this.selectedStore).length == 0) {
      this.selectedStore = this.data.storeMasterDTO.find((store: any) => store.storeMasterId == 11);
    }
      this.employees.forEach(async (employee: any) => {
      j++;
      // this.loader.show('Saving Assign crews...');
      const d = await this.assignCrew.saveAssignCrewData(
        {
          apiKey: sessionStorage.getItem('api-key'),
          serviceKey: sessionStorage.getItem('service-key'),
          userRole: sessionStorage.getItem('user-role'),
          userName: sessionStorage.getItem('user-name'),
          userCode: sessionStorage.getItem('user-code'),
        },
        {
          wmWorkorderRegisteredDTO: {
            wmWorkorderRegisteredId: this.data.wmWorkorderRegisteredDTO.wmWorkorderRegisteredId,
            storeOfficeId: this.selectedStore.storeMasterId,
            storeCode: this.selectedStore.storeCode,
          },
          woAssignCrewTransLogDTO: [
            {
              wmWorkorderRegisteredId: this.data.wmWorkorderRegisteredDTO.wmWorkorderRegisteredId,
              employeeMasterId: employee.employeeMasterId,
              workStartDate: employee.startDate,
              workEndDate: employee.endDate,
            },
          ],
        },
      );
      console.log(d);
      if (j == this.employees.length) {
        // this.loader.hide();
        const snackBarRef = this.snackBar .open('Assign crew created successfully', 'OK', {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          })
          snackBarRef .onAction()
          .subscribe(() => {
             this.snackBar.dismiss();
            this.router.navigate(['/main/work-order-summary'], {
              queryParams: {
                statusCode: 13,
                label: 'ASSIGN CREW',
              },
            });
            this.isLoading = false;
          });
        // }
       }
    });
  }
   openConfirmationpopupDialog() {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent);
    dialogRef.afterClosed().subscribe((result) => {
        if ( result === 'yes') {
            this.submitAssignCrew();
        
        }
    });
  }
  
  isValidForm(): boolean {
    this.assignCrewForm.markAllAsTouched();
    console.log('Form Valid?', this.assignCrewForm.valid);
    let hasError = false;
    Object.keys(this.assignCrewForm.controls).forEach((key) => {
      const control = this.assignCrewForm.get(key);
  
      if (control && (control.invalid || control.untouched)) {
        hasError = true;
      }
    });
  
    if (hasError) {
      this.error = 'Please Fill Out Mandatory Fields';
      return false;
    } else {
      this.error = '';
      return true;
    }
  }
  navigate(label, code) {
    this.router.navigate(['/main/work-order-summary'], {
      queryParams: {
        type: this.type,
        label: label,
        statusCode: code,
      },
    });
  }
}
