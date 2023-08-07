import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {WebAuthnService} from './services/web-authn/web-authn.service';
import {ServerResp} from './interfaces';
import {decodeCreationOptionsJSON, decodeAssertReq} from './utils/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isAuthnSupported = false;

  registrationForm = new FormGroup({
    username: new FormControl(),
    email: new FormControl(),
  });

  loginForm = new FormGroup({
    username: new FormControl(),
  });

  constructor(
    private webAuthService: WebAuthnService,
  ) {
  }

  ngOnInit(): void {
    this.checkSupportAuthn();
  }

  isWebAuthnSupported(): boolean {
    return !!window.PublicKeyCredential;
  }

  isPlatformAuthenticatorSupported(): Promise<boolean> {
    if (!this.isWebAuthnSupported()) {
      return Promise.reject(new Error('Web Authn not supported'))
    }

    if (!PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
      return Promise.resolve(false);
    }

    return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  }

  async checkSupportAuthn() {
    this.isAuthnSupported = await this.isPlatformAuthenticatorSupported();
  }

  async registration() {
    const userData = this.registrationForm.value;
    this.webAuthService.startRegistration(userData)
      .then((res: ServerResp) => {
        if (res.status !== 'ok') {
          throw new Error(`Error requesting user: ${res.errorMessage}`);
        }

        return this.webAuthService.createCredentials(userData);
      })
      .then((publicKeyCredential) =>
        navigator.credentials.create({publicKey: decodeCreationOptionsJSON(publicKeyCredential)}))
      .then((credential) => {
        if (!credential) {
          throw new Error('navigator.credentials.create');
        }
        return this.webAuthService.credentialResponse(credential, userData);
      })
      .then((serverResponse) => {
        if (serverResponse.status !== 'ok') {
          throw new Error('Error registering user! (Server)');
        }
        alert('Registration complete!')
      });
  }

  login() {
    const userData = this.loginForm.value;
    this.webAuthService.getAssertationChallenge(userData)
      .then((assertionChallenge) =>
        navigator.credentials.get({publicKey: decodeAssertReq(assertionChallenge.challenge)})
      )
      .then((credential) => {
        if (!credential) {
          throw new Error('navigator.credentials.get');
        }
        return this.webAuthService.getAssertationResponse(credential);
      })
      .then((serverResponse) => {
        if (serverResponse.status !== 'ok') {
          throw new Error('Error login user! (Server)');
        }
        alert('You logged in!')
      });
  }
}
