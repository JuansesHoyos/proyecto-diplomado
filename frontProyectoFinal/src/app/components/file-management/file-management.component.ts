import { Component } from '@angular/core';

@Component({
  selector: 'app-file-management',
  standalone: true,
  imports: [],
  templateUrl: './file-management.component.html',
  styleUrl: './file-management.component.css'
})
export class FileManagementComponent {

  files: File[] = [];

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

}
