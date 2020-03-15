import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IConfirmDialogModel } from './confirm-dialog-model';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  title: string;
  message: string;
  btnOkText: string;
  btnCancelText: string;

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IConfirmDialogModel) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
    this.btnOkText = data.btnOkText;
    this.btnCancelText = data.btnCancelText;
  }

  ngOnInit(): void {
  }

  public decline() {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

  public accept() {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

}
