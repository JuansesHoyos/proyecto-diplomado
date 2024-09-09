import {Component, OnInit} from '@angular/core';
import CryptoJS from 'crypto-js';
import {CommonModule} from "@angular/common";
import {LoginAndRegisterServiceService} from "../../services/login-and-register-service.service";
import {Login} from "../../class/login";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit{
  registerForm: FormGroup;
  loginError: string | null = null;


  constructor(private fb: FormBuilder, private registerService: LoginAndRegisterServiceService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  onRegister() {

    const username = this.registerForm.get('username')?.value;
    const password = this.registerForm.get('password')?.value;
    // Hashear la contraseña
    const hashedPassword = CryptoJS.SHA256(password).toString();

    let userLogin = new Login({
      username: username,
      password: hashedPassword,
    })

    this.registerService.registerMethod(userLogin).subscribe({
      next: (response) =>{
        this.router.navigate(['/'])
      },
      error: (error) => this.loginError = error.error?.detail || 'Error desconocido'
    });
  }
}
