import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { environment } from 'src/environments/environment.prod';
import { AuthenticationService } from './authentication.service';
import { IUser } from '../models/user';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  addUser(username: string, email: string, password: string) {

    return this.http.post<any>(`${environment.apiUrl}/users`, { username, email, password })
      .pipe(map(user => {
        if (user) {
          return user;
        }
      }));
  }

  updateUser(id: number, username: string, email: string, admin: boolean) {

    return this.http.put<any>(`${environment.apiUrl}/users/${id}`, { username, email, admin }, { headers: this.auth.getHeader() })
      .pipe(map(user => {
        if (user) {
          return user;
        }
      }));
  }

  getUser(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${environment.apiUrl}/users/${id}`, { headers: this.auth.getHeader() })
      .pipe(map(user => {
        if (user) {
          return user;
        }
      }));
  }

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${environment.apiUrl}/users`, { headers: this.auth.getHeader() })
      .pipe(map(users => {
        if (users) {
          return users;
        }
      }));
  }

  deleteUser(userId: number): Observable<IUser> {
    return this.http.delete<IUser>(`${environment.apiUrl}/users/${userId}`, { headers: this.auth.getHeader() })
      .pipe(map(user => {
        if (user) {
          return user;
        }
      }), catchError(this.handleError));
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
