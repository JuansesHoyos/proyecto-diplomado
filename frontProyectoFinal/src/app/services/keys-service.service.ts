import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { User } from "../class/user";

@Injectable({
  providedIn: 'root'
})
export class KeysService {

  private apiUrlBase = 'http://127.0.0.1:8000/';
  private apiGenerateKeys = 'generate-keys/'
  private getFromUser = 'getPublicKey/'

  constructor(private http: HttpClient) { }

  getUsuarios(username: string):Observable<User> {
    return this.http.get<User>(this.apiUrlBase+this.getFromUser+"/"+username);
  }

  generarLlaves(username: string): Observable<User> {
    const payload = { username };
    return this.http.post<User>(this.apiUrlBase+this.apiGenerateKeys, payload);
  }



}
