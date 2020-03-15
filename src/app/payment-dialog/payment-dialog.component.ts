import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CartService } from '../services/cart.service';

export interface DialogData {
  title: string;
  message: string;
  shippingId: number;
}

function numberValidator(control: AbstractControl): { [key: string]: any } | null {
  const valid = /^\d+$/.test(control.value)
  return valid ? null : { invalidNumber: { valid: false, value: control.value } }
}

function dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const diff = new Date(control.value).getTime() - new Date().getTime();
  return diff >= 0 ? null : { dateValidator: true }
}

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.css']
})
export class PaymentDialogComponent implements OnInit {

  paymentForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private router: Router,
    private orderService: OrderService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private cartService: CartService) { }

  ngOnInit() {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, numberValidator, Validators.maxLength(16), Validators.minLength(16)]],
      date: ['', [Validators.required, dateValidator]],
      cvc: ['', [Validators.required, numberValidator, Validators.maxLength(4), Validators.minLength(3)]]
    });
  }

  get f() { return this.paymentForm.controls; }

  exit() {
    this.dialogRef.close();
  }

  pay() {
    this.orderService.submitOrder(this.data.shippingId).subscribe(() => {
      this.cartService.clearCart();
      this.dialogRef.close();
      this.router.navigate(['/welcome']);
      this._snackBar.open('Payment accepted. Order submitted successfully.', '', {
        duration: 5000
      });
    })
  }

}
