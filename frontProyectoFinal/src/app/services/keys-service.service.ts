import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from "rxjs";
import { User } from "../class/user";

@Injectable({
  providedIn: 'root'
})
export class KeysService {

  private apiUrlBase = 'http://localhost:8000/';
  private apiGenerateKeys = 'generate-keys/'
  private getKeys = 'getKeys/?user=';

  constructor(private http: HttpClient) { }

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

  getKeysFromUser(username: string): Observable<User[]> {
    const authToken = localStorage.getItem("jwt_token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });
    // @ts-ignore
    return this.http.get(this.apiUrlBase+this.getKeys+username, {headers})
  }
}
