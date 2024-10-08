import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Doc} from "../class/doc";
import {User} from "../class/user";
import {Observable} from "rxjs";
import {Sings} from "../class/sings";

@Injectable({
  providedIn: 'root'
})
export class FileManagementService {

  private apiUrlBase = 'http://localhost:8081/api/';
  private uploadFile = 'upload-file/';
  private getFiles = 'get_files_from_owner/';
  private deleFile = 'delete_files_from_owner';
  private getSharedsUrl = 'get_shareds/';
  private shareWith = 'share_document/';
  private signFile = 'sign_file/';
  private getSigns = 'viewSignsFromDocument/'

  constructor(private http: HttpClient) {
  }

  subirArchivo(b64: string, document: Doc) {
    let payload = {"doc": b64, "owner": document.owner, "name": document.name}

    const authToken = localStorage.getItem("jwt_token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });
    return this.http.post<User>(
      `${this.apiUrlBase}${this.uploadFile}`,
      payload,
      {headers}
    );
  }

  getFilesFromUser(owner: string): Observable<Doc[]> {
    const authToken = localStorage.getItem("jwt_token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });
    const params = new HttpParams().set('owner', owner);
    return this.http.get<Doc[]>(this.apiUrlBase + this.getFiles, {headers, params});
  }

  deleteFile(documentid: string): Observable<string> {
    const authToken = localStorage.getItem("jwt_token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });
    const params = new HttpParams().set('documentid', documentid);
    return this.http.get<string>(this.apiUrlBase + this.deleFile, {headers, params});
  }

  getShareds(username: string): Observable<Doc[]> {
    const authToken = localStorage.getItem("jwt_token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });
    const params = new HttpParams().set('username', username);
    return this.http.get<Doc[]>(this.apiUrlBase + this.getSharedsUrl, {headers, params});
  }

  shareWithUser(documentid: string, new_share: string): Observable<string> {
    const authToken = localStorage.getItem("jwt_token");
    const payload = {documentid, new_share};
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });
    return this.http.post<string>(
      `${this.apiUrlBase}${this.shareWith}`,
      payload,
      {headers}
    );
  }

  signDocument(document_id: string, private_key: string): Observable<string> {
    let payload = {document_id, private_key};
    const authToken = localStorage.getItem("jwt_token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });
    return this.http.post<string>(
      `${this.apiUrlBase}${this.signFile}`,
      payload,
      {headers}
    );
  }

  viewSings(documentid: string) {
    const authToken = localStorage.getItem("jwt_token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });
    const params = new HttpParams().set('documentid', documentid);
    return this.http.get<Sings[]>(this.apiUrlBase + this.getSigns, {headers, params});
  }
}
