import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { environment } from 'src/environments/environment.prod';
import { AuthenticationService } from './authentication.service';
import { IUser } from '../models/user';
import { Observable } from 'rxjs/internal/Observable';

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

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${environment.apiUrl}/users`, { headers: this.auth.getHeader() })
      .pipe(map(users => {
        if (users) {
          return users;
        }
      }));
  }
}
