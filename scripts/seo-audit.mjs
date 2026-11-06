// Statische SEO-audit van een gebouwde site: node scripts/seo-audit.mjs dist
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
const root = process.argv[2] || 'dist';
const files = [];
async function walk(d) { for (const f of await readdir(d)) { const p = join(d, f); (await stat(p)).isDirectory() ? await walk(p) : p.endsWith('.html') && files.push(p); } }
await walk(root);
const pages = {}; const inbound = {}; const titles = {}; const descs = {}; let problems = 0;
const urlOf = (f) => '/' + relative(root, f).split(sep).join('/').replace(/index\.html$/, '').replace(/\.html$/, '');
const strip = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
for (const f of files) {
  const html = await readFile(f, 'utf8'); const url = urlOf(f);
  const title = (html.match(/<title>(.*?)<\/title>/s) || [])[1] || '';
  const desc = (html.match(/<meta name="description" content="(.*?)"/) || [])[1] || '';
  const canon = (html.match(/<link rel="canonical" href="(.*?)"/) || [])[1] || '';
  const heads = [...html.matchAll(/<h([1-6])[^>]*>(.*?)<\/h\1>/gs)].map((m) => [+m[1], strip(m[2])]);
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const types = [...html.matchAll(/"@type":"(\w+)"/g)].map((m) => m[1]);
  const main = (html.match(/<main[^>]*>(.*?)<\/main>/s) || [])[1] || '';
  const words = strip(main.replace(/<script.*?<\/script>/gs, '')).split(' ').length;
  const issues = [];
  if (!title) issues.push('geen title'); else if (title.length > 60 || title.length < 30) issues.push(`title ${title.length} tekens`);
  if (!desc) issues.push('geen description'); else if (desc.length > 160 || desc.length < 110) issues.push(`description ${desc.length} tekens`);
  if (!canon && url !== '/404') issues.push('geen canonical');
  const h1 = heads.filter((h) => h[0] === 1).length; if (h1 !== 1) issues.push(`${h1} H1's`);
  for (let i = 1; i < heads.length; i++) if (heads[i][0] > heads[i - 1][0] + 1) issues.push(`kopsprong h${heads[i - 1][0]}→h${heads[i][0]} bij "${heads[i][1]}"`);
  imgs.filter((t) => !/\balt="[^"]+"/.test(t)).forEach((t) => issues.push('img zonder alt: ' + t.slice(0, 60)));
  (titles[title] ||= []).push(url); (descs[desc] ||= []).push(url);
  for (const m of main.matchAll(/href="(\/[^"#]*)"/g)) { (inbound[m[1]] ||= new Set()).add(url); }
  pages[url] = { title, words, types: [...new Set(types)].join(','), issues, links: [...html.matchAll(/href="(\/[^"#]*)"/g)].map((m) => m[1]) };
}
const exists = async (u) => { for (const p of [join(root, u, 'index.html'), join(root, u)]) { try { await stat(p); return true; } catch {} } return false; };
for (const [u, p] of Object.entries(pages)) {
  for (const l of new Set(p.links)) if (!(await exists(l))) p.issues.push('dode link ' + l);
  console.log(`\n${u}  (${p.words} woorden)\n  title: ${p.title} [${p.title.length}]\n  schema: ${p.types}`);
  p.issues.forEach((i) => { problems++; console.log('  ! ' + i); });
}
for (const [t, us] of Object.entries(titles)) if (us.length > 1) { problems++; console.log('! dubbele title:', t, us); }
for (const [d, us] of Object.entries(descs)) if (us.length > 1) { problems++; console.log('! dubbele description:', us); }
console.log('\nInterne links vanuit lopende tekst (main), per doelpagina:');
Object.entries(inbound).map(([u, s]) => [u, s.size]).sort((a, b) => b[1] - a[1]).forEach(([u, n]) => console.log(`  ${String(n).padStart(2)}  ${u}`));
console.log(`\n${files.length} pagina's, ${problems} problemen`);
