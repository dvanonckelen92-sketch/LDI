// Haalt de eigen foto's van LDI Solutions op van de huidige Webnode-site en zet ze in public/img.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const list = JSON.parse(await readFile(new URL('../src/data/images.json', import.meta.url), 'utf8'));
const out = new URL('../public/img/', import.meta.url);
await mkdir(out, { recursive: true });
for (const img of list) {
  const res = await fetch(img.src);
  if (!res.ok) { console.error('FOUT', res.status, img.file); continue; }
  const type = res.headers.get('content-type') || '';
  if (!type.startsWith('image/')) { console.error('Geen afbeelding:', img.file, type); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(new URL(img.file, out), buf);
  console.log('ok', img.file, Math.round(buf.length / 1024) + ' kB');
}
