/* La locución guía. node herramientas/voz.mjs → public/voz/*.wav + guion.json
   ---------------------------------------------------------------------------
   Es una voz sintética: Kokoro v1.0 con la voz española «em_alex» (licencia
   Apache-2.0), en local con sherpa-onnx. Otras: VOZ=santa, VOZ=dora, o la
   primera que se usó, VOZ=piper (Piper es_MX «claude», más robótica). Sirve para montar y aprobar el video; la versión que
   se publique debería ir con la voz de Christian. Para cambiarla basta con dejar
   sus tomas en public/voz/ con los mismos nombres: la banda sonora las coloca
   en los mismos segundos y ajusta la mezcla sola.

   Cada línea tiene un segundo de entrada y un techo: si la frase no cabe, se
   acelera lo justo (nunca más de 1,25×, 1,4× en las palabras sueltas). El texto pasó por revision-copy-trading. */
import fs from 'fs';
import sherpa from 'sherpa-onnx-node';

const NEGRA = 60 / 96;
const encendido = (j) => 15.0 + j * NEGRA;

export const GUION = [
  { id: 'gancho', en: 0.08, techo: 2.45, texto: 'Aprender trading... no tiene por qué ser difícil.' },
  { id: 'dificil', en: 2.75, techo: 0.95, texto: 'Lo difícil...' },
  { id: 'solo', en: 3.85, techo: 1.2, texto: 'es hacerlo solo.' },
  { id: 'puerta', en: 5.15, techo: 1.8, texto: 'Por eso abrimos el canal.' },
  { id: 'cristian', en: 7.95, techo: 2.9, texto: 'Christian opera su cuenta, y te muestra cada paso.' },
  { id: 'porque', en: 10.95, techo: 2.8, texto: 'Dónde entra. Dónde corta. Y por qué.' },
  { id: 'nosolo', en: 13.85, techo: 1.1, texto: 'Y no es solo trading.' },
  ...['Dinero.', 'Propósito.', 'Cuerpo.', 'Mentalidad.', 'Educación.'].map((texto, j) => ({ id: 'llave' + j, en: encendido(j) + 0.02, techo: NEGRA - 0.05, maximo: 1.4, texto })),
  { id: 'casa', en: 20.2, techo: 1.6, texto: 'Dé Góulden Síndikeit.' },
  { id: 'gratis', en: 23.35, techo: 1.15, texto: 'Entrar es gratis.' },
  { id: 'cero', en: 24.6, techo: 1.3, texto: 'Empiezas desde cero.' },
  { id: 'adentro', en: 26.1, techo: 1.3, texto: 'Nos vemos adentro.' },
];

const VOZ = process.env.VOZ ?? 'alex';
const m = new URL('./modelos/', import.meta.url).pathname;
const piper = m + 'vits-piper-es_MX-claude-high/', kokoro = m + 'kokoro-multi-lang-v1_0/';
const tts = new sherpa.OfflineTts(
  VOZ === 'piper'
    ? { model: { vits: { model: piper + 'es_MX-claude-high.onnx', tokens: piper + 'tokens.txt', dataDir: piper + 'espeak-ng-data', lengthScale: 1.05, noiseScale: 0.55, noiseScaleW: 0.65 }, numThreads: 4, provider: 'cpu' } }
    : { model: { kokoro: { model: kokoro + 'model.onnx', voices: kokoro + 'voices.bin', tokens: kokoro + 'tokens.txt', dataDir: kokoro + 'espeak-ng-data', lexicon: '', lang: 'es' }, numThreads: 6, provider: 'cpu' } }
);
const SID = { piper: 0, dora: 28, alex: 29, santa: 53 }[VOZ];

/* quita el silencio de las puntas para que la entrada caiga exacta */
function recortar(x, sr) {
  const umbral = 0.012;
  let a = 0, b = x.length - 1;
  while (a < b && Math.abs(x[a]) < umbral) a++;
  while (b > a && Math.abs(x[b]) < umbral) b--;
  a = Math.max(0, a - Math.round(sr * 0.015));
  b = Math.min(x.length - 1, b + Math.round(sr * 0.035));
  return x.slice(a, b + 1);
}

fs.mkdirSync('public/voz', { recursive: true });
const salida = [];
for (const l of GUION) {
  let velocidad = 1, a, s;
  for (let k = 0; k < 6; k++) {
    a = tts.generate({ text: l.texto, sid: SID, speed: velocidad });
    s = recortar(a.samples, a.sampleRate);
    const dur = s.length / a.sampleRate;
    const maximo = l.maximo ?? 1.25;
    if (dur <= l.techo || velocidad >= maximo) break;
    velocidad = Math.min(maximo, velocidad * (dur / l.techo) * 1.02);
  }
  sherpa.writeWave(`public/voz/${l.id}.wav`, { samples: s, sampleRate: a.sampleRate });
  const dur = s.length / a.sampleRate;
  salida.push({ ...l, dur: +dur.toFixed(3), velocidad: +velocidad.toFixed(2) });
  console.log(l.id.padEnd(9), (l.en).toFixed(2).padStart(6), '→', (l.en + dur).toFixed(2).padStart(6), dur > l.techo ? '  ⚠ no cabe' : '', ' ×' + velocidad.toFixed(2));
}
fs.writeFileSync('public/voz/guion.json', JSON.stringify(salida, null, 2));
