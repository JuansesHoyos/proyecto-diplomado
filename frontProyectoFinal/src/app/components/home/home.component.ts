import { Component } from '@angular/core';
import {GenerateKeysComponent} from "../generate-keys/generate-keys.component";
import {FileManagementComponent} from "../file-management/file-management.component";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    GenerateKeysComponent,
    FileManagementComponent,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  menuExpanded = true;
  currentComponent: string | null = "file-management";

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuExpanded = !this.menuExpanded;
  }

  showComponent(component: string) {
    this.currentComponent = component;
  }

  logout() {
    localStorage.removeItem("jwt_token")
    this.router.navigate(['/']);
  }
}
