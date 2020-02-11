import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { map } from 'rxjs/internal/operators/map';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  addUser(username: string, email: string, password: string) {

    return this.http.post<any>(`${environment.apiUrl}/users`, { username, email, password })
      .pipe(map(user => {
        if (user) {
          return user;
        }
      }));
  }
}
