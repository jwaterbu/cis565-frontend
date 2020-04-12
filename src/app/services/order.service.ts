import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { AuthenticationService } from './authentication.service';
import { IOrder } from '../models/order';
import { Observable } from 'rxjs/internal/Observable';
import { IShippingOption } from '../models/shipping-option';
import { IProduct } from '../models/product';
import { IOrderProduct } from '../models/order-product';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  getUserOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`${environment.apiUrl}/orders`, { headers: this.auth.getHeader() });
  }

  getShippingOptions(): Observable<IShippingOption[]> {
    return this.http.get<IShippingOption[]>(`${environment.apiUrl}/shipping-options`, { headers: this.auth.getHeader() });
  }

  submitOrder(shippingId: number) {
    return this.http.post<any>(`${environment.apiUrl}/orders`, {
      shippingOptionId: shippingId
    }, { headers: this.auth.getHeader() })
  }

  getOrderProductDetail(orderProduct:IOrderProduct) {
    return this.http.get<IProduct>(`${environment.apiUrl}/products/${orderProduct.productId}`, { headers: this.auth.getHeader() });
  }
}
