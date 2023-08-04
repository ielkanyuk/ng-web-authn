import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isAuthnSupported = false;

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
}
