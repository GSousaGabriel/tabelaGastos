import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  setAuthToken(token: string){
    localStorage.setItem("authToken", token)
  }

  getAuthToken(){
    return localStorage.getItem("authToken");
  }
}
