import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

/** Minimal 1200x630 teal-on-dark PNG (solid) for OG. */
const W = 1200;
const H = 630;
const raw = Buffer.alloc((W * H * 3) + H);
let o = 0;
for (let y = 0; y < H; y++) {
  raw[o++] = 0; // filter none
  for (let x = 0; x < W; x++) {
    const edge = x < 48 || y < 36 || x > W - 49 || y > H - 37;
    if (edge) {
      raw[o++] = 20;
      raw[o++] = 184;
      raw[o++] = 166;
    } else {
      raw[o++] = 13;
      raw[o++] = 15;
      raw[o++] = 18;
    }
  }
}

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8;
ihdr[9] = 2;
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "og.png");
writeFileSync(out, png);
console.log("wrote", out, png.length);
