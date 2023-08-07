import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {WebAuthnService} from './services/web-authn/web-authn.service';

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

  registration() {
    this.webAuthService.startRegistration(this.registrationForm.value);
  }
}
