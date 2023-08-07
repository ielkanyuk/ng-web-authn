import { Injectable } from '@angular/core';
import { DbService } from '../db/db.service';
import { UserData, ServerResp } from '../../interfaces';
import { encode } from 'base64-arraybuffer';
import { getRandomBuffer } from '../../utils/utils';
import { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types';

@Injectable({
  providedIn: 'root'
})
export class WebAuthnService {
  constructor(
    private db: DbService,
  ) { }

  startRegistration(userData: UserData): Promise<ServerResp> {
    if (this.db.isUserExist(userData.username) && this.db.getUser(userData.username).registrationComplete) {
      return Promise.reject({ status: 'failed', errorMessage: 'User already exists!'});
    }
    this.db.deleteUser(userData.username);

    userData.id = encode(getRandomBuffer());
    userData.credentials = [];

    this.db.addUser(userData.username, userData);

    return Promise.resolve({ status: 'ok'});
  }

  createCredentials(userData: UserData) {
    const publicKeyCredentialOptions: PublicKeyCredentialCreationOptionsJSON = {
      challenge: encode(getRandomBuffer()),
      rp: {
        name: 'Web Authn Test',
        id: 'localhost'
      },
      user: {
        id: encode(getRandomBuffer()),
        name: userData.username,
        displayName: userData.email,
      },
      pubKeyCredParams: [
        {type: 'public-key', alg: -7},
        {type: 'public-key', alg: -257}
      ],
      excludeCredentials: [],
      authenticatorSelection: {
        requireResidentKey: true,
      }
    }

    console.log('publicKeyCredentialOptions', publicKeyCredentialOptions);
    return Promise.resolve(publicKeyCredentialOptions);
  }

  credentialResponse(credential: Credential, userData: UserData) {
    let user = this.db.getUser(userData.username);
    user.registrationComplete = true;
    user.credentials.push(credential.id);

    this.db.updateUser(userData.username, user);

    return Promise.resolve({status: 'ok'});
  }

  getAssertationChallenge(userData?: UserData) {
    let publicKey;

    if (userData) {
      const user = this.db.getUser(userData.username);
      const allowCredentials = user.credentials.map((id) => ({type: 'public-key', id}));
      publicKey = {
        challenge: encode(getRandomBuffer()),
        allowCredentials,
        status: 'ok',
        userVerification: 'required',
      };
    } else {
      publicKey = {
        challenge: encode(getRandomBuffer()),
        status: 'ok',
        userVerification: 'required',
        authenticatorSelection: {
          requireResidentKey: true,
        }
      };
    }
    return Promise.resolve(publicKey);
  }

  getAssertationResponse(response: any): Promise<ServerResp> {
    if (!this.db.getUserByUserHandle(response.userHandle)) {
      return Promise.reject({status: 'failed', errorMessage: 'Access denied!'});
    }

    return Promise.resolve({status: 'ok'});
  }
}
