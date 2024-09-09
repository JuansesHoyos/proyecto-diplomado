import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from "rxjs";
import { User } from "../class/user";

@Injectable({
  providedIn: 'root'
})
export class KeysService {

  private apiUrlBase = 'http://localhost:8081/api/';
  private apiGenerateKeys = 'generate-keys/'
  private getKeys = 'getKeys';

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
    const params = new HttpParams().set('user', username);
    return this.http.get<User[]>(this.apiUrlBase + this.getKeys, { headers, params });
  }
}
