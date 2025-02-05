import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getAuthToken(){
    return "679d5f00c2fcc064a4f65070"
  }
}
