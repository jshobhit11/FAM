import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EstimateFormsComponent } from 'src/app/estimate-forms/estimate-forms.component';
@Component({
  selector: 'app-save-template-confirm',
  templateUrl: './save-template-confirm.component.html',
  styleUrls: ['./save-template-confirm.component.scss'],
})
export class SaveTemplateConfirmComponent implements OnInit {
  estimationName: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EstimateFormsComponent>) {}

  ngOnInit() {
    if (this.data) {
      this.estimationName = this.data;
    }
  }

  saveData() {
    const data: any = { estimationName: this.estimationName };
    this.dialogRef.close(data);
  }
}
