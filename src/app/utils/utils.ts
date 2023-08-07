import * as randombytes from 'randombytes';
import {PublicKeyCredentialCreationOptionsJSON} from '@simplewebauthn/typescript-types';
import {decode} from "base64-arraybuffer";

export function getRandomBuffer(): ArrayBuffer {
  return toArrayBuffer(randombytes(32));
}

function toArrayBuffer(buf: Buffer): ArrayBuffer {
  const ab = new ArrayBuffer(buf.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}

export function decodeCreationOptionsJSON(res: PublicKeyCredentialCreationOptionsJSON): PublicKeyCredentialCreationOptions {
  const decodeValues = {
    challenge: decode(res.challenge),
    user: {
      id: decode(res.user.id),
      name: res.user.name,
      displayName: res.user.displayName,
    }
  };

  const newPublicOption = {...res, ...decodeValues};

  return newPublicOption as PublicKeyCredentialCreationOptions;
}
