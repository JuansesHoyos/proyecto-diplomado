import {Injectable} from '@angular/core';
import {OAuthService} from "angular-oauth2-oidc";


@Injectable({
  providedIn: 'root'
})
export class GoogleAuthServiceService {

  constructor(private oauth: OAuthService) {
    this.initLogin()
  }

  initLogin() {
    /*


    const config: AuthConfig = {
      issuer: 'https://accounts.google.com',
      clientId: '777419971638-e4bf7c02bf5ok93n7uk5fohdv1n203ed.apps.googleusercontent.com',
      responseType: 'token',
      scope: 'email',
      strictDiscoveryDocumentValidation: false,
      showDebugInformation: true,
      redirectUri: window.location.origin + '/home'
    };

    this.oauth.configure(config);
    this.oauth.loadDiscoveryDocumentAndTryLogin().then(() => {
      // Puedes agregar manejo de errores aquí si es necesario
    }).catch(err => {
      console.error('Error cargando el documento de descubrimiento', err);
    });
     */
  }

  login() {
    this.oauth.initLoginFlow();
  }


  logout() {
    this.oauth.logOut();
  }

  getProfile() {
    return this.oauth.getIdentityClaims();
  }






}
