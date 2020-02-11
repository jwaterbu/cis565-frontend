import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment.prod"
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { IUser } from '../models/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<IUser>;
  public currentUser: Observable<IUser>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<IUser>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): IUser {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {

    return this.http.post<any>(`${environment.apiUrl}/login`, { email, password })
      .pipe(map(token => {
        // login successful if there's a jwt token in the response
        if (token) {
          // store jwt details in local storage
          localStorage.setItem('currentToken', token.jwt);
          return token.jwt;
        }
      }));
  }

  saveUser() {
    // get user details and store user details in local storage
    return this.http.get<IUser>(`${environment.apiUrl}/users/me`, { headers: this.getHeader() }).pipe(map(user => {
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }
    }))
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentToken');
    this.currentUserSubject.next(null);
  }

  getHeader(): HttpHeaders {
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('x-auth-token', localStorage.getItem('currentToken'));
  }
}