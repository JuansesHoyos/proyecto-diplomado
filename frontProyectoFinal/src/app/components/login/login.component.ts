import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {LoginAndRegisterServiceService} from "../../services/login-and-register-service.service";
import {Login} from "../../class/login";
import {jwtDecode} from 'jwt-decode';

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
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginError: string | null = null;


  ngOnInit() {
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: "777419971638-e4bf7c02bf5ok93n7uk5fohdv1n203ed.apps.googleusercontent.com",
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true,

    });
    // @ts-ignore
    google.accounts.id.renderButton(
      // @ts-ignore
      document.getElementById("google-button"),
      {theme: "outline", size: "large", width: "100%"}
    );
    // @ts-ignore
    google.accounts.id.prompt((notification: PromptMomentNotification) => {
    });
  }

  constructor(private fb: FormBuilder, private loginService: LoginAndRegisterServiceService, private router: Router, private ngZone: NgZone) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  handleCredentialResponse(response: any) {

    let decryptedToken = jwtDecode(response.credential)

    // @ts-ignore
    let emailFromToken = decryptedToken["email"];
    let subFromToken = decryptedToken["sub"];

    if (subFromToken != null && emailFromToken != null) {
      this.loginService.loginWithGoogle(emailFromToken, subFromToken).subscribe({
        next: (response: any) => {
          localStorage.setItem('jwt_token', response.token);
          this.ngZone.run(() => {
            this.router.navigate(['/home']);
          });
        },
        error: (error) => {
          this.loginError = error.error?.detail || 'Error desconocido';
        }
      });
    }
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
}
