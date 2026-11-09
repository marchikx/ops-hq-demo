/**
 * Browser shim for Node `crypto` APIs used by portfolio libs in the client demo.
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
import { createHmac as browserCreateHmac } from "crypto-browserify";

export function createHmac(
  algorithm: string,
  key: string | Buffer | Uint8Array,
): ReturnType<typeof browserCreateHmac> {
  return browserCreateHmac(algorithm, key as string);
}

export function timingSafeEqual(
  a: Uint8Array | Buffer,
  b: Uint8Array | Buffer,
): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) {
    out |= a[i]! ^ b[i]!;
  }
  return out === 0;
}

export function randomUUID(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export default {
  createHmac,
  timingSafeEqual,
  randomUUID,
};
