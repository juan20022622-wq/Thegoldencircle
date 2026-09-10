/* La landing de pauta · /entrar
   ---------------------------------------------------------------------------
   Meta revisa la página de destino de cada anuncio, y en categoría financiera
   un testimonio con cifra de retorno es motivo de rechazo y, repetido, de
   restricción de la cuenta. La página principal lleva esas capturas por
   decisión del cliente; los anuncios no pueden apuntar ahí.

   Este script genera entrar.html a partir de index.html quitando la sección de
   testimonios y marcándola noindex. Misma página en todo lo demás: mismo
   formulario (Netlify lo agrupa por nombre), mismo píxel, mismo evento Lead.
   main.js manda el campo "pagina", así que en Netlify se ve de cuál vino cada
   registro.

   Correr después de cualquier cambio en index.html:
       node web/herramientas/entrar.mjs
   --------------------------------------------------------------------------- */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let h = fs.readFileSync(path.join(web, 'index.html'), 'utf8');

/* 1 · la sección de testimonios se queda, pero solo con las capturas que hablan
   del método y de la gestión, no de la cifra: el error de lotaje, la posición
   en rojo, el cierre en negativo y dos gráficos con las zonas marcadas. Las
   listas de operaciones ganadoras y los mensajes con porcentaje son lo que Meta
   nombra como motivo de rechazo en categoría financiera. */
const ACEPTADAS = ['lotaje', 'flotante', 'perdedora', 'grafico-metodo', 'franjas'];
const ini = h.indexOf('  <!-- TESTIMONIOS ·');
const fin = h.indexOf('  <!-- LA CONSOLA ·');
if (ini < 0 || fin < 0) throw new Error('no encuentro la sección de testimonios');
let seccion = h.slice(ini, fin);
const figuras = seccion.match(/ {8}<figure class="carta carta--captura">[\s\S]*?<\/figure>/g) || [];
const nombre = (f) => (f.match(/testimonios\/([a-z0-9-]+)\.webp/) || [])[1];
/* la del gráfico con mensaje se sustituye por la versión solo-gráfico */
const conservadas = ACEPTADAS.map((n) => {
  const f = figuras.find((x) => nombre(x) === (n === 'grafico-metodo' ? 'grafico-sep' : n));
  if (!f) throw new Error('falta la carta ' + n);
  return n === 'grafico-metodo'
    ? f.replace('grafico-sep.webp', 'grafico-metodo.webp')
       .replace(/alt="[^"]*"/, 'alt="Gráfico de un miembro con la zona de venta marcada y las entradas hasta el objetivo"')
       .replace(/<p class="carta__nota">[\s\S]*?<\/p>/, '<p class="carta__nota">La zona de venta marcada, dos entradas y el recorrido hasta el objetivo.</p>')
    : f;
});
const primera = seccion.indexOf(figuras[0]);
const ultima = seccion.lastIndexOf(figuras[figuras.length - 1]) + figuras[figuras.length - 1].length;
seccion = seccion.slice(0, primera) + conservadas.join('\n') + seccion.slice(ultima);
seccion = seccion.replace(/<p data-flujo="lento">[\s\S]*?<\/p>/, `<p data-flujo="lento">
      Esto es lo que mandan los miembros al canal. Aquí van las que hablan del
      método y de la gestión: un error de lotaje reconocido, una posición en rojo,
      un cierre en negativo y dos gráficos con las zonas marcadas.
    </p>`);
h = h.slice(0, ini) + seccion + h.slice(fin);

/* 2 · cabecera: noindex, canonical a la principal, título propio */
/* la principal ya trae una meta robots: se sustituye, no se añade otra */
h = h.replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex, nofollow">');
h = h.replace(/<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="https://thegoldensyndicate.com/entrar">');
h = h.replace('<title>The Golden Syndicate · El club donde nadie opera a ciegas</title>',
  '<title>Entra al club · The Golden Syndicate</title>');

/* 3 · del JSON-LD se conserva Organization y WebSite; el FAQ sobra en una página
   que no se indexa y cuya sección de dudas es idéntica a la principal */
h = h.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (m, json) => {
  const ld = JSON.parse(json);
  if (ld["@graph"]) ld["@graph"] = ld["@graph"].filter((n) => n["@type"] !== "FAQPage");
  return '<script type="application/ld+json">\n' + JSON.stringify(ld, null, 2) + '\n</script>';
});

/* 4 · una marca en el body para que el CSS pueda distinguirla si hace falta */
h = h.replace('<body>', '<body class="pauta">');

/* 5 · aviso al principio del archivo */
h = h.replace('<!DOCTYPE html>', '<!DOCTYPE html>\n<!-- GENERADO por herramientas/entrar.mjs a partir de index.html. No editar a mano:\n     los cambios van en index.html y se vuelve a correr el script. -->');

fs.writeFileSync(path.join(web, 'entrar.html'), h);

const cartas = (h.match(/carta--captura/g) || []).length;
console.log(`  entrar.html · ${(h.length / 1024).toFixed(0)} KB · cartas: ${cartas} (${ACEPTADAS.join(', ')})`);
