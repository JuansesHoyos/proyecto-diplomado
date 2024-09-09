import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FileManagementService} from "../../services/file-management.service";
import {Doc} from "../../class/doc";
import {JwtHelperService} from "@auth0/angular-jwt";
import {FormsModule} from "@angular/forms";


@Component({
  selector: 'app-file-management',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importa CommonModule aquí
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.css']
})
export class FileManagementComponent implements OnInit{

  files: Doc[] = [];
  isPopupOpen = false;
  selectedFile: File | null = null;
  helper = new JwtHelperService();
  username: string = '';
  shared: string[] = [];
  sharedWithMe: Doc[] = [];
  shareWith = "";
  privateTempKey = "";

  ngOnInit(): void {
    let decodeToken;
    let token = localStorage.getItem('jwt_token');
    if (typeof token === "string") {
      decodeToken = this.helper.decodeToken(token);
      this.username = decodeToken.name;
    }
    this.filesService.getFilesFromUser(this.username).subscribe({
      next: (response: any) => {
        this.files = response;
      }
    })

    this.filesService.getShareds(this.username).subscribe({
      next: (response: any) => {
        if (response.message) {
          this.sharedWithMe = [];
        } else if (Array.isArray(response)) {
          this.sharedWithMe = response;
        } else {
          this.sharedWithMe = [];
        }
      },
      error: (error) => {
        console.error('Error al obtener los documentos compartidos:', error);
        this.sharedWithMe = [];
      }
    });

  }

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
          // @ts-ignore
          name: this.selectedFile.name,
          owner: this.username,
        });

        this.filesService.subirArchivo(base64String, userDocument).subscribe({
          next: (response: any) => {
            this.filesService.getFilesFromUser(this.username).subscribe({
              next: (response: any) => {
                this.files = response;
              }
            });
          }
        });


      };

      reader.onerror = (error) => {
        console.error("Error converting file to Base64", error);
      };
    }
  }

  openPopup(shareds: string): void {
    this.isPopupOpen = true;
    this.shared = shareds.split("{<#-#>}").filter(value => value.trim() !== "");
  }

  closePopup(): void {
    this.isPopupOpen = false;
    this.selectedFile = null;
  }

  shareFile(documentid: string): void {
    this.filesService.shareWithUser(documentid, this.shareWith).subscribe();
    this.filesService.getFilesFromUser(this.username).subscribe({
      next: (response: any) => {
        this.files = response;
      }
    });
  }


  signFile(documentId: string): void {
    if (this.privateTempKey) {
      this.filesService.signDocument(documentId, this.privateTempKey).subscribe();
    }

  }

  deleteFile(documentId: string): void{
    this.filesService.deleteFile(documentId).subscribe({
      next: () => {
        this.filesService.getFilesFromUser(this.username).subscribe({
          next: (response: any) => {
            this.files = response;
          }
        });
      }
    });
  }
}
