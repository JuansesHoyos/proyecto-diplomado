import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {LoginAndRegisterServiceService} from "../../services/login-and-register-service.service";
import {Login} from "../../class/login";
import {ifError} from "node:assert";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private loginService: LoginAndRegisterServiceService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;
      // Hashear la contraseña
      const hashedPassword = CryptoJS.SHA256(password).toString();

      // Aquí puedes enviar los datos a tu backend

      let userLogin = new Login({
        username: username,
        password: hashedPassword,
      })

      let resp = this.loginService.loginMethod(userLogin).subscribe({
        next: (response) => {
          console.log('Success:', response)
          this.router.navigate(['/generate-keys'])
        },
        error: (error) =>{
          console.error('Error:', error)

        }
      });




      console.log('Usuario:', username);
      console.log('Contraseña:', password);
    } else {
      console.log('Formulario no válido');
    }
  }
}
