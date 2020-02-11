import { Injectable, OnInit } from '@angular/core';
import { IReview } from '../models/review';
import { IProduct } from '../models/product';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';
import { IUser } from '../models/user';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService implements OnInit {

  reviews: IReview[] = [];
  product: IProduct;

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  ngOnInit(): void {
  }

  getUserReviews(): Observable<IReview[]> {
    return this.http.get<IUser>(`${environment.apiUrl}/users/me`, { headers: this.auth.getHeader() }).pipe(map(user => {
      if (user) {
        return user.reviews;
      }
    }))
  }

  getProductReviews(productId: number): Observable<any> {
    return this.http.get<IReview[]>(`${environment.apiUrl}/products/${productId}/reviews`, { headers: this.auth.getHeader() })
      .pipe(tap(data => data),
        catchError(this.handleError)
      );
  }

  addReview(productId: number, title: string, body: string, rating: number): Observable<any> {
    return this.http.post<IReview>(`${environment.apiUrl}/products/${productId}/reviews`, { title, body, rating }, { headers: this.auth.getHeader() })
      .pipe(tap(data => data),
        catchError(this.handleError));
  }

  deleteReview(productId: number, reviewId: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/products/${productId}/reviews/${reviewId}`, { headers: this.auth.getHeader() })
      .pipe(tap(data => data),
        catchError(this.handleError));
  }

  updateReview(productId: number, reviewId: number, title: string, body: string, rating: number): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/products/${productId}/reviews/${reviewId}`, { title, body, rating }, { headers: this.auth.getHeader() })
      .pipe(tap(data => data),
        catchError(this.handleError));
  }

  getDate(): string {
    let month = new Date().getMonth() + 1;
    return month + "/" + new Date().getDate() + "/" + new Date().getFullYear();
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
