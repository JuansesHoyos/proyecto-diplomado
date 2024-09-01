import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        this.files.push(input.files[i]);
      }
    }
  }

  uploadFiles(): void {
    // Aquí puedes agregar la lógica para subir los archivos al servidor
    console.log('Archivos subidos:', this.files);
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

  stopSharing(): void{
    console.log('Dejar de compartir');
  }


  signFile(): void{
    console.log('Archivo firmado:');
  }





}
