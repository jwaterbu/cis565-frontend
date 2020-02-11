import { Injectable } from '@angular/core';
import { IProduct } from '../models/product';
import { BehaviorSubject, Observable, throwError, pipe } from 'rxjs';
import { IShoppingCartItem } from '../models/shopping-cart-item';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { ICartProduct } from '../models/cart-product';
import { AuthenticationService } from './authentication.service';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private itemCount = new BehaviorSubject<number>(0);
  currentItemCount = this.itemCount.asObservable();
  cartProducts: ICartProduct[];
  items: IShoppingCartItem[] = [];

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  cartCountChange(count: number) {
    this.itemCount.next(count);
  }

  loadCartProducts() {
    this.items = [];
    return this.http.get<ICartProduct[]>(`${environment.apiUrl}/cart-products`, { headers: this.auth.getHeader() }).pipe(
      map((cartProducts: ICartProduct[]) => {
        if (cartProducts.length) {
          cartProducts.map((cartProduct: ICartProduct) => {
            this.http.get<IProduct>(`${environment.apiUrl}/products/${cartProduct.productId}`, { headers: this.auth.getHeader() }).subscribe(
              (product: IProduct) => {
                let shoppingCartItem: IShoppingCartItem = {
                  cartProductId: cartProduct.id,
                  userId: cartProduct.userId,
                  product: product,
                  quantity: cartProduct.quantity
                };
                this.items.push(shoppingCartItem);
                this.cartCountChange((this.items.length) ? this.items.map(this.quantity).reduce(this.sum) : 0);
              },
            )
          })
        } else {
          this.cartCountChange(0);
        }
      }
      ),
      catchError(this.handleError)
    )
  }

  updateCart(product: IProduct, quantity?: number) {
    let existingItem = this.items.find(p => p.product.id === product.id)
    if (existingItem) {
      let newQuantity = (quantity) ? quantity : existingItem.quantity + 1;
      return this.updateCartProduct(existingItem.cartProductId, existingItem.product.id, newQuantity);
    } else {
      return this.addCartProduct(product.id, 1);
    }
  }

  updateCartProduct(cartId: number, productId: number, quantity: number) {
    return this.http.put<any>(`${environment.apiUrl}/cart-products/${cartId}`, {
      productId: productId,
      quantity: quantity
    }, { headers: this.auth.getHeader() }).pipe(
      tap(() => { },
        catchError(this.handleError)
      ));
  }

  addCartProduct(productId: number, quantity: number) {
    return this.http.post<any>(`${environment.apiUrl}/cart-products`, {
      productId: productId,
      quantity: quantity
    }, { headers: this.auth.getHeader() }).pipe(
      tap(() => { },
        catchError(this.handleError)
      ));
  }

  quantity(item: IShoppingCartItem) {
    return item.quantity;
  }

  sum(prev, next) {
    return prev + next;
  }

  removeItem(id: number) {
    let itemToDelete = this.items.find(item => item.product.id == id);
    return this.http.delete<any>(`${environment.apiUrl}/cart-products/${itemToDelete.cartProductId}`,
      { headers: this.auth.getHeader() }).pipe(
        tap(() => { },
          catchError(this.handleError)
        ));
  }

  getItems(): IShoppingCartItem[] {
    return this.items
  }

  clearCart() {
    this.items = [];
    this.cartCountChange(0);
    return this.items;
  }

  getTotalCost(): number {
    let totalCost = 0;
    this.items.forEach(item => {
      totalCost += item.product.price * item.quantity
    })
    return totalCost;
  }

  getItemCount(): number {
    return (this.items.length) ? this.items.map(this.quantity).reduce(this.sum) : 0;
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
