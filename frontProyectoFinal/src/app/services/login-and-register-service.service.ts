import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Login } from "../class/login";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginAndRegisterServiceService {

  constructor(private http: HttpClient) { }

  private apiUrlBase = 'http://localhost:8080/api/';
  private register = 'register/';
  private login = 'login/';

  registerMethod(loginClass: Login):Observable<Login> {
    console.log(this.http.get<string>(this.apiUrlBase));
    return this.http.post<Login>(this.apiUrlBase+this.register, loginClass);
  }

  loginMethod(loginClass: Login):Observable<Login> {
    console.log(this.http.get<string>(this.apiUrlBase));
    return this.http.post<Login>(this.apiUrlBase+this.login, loginClass);
  }

}
