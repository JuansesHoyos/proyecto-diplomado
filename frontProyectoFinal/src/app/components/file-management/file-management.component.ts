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
  encryptedFile: string = '';

  constructor(private filesService: FileManagementService) { }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
        this.selectedFile = input.files[0];
    }
  }

  uploadFiles(): void {
    if (this.selectedFile) {
      const reader = new FileReader();

      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];

        let token = localStorage.getItem('jwt_token');
        let decodeToken;

        if (typeof token === "string") {
          decodeToken = this.helper.decodeToken(token);
          this.username = decodeToken.name;
        }

        let userDocument = new Doc({
          document: base64String,
          owner: this.username,
        });

        this.filesService.subirArchivo(base64String, userDocument).subscribe();
      };

      reader.onerror = (error) => {
        console.error("Error converting file to Base64", error);
      };
    }
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
