import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

export interface DialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private router: Router) { }

  ngOnInit() {
  }

  continueShoppingClick(): void {
    this.dialogRef.close();
  }

  checkoutClick(): void {
    this.router.navigate(['/checkout']);
    this.dialogRef.close()
  }
}
