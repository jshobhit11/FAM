import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WorkExecutionService } from '../../../services/work-execution.service';
import { MatDialog } from '@angular/material/dialog';
import { PopUpComponent } from 'src/app/lr-le-meter-power-approval/pop-up/pop-up.component';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-work-execution-details',
  templateUrl: './work-execution-details.component.html',
  styleUrls: ['./work-execution-details.component.scss'],
})
export class WorkExecutionDetailsComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private workExecutionService: WorkExecutionService,
    private dialog: MatDialog,
    private loader: LoaderService,
  ) {}

  type: any;
  data: any = {};
  materialData: any = { data: {} };
  originalMaterialData: any = {};
  spanMaterialData: any = {};
  actualQuantityData: any = {};
  actualQuantityMaterialData: any = {};
  spanData: any = {};
  form: any = {};
  workOrderEstmationLogDTO: any = [];
  wmWorkorderStructureLogDTO: any = [];
  wmWorkorderStructureLogDTOMergeData: any = [];
  wmWorkorderEstimationLogDTOMergeData: any = [];
  amAssetRegisterLogDTO: any = [];
  materialActualQuantityData: any = [];
  remarks: any;
  isClose: boolean = false;
  isButtonDisabled: boolean = false;
  flattenedSpanData: any[] = [];

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      const workOrderRegisteredId = params['workOrderRegisteredId'];
      this.type = params['type'];

      const localData = sessionStorage.getItem(`${workOrderRegisteredId}`);
      if (localData) {
        const parsedData = JSON.parse(localData);
        this.data = parsedData.data ? JSON.parse(parsedData.data) : {};
        this.materialData = parsedData.materialModalData
          ? JSON.parse(parsedData.materialModalData)
          : { data: [] };
        this.actualQuantityData = parsedData.actualQuantityData
          ? JSON.parse(parsedData.actualQuantityData)
          : [];
        this.spanData = parsedData.spanData
          ? JSON.parse(parsedData.spanData)
          : {};
        this.form = parsedData.formData ? JSON.parse(parsedData.formData) : {};
        this.remarks = parsedData.remarks || '';
      }
      this.data.EstRegisteredResponse.forEach((response) => {
        if (
          response.materialType == 'METER' &&
          response.isUploadSerialMaterial == '0'
        ) {
          response.amAssetCategoryMaterialMasterId = '0';
        }
      });

      // Material Data
      const flattenedMaterialData = [];
      for (const partKey of Object.keys(this.materialData)) {
        flattenedMaterialData.push(...this.materialData[partKey]);
      }
      const uniqueMaterialDataMap = new Map();

      flattenedMaterialData.forEach((item: any) => {
        const hasValidStructure =
          item.sno !== undefined &&
          item.materialCode &&
          item.part &&
          item.structure &&
          item.assetizedQuantity !== undefined &&
          item.totalQuantity !== undefined &&
          item.isDTStructure !== undefined &&
          item.estimationMaterialsRegisteredId;
        if (hasValidStructure && Number(item.assetizedQuantity) > 0) {
          const key = `${item.estimationMaterialsRegisteredId}-${item.structure}`;

          if (!uniqueMaterialDataMap.has(key)) {
            uniqueMaterialDataMap.set(key, item);
          }
        }
      });
      this.materialData.data = Array.from(uniqueMaterialDataMap.values());

      // Process actualQuantityData
      this.materialActualQuantityData = [];
      if (
        typeof this.actualQuantityData === 'object' &&
        this.actualQuantityData !== null
      ) {
        for (const [partKey, partArray] of Object.entries(
          this.actualQuantityData
        )) {
          const basePartKey = partKey.split('_')[0];
          if (Array.isArray(partArray)) {
            partArray.forEach((detail: any) => {
              this.materialActualQuantityData.push({
                ...detail,
                part: basePartKey,
              });
            });
          }
        }
      }

      // Flatten spanData
      if (!this.spanData) {
        this.spanData = {};
      }

      this.flattenedSpanData = [];
      Object.keys(this.spanData).forEach((partKey) => {
        const partInfo = this.spanData[partKey];
        const partName = partInfo.workPart || partKey.split('-')[0].trim();
        const spansArray = partInfo.data || [];

        spansArray.forEach((span: any, index: number) => {
          this.flattenedSpanData.push({
            ...span,
            part: partName,
            slNo: index + 1,
          });
        });
      });

      this.wmWorkorderStructureLogDTO = [
        ...this.materialData.data.map((item: any) => ({
          wmWorkorderRegisteredId:
            this.data.WmWorkorderRegistered.wmWorkorderRegisteredId,
          structureType: ['3-Structure', '2-Structure', '1-Structure'].includes(
            item.structure
          )
            ? 'pole'
            : 'span',
          structure: item.structure || item.span,
          assetiziedQuantity: item.assetizedQuantity || 0,
          totalQuantity: item.totalQuantity || 0,
          isDtStructure: item.isDTStructure,
          isBusbarStructure: item.isBusbar ||'',
          lengthKm: item.length || 0,
          estimationMaterialsRegisteredId:
            item.estimationMaterialsRegisteredId || 0,
        })),
        ...this.flattenedSpanData.map((span: any) => ({
          wmWorkorderRegisteredId:
            this.data.WmWorkorderRegistered.wmWorkorderRegisteredId,
          structureType: ['3-Structure', '2-Structure', '1-Structure'].includes(
            span.structure
          )
            ? 'pole'
            : 'span',
          structure: span.structure || span.span,
          assetiziedQuantity: span.assetizedQuantity || 0,
          totalQuantity: span.totalQuantity || 0,
          isDtStructure: span.isDtStructure || '',
          isBusbarStructure: span.isBusbar || '',
          lengthKm: span.length || 0,
          estimationMaterialsRegisteredId:
            span.estimationMaterialsRegisteredId || 0,
        })),
        ...this.materialActualQuantityData.map((material: any) => ({
          wmWorkorderRegisteredId:
            this.data.WmWorkorderRegistered.wmWorkorderRegisteredId,
          structureType: 'dt',
          structure: material.part,
          estimationMaterialsRegisteredId:
            material.estimationMaterialsRegisteredId || 0,
          materialCode: material.materialCode,
          serialNo: material.serialNo,
          badgeNumber: material.badgeNumber,
          manufacture: material.manufacture,
        })),
      ];

      // Populate workOrderEstmationLogDTO with merged data
      this.workOrderEstmationLogDTO = [
        ...(this.data?.EstRegisteredResponse || []),
        ...(this.data?.EstimationLabourResponse || []),
      ].map((span: any) => ({
        wmWorkorderRegisteredId:
          this.data.WmWorkorderRegistered.wmWorkorderRegisteredId,
        estimationRegisteredId: span?.estimationRegisteredId || 0,
        estimationWorkScopeDataId: span?.estimationWorkScopeDataId || 0,
        estimationMaterialsRegisteredId:
          span?.estimationMaterialsRegisteredId || 0,
        estimationMaterialLabourDetailsId:
          span?.estimationMaterialLabourDetailsId || 0,
        materialsLabourMasterId: span.materialsMasterId || '',
        estimatedQuantity: span.estimatedQuantity || span.quantity || 0,
        drawnQuantity: span.drawnQuantity || 0,
        returnedQuantity: span.returnedQuantity || 0,
        actualQuantity: span.actualQuantity || span.quantity || 0,
        workPart: span.workPart || '',
        unit: span.materialUnit || span.unit || '',
        rate: span.materialRate || span.rate || 0,
        amount: span.materialAmount || span.amount || 0,
        isUploadedSerialMaterial: span.isUploadSerialMaterial || 0,
        isPoleStructure: span.isPoleStructure || 0,
        isSpanStructure: span.isSpanStructure || 0,
        amAssetCategoryMaterialMasterId:
          span.amAssetCategoryMaterialMasterId || 0,
        noStockFlag: span.noStockFlag || '',
        qtyByVendor: span.qtyByVendor || 0,
        remarks: span.remarks || '',
      }));
    });
  }

  getPartKeys(): string[] {
    return Object.keys(this.spanData);
  }
  openCloseDialog(): void {
    const dialogRef = this.dialog.open(PopUpComponent, {
      data: { action: 'close' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.closeWorkExecution();
      }
    });
  }

  async closeWorkExecution() {
    if (this.isButtonDisabled) {
      return;
    }
    this.isButtonDisabled = true;
    this.loader.show('Closing Work Execution...');
    try {
      const submit = await this.workExecutionService.saveWorkExecutionData(
        {
          apiKey: sessionStorage.getItem('api-key'),
          serviceKey: sessionStorage.getItem('service-key'),
          userRole: sessionStorage.getItem('user-role'),
          userName: sessionStorage.getItem('user-name'),
          userCode: sessionStorage.getItem('user-code'),
        },
        {
          wmWorkorderStructureLogDTO: this.wmWorkorderStructureLogDTO,
          amAssetRegisterLogDTO: [
            {
              wmWorkorderRegisteredId:
                this.data.WmWorkorderRegistered.wmWorkorderRegisteredId,
            },
          ],
          wmWorkorderRegisteredDTO: {
            wmWorkorderRegisteredId:
              this.data.WmWorkorderRegistered.wmWorkorderRegisteredId,
            workorderExecutionRemarks: this.remarks,
            workorderInstallationDate: this.form.workorderInstallationDate,
          },
          wmWorkorderEstimationLogDTO: [...this.workOrderEstmationLogDTO],
        }
      );
  
      if (submit.messageType === 'SUCCESS') {
        this.loader.hide();
        const snackBarRef = this.snackBar.open(
          submit.message || 'Work execution created successfully',
          'OK',
          {
            verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          }
        );
  
        snackBarRef.onAction().subscribe(() => {
          sessionStorage.removeItem(
            `${this.data.WmWorkorderRegistered.wmWorkorderRegisteredId}`
          );
  
          snackBarRef.dismiss();
          if (
            this.data &&
            this.data.EstimationRegistered &&
            this.data.EstimationRegistered.workCategory !==
              'Repairs & Maintenance Works'
          ) {
            this.router.navigate(['/main/edit-work-execution'], {
              queryParams: {
                wmWorkorderRegisteredId:
                  this.data.WmWorkorderRegistered.wmWorkorderRegisteredId,
              },
            });
          }
          this.isButtonDisabled = false;
        });
      } else if (submit.messageType == 'FAILURE') {
        this.loader.hide();
        const errorMessage = submit.messageText.includes('rolled')
        ? 'Data not saved successfully'
        : submit.messageText;
    
      this.snackBar.open(errorMessage, 'OK', {
        verticalPosition: cordova !== undefined ? 'bottom' : 'top',
      });
    
        this.isButtonDisabled = false;
      }
    } catch (error) {
      this.loader.hide();
      console.error('Error during work execution save:', error);
      this.snackBar.open(
        error.message || 'An error occurred. Please try again later.',
        'OK',
        {
          verticalPosition: cordova !== undefined ? 'bottom' : 'top',
          duration: 5000,
        }
      );
      this.isButtonDisabled = false;
    }
  }
  
  onCheckboxChange(e: any) {
    console.log(e);
    if (e == true) {
      this.isClose = true;
    }
    if (e == false) {
      this.isClose = false;
    }
  }
  navigate() {
    const staticKey = 'workOrderData';
    const encodedKey = btoa(staticKey); 
    this.router.navigate(['/main/work-execution'], {
      queryParams: {
        workOrderRegisteredId:
          this.data.WmWorkorderRegistered.wmWorkorderRegisteredId,
        type: this.type,
        key: encodedKey,
      },
    });
    const workOrderRegisteredId = this.data.WmWorkorderRegistered.wmWorkorderRegisteredId;
    sessionStorage.setItem(`${workOrderRegisteredId}`, JSON.stringify({
      data: this.data,
      materialModalData: this.materialData,
      actualQuantityData: this.actualQuantityData,
      spanData: this.spanData,
      formData: this.form,
      remarks: this.remarks,
    }));
  }
}
