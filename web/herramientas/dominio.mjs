/* Pone el dominio propio en todo el sitio y levanta el bloqueo de indexación.
   Uso:  node web/herramientas/dominio.mjs thegoldensyndicate.com

   El marcador REEMPLAZAR-DOMINIO vivía en catorce sitios: el canonical, las
   etiquetas de Open Graph y Twitter, los tres bloques de JSON-LD, el sitemap y
   el robots.txt. Con cualquiera de ellos sin cambiar, Google indexa un dominio
   que no existe, así que el noindex del netlify.toml no se quita a mano: lo
   quita este script, y solo cuando ya no queda ningún marcador. */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dominio = (process.argv[2] || '').trim().replace(/^https?:\/\//, '').replace(/\/$/, '');

if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i.test(dominio)) {
  console.error('Falta el dominio, o no tiene forma de dominio.');
  console.error('Ej: node web/herramientas/dominio.mjs thegoldensyndicate.com');
  process.exit(1);
}

const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const archivos = ['index.html', 'gracias.html', 'privacidad.html', 'ir.html',
                  'sitemap.xml', 'robots.txt', 'netlify.toml'];

let total = 0;
for (const nombre of archivos) {
  const ruta = path.join(web, nombre);
  if (!fs.existsSync(ruta)) continue;
  const antes = fs.readFileSync(ruta, 'utf8');
  const n = (antes.match(/REEMPLAZAR-DOMINIO/g) || []).length;
  if (!n) continue;
  fs.writeFileSync(ruta, antes.replaceAll('REEMPLAZAR-DOMINIO', dominio));
  console.log(`  ${nombre.padEnd(18)} ${n} sustitucion${n === 1 ? '' : 'es'}`);
  total += n;
}

/* El noindex solo cae si ya no queda ni un marcador en todo el sitio. */
const quedan = archivos
  .filter((f) => fs.existsSync(path.join(web, f)))
  .some((f) => fs.readFileSync(path.join(web, f), 'utf8').includes('REEMPLAZAR-DOMINIO'));

const toml = path.join(web, 'netlify.toml');
let t = fs.readFileSync(toml, 'utf8');

if (quedan) {
  console.log('\nQuedan marcadores sin sustituir: el noindex se mantiene.');
} else if (t.includes('X-Robots-Tag              = "noindex, nofollow"')) {
  t = t.replace(/\n *# QUITAR ESTA LÍNEA[\s\S]*?X-Robots-Tag *= "noindex, nofollow"\n/, '\n');
  fs.writeFileSync(toml, t);
  console.log('\n  netlify.toml       fuera el X-Robots-Tag: noindex, nofollow');
} else {
  console.log('\n  netlify.toml       el noindex ya no estaba');
}

console.log(`\n${total} sustituciones · dominio: ${dominio}`);
console.log('Ahora: node web/herramientas/version.mjs');
