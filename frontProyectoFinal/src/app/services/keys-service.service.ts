import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
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
    return this.http.get<User>(this.apiUrlBase+this.getFromUser+"?user="+username);
  }

  generarLlaves(username: string, identificador: string): Observable<User> {
    const payload = { username , identificador};

    const authToken = localStorage.getItem("jwt_token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });

    return this.http.post<User>(
      `${this.apiUrlBase}${this.apiGenerateKeys}`,
      payload,
      { headers }
    );
  }
}
