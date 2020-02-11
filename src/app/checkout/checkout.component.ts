import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { IShoppingCartItem } from '../models/shopping-cart-item';
import { OrderService } from '../services/order.service';
import { IShippingOption } from '../models/shipping-option';
import { MatDialog } from '@angular/material/dialog';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  pageTitle: string = "Checkout";
  shoppingCartitems: IShoppingCartItem[] = [];
  shippingOptions: IShippingOption[] = [];
  shippingCost;

  constructor(private cartService: CartService, private orderService: OrderService, public dialog: MatDialog,) { }

  ngOnInit() {
    this.shoppingCartitems = this.cartService.getItems();
    this.orderService.getShippingOptions().subscribe(
      (shippingOptions) => {
        this.shippingOptions = shippingOptions;
        this.shippingCost = this.shippingOptions[0].cost;
      }
    )
  }

  getShoppingCartTotal(): number {
    return this.cartService.getTotalCost();
  }

  getShoppingCartQuantity(): number {
    return this.cartService.getItemCount();
  }

  openDialog(data): void {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '400px',
      data: data
    });
  }
  
  payWithCard(){
    this.openDialog({
      title: 'Payment',
      message: "Please enter your payment card details.",
      shippingId: this.shippingCost ? 2 : 1
    })
  }

}
