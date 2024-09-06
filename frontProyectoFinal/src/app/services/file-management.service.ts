import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Doc} from "../class/doc";
import {User} from "../class/user";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileManagementService {

  private apiUrlBase = 'http://127.0.0.1:8000/';
  private uploadFile = 'upload-file/';
  private getFiles = 'get_files_from_owner/?owner=';
  private deleFile = 'delete_files_from_owner/?documentid=';
  private getSharedsUrl = 'get_shareds/?username=';
  private shareWith = 'share_document/';
  constructor(private http: HttpClient) { }

  subirArchivo(b64: string,document: Doc){
    let payload = {"doc": b64, "owner": document.owner, "name": document.name}

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

  getFilesFromUser(owner: string): Observable<Doc[]> {
    const authToken = localStorage.getItem("jwt_token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });
    return this.http.get<Doc[]>(
      this.apiUrlBase+this.getFiles+owner,
      { headers }
    );
  }

  deleteFile(documentid: string): Observable<string>{
    const authToken = localStorage.getItem("jwt_token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });
    return this.http.get<string>(
      this.apiUrlBase+this.deleFile+documentid,
      { headers }
    );
  }

  getShareds(username: string): Observable<Doc[]> {
    const authToken = localStorage.getItem("jwt_token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });
    return this.http.get<Doc[]>(
      this.apiUrlBase+this.getSharedsUrl+username,
      { headers }
    );
  }

  shareWithUser(documentid: string, new_share: string): Observable<string> {
    console.log("documentid",documentid);
    console.log("new_share",new_share);
    const authToken = localStorage.getItem("jwt_token");
    const payload = {documentid, new_share};
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });
    return this.http.post<string>(
      `${this.apiUrlBase}${this.shareWith}`,
      payload,
      { headers }
    );
  }
}
