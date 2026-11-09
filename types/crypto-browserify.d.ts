declare module "crypto-browserify" {
  import type { Hash, Hmac } from "crypto";
  export function createHash(algorithm: string): Hash;
  export function createHmac(
    algorithm: string,
    key: string | Buffer | Uint8Array | DataView,
  ): Hmac;
}
