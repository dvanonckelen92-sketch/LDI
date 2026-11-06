// Verkleint de foto's in public/img (EXIF-rotatie, max 1400px breed, JPEG q78) en het logo (400px).
import sharp from 'sharp';
import { readdir, readFile, writeFile } from 'node:fs/promises';
const dir = new URL('../public/img/', import.meta.url);
for (const f of await readdir(dir)) {
  const p = new URL(f, dir); const input = await readFile(p);
  const img = sharp(input).rotate();
  const out = f.endsWith('.png')
    ? await img.resize({ width: 400, withoutEnlargement: true }).png({ compressionLevel: 9, palette: true }).toBuffer()
    : await img.resize({ width: 1400, withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true }).toBuffer();
  if (out.length < input.length) { await writeFile(p, out); console.log(f, Math.round(input.length/1024), '→', Math.round(out.length/1024), 'kB'); }
}

// WebP-varianten voor srcset
for (const f of await readdir(dir)) {
  if (!f.endsWith('.jpg')) continue;
  const base = f.replace(/\.jpg$/, '');
  for (const w of [600, 1200]) {
    await sharp(await readFile(new URL(f, dir))).resize({ width: w, height: Math.round(w * 0.75), fit: 'cover' }).webp({ quality: 72 }).toFile(new URL(`${base}-${w}.webp`, dir).pathname.replace(/^\/([A-Z]:)/, '$1'));
  }
}
