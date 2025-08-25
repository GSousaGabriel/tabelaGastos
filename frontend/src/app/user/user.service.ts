import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:32790/api';

  constructor(
    private http: HttpClient
  ) { }

  validateLogin(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/login`, user)
  }

  registerUser(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/register`, user)
  }
}
