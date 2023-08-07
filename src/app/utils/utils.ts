import * as randombytes from 'randombytes';

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
