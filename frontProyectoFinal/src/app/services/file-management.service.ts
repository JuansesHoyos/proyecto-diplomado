import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FileManagementService {

  private apiUrlBase = 'http://127.0.0.1:8000/';
  private uploadFile = 'upload-file/'
  constructor(private http: HttpClient) { }

  subirArchivo(file: File){
    return this.http.post(this.apiUrlBase+this.uploadFile, file);
  }
}
