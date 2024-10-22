import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient
  ) { }

  validateLogin(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, user)
  }
}
