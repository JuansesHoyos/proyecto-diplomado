import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FileManagementService} from "../../services/file-management.service";
import {Doc} from "../../class/doc";
import {JwtHelperService} from "@auth0/angular-jwt";


@Component({
  selector: 'app-file-management',
  standalone: true,
  imports: [CommonModule], // Importa CommonModule aquí
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.css']
})
export class FileManagementComponent {

  files: File[] = [];
  isPopupOpen = false;
  selectedFile: File | null = null;
  helper = new JwtHelperService();
  username: string = '';



  constructor(private filesService: FileManagementService) { }

  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;


    if (input.files) {
        this.selectedFile = input.files[0];
    }


  }

   uploadFiles(): void {
    console.log(this.selectedFile)

    if (this.selectedFile) {
      //let fileB64 =  this.toBase64(this.selectedFile)
      let cosatemp = "";
      this.toBase64(this.selectedFile).then(base64String => {
        cosatemp = base64String;
        console.log("Base64 String:", base64String);
      }).catch(error => {
        console.error("Error:", error);
      });



      let token = localStorage.getItem('jwt_token');
      let decodeToken;
      if (typeof token === "string") {
        decodeToken = this.helper.decodeToken(token);
        this.username = decodeToken.name;
      }
      console.log("fileB64",cosatemp)
      let userDocument = new Doc({
        document: cosatemp,
        owner: this.username,
      })
      console.log("Doc", userDocument.document)
      this.filesService.subirArchivo(userDocument).subscribe();

    }
  }

  toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
        console.log("base64String", base64String)
      };

      reader.onerror = error => reject(error);
    });
  }





  openPopup(file: File): void {
    this.selectedFile = file;
    this.isPopupOpen = true;
  }

  closePopup(): void {
    this.isPopupOpen = false;
    this.selectedFile = null;
  }

  shareFile(): void {
    if (this.selectedFile) {
      console.log('Archivo compartido:', this.selectedFile.name);
      this.closePopup();
    }
  }

  stopSharing(): void {
    console.log('Dejar de compartir');
  }


  signFile(): void {
    console.log('Archivo firmado:');
  }


}
