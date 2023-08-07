import { Injectable } from '@angular/core';
import { DbService } from '../db/db.service';
import { UserData, ServerResp } from '../../interfaces';
import { encode } from 'base64-arraybuffer';
import { getRandomBuffer } from '../../utils/utils';

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
}
