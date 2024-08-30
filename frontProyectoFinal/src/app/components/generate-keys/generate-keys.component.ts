import {Component, OnInit} from '@angular/core';
import {KeysService} from "../../services/keys-service.service";
import {User} from "../../class/user";
import {FormsModule} from "@angular/forms";


@Component({
  selector: 'app-generate-keys',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './generate-keys.component.html',
  styleUrl: './generate-keys.component.css'
})

export class GenerateKeysComponent implements OnInit {
  username: string = '';
  usuario: User | null = null;

  ngOnInit(): void {
  }

  constructor(private keysService: KeysService) { }

  downloadPrivateKey() {
    this.downloadFile(this.usuario?.privateKey)
  }


  downloadFile(data: string | undefined) {
    if (data != undefined){
      let blob = new Blob([data.toString()], { type: 'text/plain' });
      const url= window.URL.createObjectURL(blob);


      // Crear un enlace para forzar la descarga
      const a = document.createElement('a');
      a.href = url;
      a.download = this.username+'-private-key.pem'; // Nombre del archivo con extensión .pem
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Liberar el objeto URL
      window.URL.revokeObjectURL(url);
    }
  }

  getPublicKeyFromUser(){
    let resp = this.keysService.getUsuarios(this.username)
    console.log("Getting keys from user", resp);
  }
  generarLlaves(): void {
    const username = this.username;
    if (username) {
      this.keysService.generarLlaves(username).subscribe({
        next: (response: any) => {
          // Map the response to the User object
          this.usuario = new User(response);
          console.log("Keys generated successfully", this.usuario);
        },
        error: (err) => {
          console.error("Error generating keys", err);
        }
      });
    }
  }
}
