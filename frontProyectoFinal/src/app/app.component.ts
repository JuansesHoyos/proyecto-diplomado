import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {GenerateKeysComponent} from "./components/generate-keys/generate-keys.component";
import { HttpClientModule } from '@angular/common/http';
import {KeysService} from "./services/keys-service.service";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {LoginAndRegisterServiceService} from "./services/login-and-register-service.service";
import {HomeComponent} from "./components/home/home.component";
import {FileManagementService} from "./services/file-management.service";
import {GoogleAuthServiceService} from "./services/google-auth-service.service";
import {GoogleAuthDiplModule} from "./google-auth-dipl/google-auth-dipl.module";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GenerateKeysComponent, HttpClientModule, LoginComponent, RegisterComponent, HomeComponent, GoogleAuthDiplModule],
  providers: [KeysService, LoginAndRegisterServiceService, FileManagementService, GoogleAuthServiceService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontProyectoFinal';
}
