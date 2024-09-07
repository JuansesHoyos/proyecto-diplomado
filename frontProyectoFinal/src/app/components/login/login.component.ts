import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {LoginAndRegisterServiceService} from "../../services/login-and-register-service.service";
import {Login} from "../../class/login";
import {GoogleAuthServiceService} from "../../services/google-auth-service.service";

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
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  loginError: string | null = null;


  ngOnInit() {
  }

  constructor(private fb: FormBuilder, private loginService: LoginAndRegisterServiceService, private authService: GoogleAuthServiceService, private router: Router) {
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

      let userLogin = new Login({
        username: username,
        password: hashedPassword,
      })

      this.loginService.loginMethod(userLogin).subscribe({
        next: (response) => {

          const token = response.token ?? '';
          localStorage.setItem('jwt_token', token);

          this.router.navigate(['/home'])
        },
        error: (error) => {
          this.loginError = error.error?.detail || 'Error desconocido';
        }
      });
    } else {
      console.log('Formulario no válido');
    }
  }

  logInWithGoogle() {
    this.authService.login();

  }





}
