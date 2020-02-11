import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { IUser } from '../models/user';
import { OrderService } from '../services/order.service';
import { ReviewService } from '../services/review.service';
import { IReview } from '../models/review';
import { IOrder } from '../models/order';
import { ProductService } from '../services/product.service';
import { pipe } from 'rxjs/internal/util/pipe';
import { map } from 'rxjs/internal/operators/map';
import { IOrderProduct } from '../models/order-product';
import { IProduct } from '../models/product';
import { IOrderProductRenew } from '../models/order-product-renew';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  pageTitle: string = "Profile";
  currentUser: IUser;
  userReviews: IReview[];
  userOrders: IOrder[];
  orderProductRenew: IOrderProductRenew[];

  constructor(private authenticationService: AuthenticationService,
    private orderService: OrderService,
    private reviewService: ReviewService,
    private productService: ProductService) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.reviewService.getUserReviews().subscribe((reviews) => {
      this.userReviews = reviews;
    });

    this.orderProductRenew = [];
    this.orderService.getUserOrders().subscribe((orders: IOrder[]) => {
      this.userOrders = orders;
      if (orders.length) {
        orders.map((order: IOrder) => {
          order.order_products.map((orderProduct: IOrderProduct) => {
            this.orderService.getOrderProductDetail(orderProduct).subscribe(
              (product: IProduct) => {
                let orderProductRenew: IOrderProductRenew = {
                  id: orderProduct.id,
                  price: orderProduct.price,
                  quantity: orderProduct.quantity,
                  createdAt: orderProduct.createdAt,
                  updatedAt: orderProduct.updatedAt,
                  productId: orderProduct.productId,
                  orderId: orderProduct.orderId,
                  product: product
                }
                this.orderProductRenew.push(orderProductRenew);
              }
            )
          }
          )
        })
      };
    }
    );
  }

  getProductById(id) {
    return this.productService.getProduct(id).subscribe();
  }


  findOrderProduct(id: number): IOrderProductRenew {
    console.log("Looking for id:", id, " in ", this.orderProductRenew);
    return this.orderProductRenew.find((orderProduct) => orderProduct.id == id);
  }

  getTotalCount(order_products: IOrderProduct[]){
    return (order_products.length) ? order_products.map(this.quantity).reduce(this.sum) : 0;
  }

  quantity(item: IOrderProduct) {
    return item.quantity;
  }

  sum(prev, next) {
    return prev + next;
  }
}
