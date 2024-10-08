import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Login } from "../class/login";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginAndRegisterServiceService {

  constructor(private http: HttpClient) { }

  private apiUrlBase = 'http://localhost:8081/api/';
  private register = 'register/';
  private login = 'login/';
  private loginGoogle = 'logWithGoogle'

  registerMethod(loginClass: Login):Observable<Login> {
    return this.http.post<Login>(this.apiUrlBase+this.register, loginClass);
  }

  loginMethod(loginClass: Login):Observable<Login> {
    return this.http.post<Login>(this.apiUrlBase+this.login, loginClass);
  }

  loginWithGoogle(email: string, sub: string) {
    let payload = {email, sub};
    return this.http.post<Login>(this.apiUrlBase+this.loginGoogle, payload)
  }

}
