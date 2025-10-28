import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { WorkExecutionService } from 'src/app/services/work-execution.service';
import { WorkExecutionComponent } from '../work-execution.component';

@Component({
  selector: 'app-work-execution-material',
  templateUrl: './work-execution-material.component.html',
  styleUrls: ['./work-execution-material.component.scss'],
})
export class WorkExecutionMaterialComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private workExecutionService: WorkExecutionService,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<WorkExecutionComponent>
  ) {}
  materialData: any = [];
  workOrderNo: any;
  ngOnInit() {
    this.workOrderNo = this.data.workOrderNo;
    this.route.queryParams.subscribe(async (params: ParamMap) => {
      this.materialData =
        await this.workExecutionService.getWorkOrderCreditData({
          apiKey: sessionStorage.getItem('api-key'),
          serviceKey: sessionStorage.getItem('service-key'),
          userRole: sessionStorage.getItem('user-role'),
          userName: sessionStorage.getItem('user-name'),
          userCode: sessionStorage.getItem('user-code'),
          wmWorkorderRegisteredId: this.data.workOrderRegisteredId,
        });
      console.log(this.materialData);
    });
  }
  onClose() {
    this.dialogRef.close({});
  }
}
