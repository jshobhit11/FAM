import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss'],
})
export class PopUpComponent implements OnInit {
  action:
    | 'approve'
    | 'submit'
    | 'forward'
    | 'return'
    | 'edit'
    | 'sanction'
    | 'approve_serve'
    | 'forward_serve'
    | 'return_serve'
    | 'close'
    | 'execution_edit'
    | 'estimation_approve'
    | 'generate_bmr'
    | 'i_approve'
    | 're-generate'
    | 'bmr_save'
    | 'return_site_inspection'
    | 'after-approval'

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      action:
        | 'approve'
        | 'submit'
        | 'forward'
        | 'return'
        | 'edit'
        | 'sanction'
        | 'approve_serve'
        | 'forward_serve'
        | 'return_serve'
        | 'close'
        | 'execution_edit'
        | 'estimation_approve'
        | 'generate_bmr'
        | 'i_approve'
        | 're-generate'
        | 'bmr_save'
        | 'return_site_inspection'
        | 'after-approval'
    }
  ) {
    this.action = data.action;
  }

  ngOnInit(): void {}
}
