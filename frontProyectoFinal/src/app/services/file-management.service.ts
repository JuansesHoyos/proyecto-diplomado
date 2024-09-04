import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Doc} from "../class/doc";
import {User} from "../class/user";

@Injectable({
  providedIn: 'root'
})
export class FileManagementService {

  private apiUrlBase = 'http://127.0.0.1:8000/';
  private uploadFile = 'upload-file/'
  constructor(private http: HttpClient) { }

  subirArchivo(b64: string,document: Doc){
    let payload = {"doc": b64, "owner": document.owner}

    const authToken = localStorage.getItem("jwt_token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });
    return this.http.post<User>(
      `${this.apiUrlBase}${this.uploadFile}`,
      payload,
      { headers }
    );
  }
}
