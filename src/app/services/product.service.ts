import { Injectable } from '@angular/core';
import { IProduct } from '../models/product';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { environment } from 'src/environments/environment.prod';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  getProduct(id: number): Observable<IProduct | undefined> {
    return this.getProducts()
      .pipe(
        map((products: IProduct[]) => products.find(p => p.id === id))
      );
  }

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${environment.apiUrl}/products`).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(p: any): Observable<IProduct> {
    return this.http.put<IProduct>(`${environment.apiUrl}/products/${p.id}`, {
      id: p.id,
      title: p.title,
      description: p.description,
      categoryId: p.categoryId,
      price: p.price,
      small_image_path: p.small_image_path,
      large_image_path: p.large_image_path
    }, { headers: this.auth.getHeader() }).pipe(
      (product) => {
        if (product)
          return product;
      },
      catchError(this.handleError)
    );
  }

  createProduct(p: any): Observable<IProduct> {
    return this.http.post<IProduct>(`${environment.apiUrl}/products`, {
      title: p.title,
      description: p.description,
      categoryId: p.categoryId,
      price: p.price,
      small_image_path: p.small_image_path,
      large_image_path: p.large_image_path
    }, { headers: this.auth.getHeader() }).pipe(
      (product) => {
        if (product)
          return product;
      },
      catchError(this.handleError)
    );
  }

  deleteProduct(id: any) {
    return this.http.delete<IProduct>(`${environment.apiUrl}/products/${id}`, { headers: this.auth.getHeader() }).pipe(
      (product) => {
        if (product)
          return product;
      },
      catchError(this.handleError)
    );
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