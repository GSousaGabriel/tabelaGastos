import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

  validateLogin(user: User){
    if(user.username === "ggs" && user.password === "qqqqqqQ1!"){
      return true
    }
    return false
  }
}
