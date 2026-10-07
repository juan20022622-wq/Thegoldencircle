/* La banda sonora, sintetizada desde cero: sin librerías de audio y sin
   muestras de terceros, así que no hay licencia que cuidar.
   node herramientas/banda-sonora.mjs → public/banda-sonora.wav

   Re menor que se abre a Fa mayor, 96 BPM, la grilla de src/tiempo.ts.
   Está pensada para que sea agradable de oír, no solo para que golpee:
   · música: piano de fieltro (un motivo que vuelve), colchón cálido de senos
     con coro lento y un bajo redondo;
   · ritmo: bombo suave, un shaker y un chasquido en 2 y 4 cuando hay pulso;
   · momentos: la música del gancho frena como una cinta cuando el tiempo se
     para; en «solo» quedan notas sueltas de piano y un latido; la subida a la
     puerta es un arpegio que se acelera; medio segundo de silencio y la caída;
   · lo que encaja suena afinado: cada vara es una nota de marimba de la escala,
     cada losa una campana, cada paso de la esfera un soplo;
   · la voz (public/voz/) va delante y la música se aparta sola cuando habla;
   · todo comparte una sala (reverberación FDN de ocho líneas) y sale por un
     limitador con anticipación, sin saturar. */
import fs from 'fs';

const SR = 48000, DUR = 28, N = SR * DUR;
const NEGRA = 60 / 96, COMPAS = NEGRA * 4;
const ACTOS = { solo: 2.5, puerta: 5.0, porque: 7.5, llaves: 13.75, casa: 19.375, entrar: 23.125 };
const encendido = (j) => 15.0 + j * NEGRA;

let semilla = 11;
const azar = () => { semilla = (semilla * 1664525 + 1013904223) >>> 0; return semilla / 4294967296; };
const ruido = () => azar() * 2 - 1;
const NOM = { C: 0, 'C#': 1, Db: 1, D: 2, Eb: 3, E: 4, F: 5, 'F#': 6, G: 7, Ab: 8, A: 9, Bb: 10, B: 11 };
const midi = (s) => { const m = s.match(/^([A-G][b#]?)(-?\d)$/); return 12 * (+m[2] + 1) + NOM[m[1]]; };
const hzM = (n) => 440 * Math.pow(2, (n - 69) / 12);
const hz = (s) => hzM(midi(s));
const suave = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
const tramo = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
const paneo = (p) => [Math.cos(((p + 1) * Math.PI) / 4), Math.sin(((p + 1) * Math.PI) / 4)];
const TAU = 2 * Math.PI;

/* ---------- buses: cada uno estéreo, con su envío a la sala ---------- */
const bus = () => ({ L: new Float32Array(N), R: new Float32Array(N), eL: new Float32Array(N), eR: new Float32Array(N) });
const MUS = bus(), RIT = bus(), FX = bus();
function poner(b, i, l, r, envio = 0) {
  if (i < 0 || i >= N) return;
  b.L[i] += l; b.R[i] += r; b.eL[i] += l * envio; b.eR[i] += r * envio;
}

/* ---------- la armonía ---------- */
const ACORDES = [
  [0, ['D2', 'A2', 'F3', 'C4', 'E4']],
  [ACTOS.solo, ['D2', 'A2', 'E3', 'F3', 'A3']],
  [ACTOS.puerta, ['Bb1', 'F2', 'D3', 'A3', 'C4']],
  [ACTOS.porque, ['G1', 'D2', 'Bb2', 'F3', 'A3', 'D4']],
  [10.0, ['A1', 'E2', 'C3', 'F3', 'A3', 'E4']],
  [ACTOS.llaves, ['Bb1', 'F2', 'A2', 'D3', 'C4', 'F4']],
  [16.25, ['C2', 'G2', 'E3', 'A3', 'D4', 'G4']],
  [ACTOS.casa, ['D2', 'A2', 'F3', 'C4', 'E4', 'A4']],
  [ACTOS.entrar, ['F1', 'C2', 'A2', 'E3', 'G3', 'C4', 'A4']],
];
const acordeEn = (t) => { let a = ACORDES[0][1]; for (const [t0, ns] of ACORDES) if (t >= t0) a = ns; return a; };
const hayPulso = (t) => t < ACTOS.solo || (t >= ACTOS.porque && t < ACTOS.casa) || (t >= ACTOS.entrar && t < 27.2);

/* ---------- piano de fieltro: parciales ligeramente inarmónicos, martillo blando ---------- */
function piano(b, t0, nota, vel = 0.6, dur = 3.5, envio = 0.35) {
  const f = typeof nota === 'string' ? hz(nota) : nota;
  const m = 12 * Math.log2(f / 440) + 69;
  const [pl, pr] = paneo(Math.max(-0.7, Math.min(0.7, (m - 62) / 30)));
  const B = 0.00035, parciales = [];
  const brillo = 0.35 + 0.65 * vel;
  for (let k = 1; k <= 9; k++) {
    const fk = f * k * Math.sqrt(1 + B * k * k);
    if (fk > 9000) break;
    parciales.push({ w: (TAU * fk) / SR, a: Math.pow(k, -1.5) * Math.pow(brillo, (k - 1) * 0.55), d: 0.55 + 0.45 * k + f / 900, fase: azar() * TAU });
  }
  const n = Math.round(dur * SR), i0 = Math.round(t0 * SR);
  let lp = 0;
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    let x = 0;
    for (const p of parciales) x += Math.sin(p.fase + p.w * k) * p.a * Math.exp(-t * p.d);
    lp += 0.12 * (ruido() - lp);
    const golpe = lp * Math.exp(-t * 90) * 0.25; /* el fieltro contra la cuerda */
    const env = (1 - Math.exp(-t * 350)) * (1 - suave(tramo(t, dur - 0.25, dur)));
    const y = (x + golpe) * env * vel * 0.16;
    poner(b, i0 + k, y * pl, y * pr, envio);
  }
}

/* ---------- colchón: senos desafinados con coro lento, ataque largo ---------- */
function colchon(nivel) {
  const voces = [];
  ACORDES.forEach(([t0, ns], k) => {
    const t1 = k + 1 < ACORDES.length ? ACORDES[k + 1][0] : DUR + 1;
    ns.slice(1).forEach((n, i) => [-1, 1].forEach((lado) => voces.push({ f: hz(n), t0, t1, pan: lado * (0.25 + 0.12 * i), fase: azar(), vib: 0.12 + azar() * 0.2, cents: lado * (4 + 3 * azar()) })));
  });
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    let l = 0, r = 0;
    for (const v of voces) {
      const g = suave(tramo(t, v.t0 - 0.35, v.t0 + 0.55)) * (1 - suave(tramo(t, v.t1 - 0.35, v.t1 + 0.4)));
      if (g <= 0) continue;
      v.fase += (v.f * Math.pow(2, (v.cents + 3 * Math.sin(t * v.vib * TAU)) / 1200)) / SR;
      v.fase -= Math.floor(v.fase);
      const s = Math.sin(v.fase * TAU) + 0.12 * Math.sin(v.fase * 3 * TAU);
      const [a, b] = paneo(v.pan);
      l += s * g * a; r += s * g * b;
    }
    const k = nivel(t) * 0.012;
    poner(MUS, i, l * k, r * k, 0.5);
  }
}
colchon((t) => {
  if (t < ACTOS.solo) return 0.9;
  if (t < ACTOS.puerta) return 0.55; /* «solo»: el colchón se queda lejos */
  if (t < ACTOS.porque) return 0.6 + 0.5 * tramo(t, ACTOS.puerta, 7);
  if (t < ACTOS.casa) return 0.8;
  if (t < ACTOS.entrar) return 1.15; /* la casa: respira más ancho */
  return 0.95;
});

/* ---------- bajo redondo: la fundamental, con un poco de segundo armónico ---------- */
{
  let fase = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    let f = hz(acordeEn(t)[0]);
    while (f > 70) f /= 2;
    while (f < 38) f *= 2;
    fase += f / SR;
    const pulso = hayPulso(t) ? 1 - 0.7 * Math.exp(-(t % NEGRA) * 11) : 1;
    const g = t < ACTOS.solo ? 0.9 : t < ACTOS.puerta ? 0.25 : t < ACTOS.porque ? 0.4 + 0.5 * tramo(t, ACTOS.puerta, 7) : t < ACTOS.casa ? 1 : t < ACTOS.entrar ? 0.55 : 0.85;
    const x = Math.tanh((Math.sin(TAU * fase) + 0.25 * Math.sin(2 * TAU * fase)) * 1.2) * 0.1 * g * pulso;
    poner(MUS, i, x, x, 0);
  }
}

/* ---------- el piano: el motivo ---------- */
/* gancho: tres acordes golpeados con cada línea */
[[0, 1], [NEGRA / 2, 0.8], [NEGRA, 0.9]].forEach(([t, v]) => ['D3', 'A3', 'E4', 'F4'].forEach((n, k) => piano(MUS, t + k * 0.008, n, 0.55 * v, 2.2)));
/* y un motivo breve que es la firma del video: la–do–re–mi */
const MOTIVO = ['A4', 'C5', 'D5', 'E5'];
MOTIVO.forEach((n, k) => piano(MUS, NEGRA * 2 + k * (NEGRA / 2), n, 0.45, 1.8));
/* «solo»: notas sueltas, lejos, con mucha sala */
[['A4', 2.75], ['F4', 3.55], ['E4', 4.2], ['D4', 4.75]].forEach(([n, t]) => piano(MUS, t, n, 0.32, 3.2, 0.75));
/* la subida a la puerta: el arpegio se aprieta de corcheas a semicorcheas y sube */
{
  const notas = ['Bb3', 'D4', 'F4', 'A4', 'C5', 'D5', 'F5', 'A5'];
  for (let t = ACTOS.puerta, k = 0; t < 6.95; k++) {
    const u = tramo(t, ACTOS.puerta, 7);
    piano(MUS, t, notas[k % notas.length], 0.3 + 0.35 * u, 1.2);
    t += u < 0.45 ? NEGRA / 2 : NEGRA / 4;
  }
}
/* desde el porqué: arpegio continuo en corcheas sobre cada acorde, humano */
function arpegio(desde, hasta, vel = 0.34) {
  const figura = [0, 2, 3, 1, 4, 2, 3, 1];
  for (let k = 0, t = desde; t < hasta - 0.01; k++, t += NEGRA / 2) {
    const ac = acordeEn(t + 0.01).slice(1);
    const n = midi(ac[figura[k % 8] % ac.length]) + 12;
    const acento = k % 4 === 0 ? 1.15 : k % 2 ? 0.8 : 0.95;
    piano(MUS, t + (azar() - 0.5) * 0.008, hzM(n), vel * acento * (0.9 + 0.2 * azar()), 1.6, 0.3);
  }
}
arpegio(ACTOS.porque, ACTOS.llaves - 0.3, 0.3);
arpegio(ACTOS.llaves, ACTOS.casa, 0.34);
/* la casa: el motivo vuelve, lento, una octava arriba */
MOTIVO.forEach((n, k) => piano(MUS, ACTOS.casa + 0.2 + k * NEGRA, hzM(midi(n) + 12), 0.4, 3.2, 0.55));
['D3', 'A3', 'F4', 'C5'].forEach((n, k) => piano(MUS, ACTOS.casa + k * 0.02, n, 0.4, 3.5, 0.5));
/* entrar: arpegio más suave y el motivo resuelve en fa */
arpegio(ACTOS.entrar, 26.0, 0.26);
['F3', 'C4', 'E4', 'A4'].forEach((n, k) => piano(MUS, 26.1 + k * 0.03, n, 0.42, 1.9, 0.55));
['A5', 'C6', 'F6'].forEach((n, k) => piano(MUS, 26.1 + NEGRA + k * (NEGRA / 2), n, 0.3, 1.2, 0.6));

/* ---------- ritmo: bombo blando, shaker y chasquido ---------- */
function bombo(t0, vol = 1) {
  let fase = 0;
  for (let k = 0; k < SR * 0.4; k++) {
    const t = k / SR;
    fase += (46 + 70 * Math.exp(-t * 32)) / SR;
    const x = Math.sin(TAU * fase) * Math.exp(-t * 8) * 0.34 * vol;
    poner(RIT, Math.round(t0 * SR) + k, x, x, 0.02);
  }
}
function shaker(t0, vol = 1, pan = 0.25) {
  const [pl, pr] = paneo(pan), w = 2 * Math.sin((Math.PI * 7500) / SR);
  let b1 = 0, b2 = 0;
  for (let k = 0; k < SR * 0.07; k++) {
    const t = k / SR, x0 = ruido();
    b2 += w * b1; const hp = x0 - b2 - 0.7 * b1; b1 += w * hp;
    const x = b1 * (1 - Math.exp(-t * 900)) * Math.exp(-t * 60) * 0.035 * vol;
    poner(RIT, Math.round(t0 * SR) + k, x * pl, x * pr, 0.15);
  }
}
function chasquido(t0, vol = 1) {
  let lp = 0;
  for (let k = 0; k < SR * 0.18; k++) {
    const t = k / SR;
    lp += 0.5 * (ruido() - lp);
    const x = (lp * Math.exp(-t * 38) * 0.12 + Math.sin(TAU * 210 * t) * Math.exp(-t * 60) * 0.05) * vol;
    poner(RIT, Math.round(t0 * SR) + k, x, x, 0.45);
  }
}
for (let t = 0; t < 27.2; t += NEGRA) {
  if (!hayPulso(t + 0.001)) continue;
  const tiempo = Math.round(t / NEGRA) % 4;
  const lleno = t >= ACTOS.llaves || t < ACTOS.solo;
  bombo(t, t < ACTOS.solo ? 1 : t < ACTOS.llaves ? 0.7 : 0.9);
  shaker(t + NEGRA / 2 + 0.012, lleno ? 1 : 0.7, 0.3);
  if (lleno) shaker(t + NEGRA * 0.75 + 0.01, 0.5, -0.3);
  if (t >= ACTOS.llaves && (tiempo === 1 || tiempo === 3)) chasquido(t, 0.9);
}

/* ---------- efectos ---------- */
/* impacto: grave cálido que cae, sin ruido áspero */
function impacto(t0, vol = 1, dur = 2.2) {
  let fase = 0, lp = 0;
  for (let k = 0; k < SR * dur; k++) {
    const t = k / SR;
    fase += (32 + 55 * Math.exp(-t * 5)) / SR;
    lp += 0.03 * (ruido() - lp);
    const x = (Math.sin(TAU * fase) * Math.exp(-t * 1.8) * 0.5 + lp * Math.exp(-t * 7) * 0.5) * vol;
    poner(FX, Math.round(t0 * SR) + k, x, x, 0.4);
  }
}
/* barrido inverso: un acorde que se desvanece, dado la vuelta, que desemboca en el golpe */
function barridoInverso(t1, notas, dur = 1.1, vol = 1) {
  const n = Math.round(dur * SR), b = new Float32Array(n);
  notas.forEach((nota, i) => {
    const f = hz(nota), v = 0.05 / (1 + i * 0.3);
    for (let k = 0; k < n; k++) { const t = k / SR; b[k] += (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * 2 * f * t)) * Math.exp(-t * 2.6) * v; }
  });
  for (let k = 0; k < n; k++) {
    const u = k / n, [pl, pr] = paneo(Math.sin(u * 5) * 0.3);
    const x = b[n - 1 - k] * Math.pow(u, 2.2) * vol * 1.4;
    poner(FX, Math.round((t1 - dur) * SR) + k, x * pl, x * pr, 0.7);
  }
}
impacto(0, 0.75);
impacto(ACTOS.solo, 0.6);
barridoInverso(ACTOS.puerta, ['Bb3', 'F4', 'D5'], 1.0, 0.8);
impacto(ACTOS.puerta, 0.45);
barridoInverso(ACTOS.llaves, ['Bb3', 'F4', 'C5'], 0.8, 0.7);
impacto(ACTOS.llaves, 0.55);
barridoInverso(ACTOS.casa, ['D4', 'A4', 'E5'], 1.2, 0.9);
impacto(ACTOS.casa, 0.6, 3);
barridoInverso(ACTOS.entrar, ['F3', 'C4', 'A4'], 0.9, 0.8);
impacto(ACTOS.entrar, 0.6);

/* la subida: ruido rosado suave que se abre, sin chirriar */
{
  let b1 = 0, b2 = 0, rosa = 0;
  for (let i = Math.round((ACTOS.puerta + 0.4) * SR); i < Math.round(6.95 * SR); i++) {
    const u = tramo(i / SR, ACTOS.puerta + 0.4, 6.95);
    const w = 2 * Math.sin((Math.PI * 300 * Math.pow(16, u)) / SR);
    rosa = 0.97 * rosa + 0.03 * ruido() * 6;
    b2 += w * b1; const hp = rosa - b2 - 0.5 * b1; b1 += w * hp;
    const x = b1 * u * u * 0.05, s = Math.sin(u * 24) * 0.25 * u;
    poner(FX, i, x * (1 - s), x * (1 + s), 0.5);
  }
}
/* la esfera pasa por cada losa: soplo corto y campana de cristal afinada */
function soplo(t1, vol = 1) {
  let b1 = 0, b2 = 0;
  for (let k = 0; k < SR * 0.4; k++) {
    const u = k / (SR * 0.4), w = 2 * Math.sin((Math.PI * (600 + 2400 * u)) / SR);
    const x0 = ruido(); b2 += w * b1; const hp = x0 - b2 - 0.4 * b1; b1 += w * hp;
    const [pl, pr] = paneo(-0.6 + 1.2 * u);
    const x = b1 * Math.pow(Math.sin(u * Math.PI), 2) * 0.03 * vol;
    poner(FX, Math.round((t1 - 0.34) * SR) + k, x * pl, x * pr, 0.3);
  }
}
function campana(t0, nota, vol = 1, pan = 0, dur = 3.5) {
  const f = hz(nota), [pl, pr] = paneo(pan);
  const parc = [[1, 1, 1.4], [2.76, 0.35, 2.6], [5.4, 0.18, 4.5], [0.5, 0.25, 1.1]];
  for (let k = 0; k < SR * dur; k++) {
    const t = k / SR;
    let x = 0;
    for (const [r, a, d] of parc) x += Math.sin(TAU * f * r * t) * a * Math.exp(-t * d);
    x *= (1 - Math.exp(-t * 600)) * 0.045 * vol;
    poner(FX, Math.round(t0 * SR) + k, x * pl, x * pr, 0.55);
  }
}
['D5', 'F5', 'G5', 'A5', 'D6'].forEach((n, j) => { soplo(encendido(j), 0.9); campana(encendido(j), n, 1, -0.5 + j * 0.25); });
/* el dominio aparece: una campana doble, la invitación */
campana(24.48, 'A5', 0.8, 0.15, 4);
campana(24.48 + NEGRA / 2, 'E6', 0.45, -0.2, 3.5);

/* cada vara que encaja: una nota de marimba de la escala, en cascada hacia arriba */
function marimba(t0, nota, vol = 1, pan = 0) {
  const f = hzM(nota), [pl, pr] = paneo(pan);
  for (let k = 0; k < SR * 0.6; k++) {
    const t = k / SR;
    const x = (Math.sin(TAU * f * t) * Math.exp(-t * 7) + 0.25 * Math.sin(TAU * f * 3.93 * t) * Math.exp(-t * 26) + 0.08 * Math.sin(TAU * f * 9.2 * t) * Math.exp(-t * 60)) * (1 - Math.exp(-t * 2000)) * 0.05 * vol;
    poner(FX, Math.round(t0 * SR) + k, x * pl, x * pr, 0.3);
  }
}
{
  const escala = [62, 65, 67, 69, 72]; /* re menor pentatónica desde re4 */
  let k = 0;
  for (let fila = 0; fila < 13; fila++) for (const lado of [-1, 1]) {
    const nota = escala[k % 5] + 12 * Math.floor(k / 5) - 12;
    marimba(ACTOS.puerta + 0.05 + fila * 0.05 + 0.05 * azar() + 1.1, nota, 0.55 + 0.25 * (k / 26), lado * (0.2 + fila * 0.04));
    k++;
  }
}
/* el tiempo quieto: una nota alta de cristal que respira, y un latido lejano */
{
  const f1 = hz('A5'), f2 = hz('E6');
  for (let i = Math.round(2.7 * SR); i < Math.round(5.0 * SR); i++) {
    const t = i / SR, g = suave(tramo(t, 2.7, 3.3)) * (1 - suave(tramo(t, 4.4, 5.0))) * (0.75 + 0.25 * Math.sin(t * 5));
    const x = (Math.sin(TAU * f1 * t) + 0.6 * Math.sin(TAU * f2 * t + 1)) * 0.008 * g;
    poner(FX, i, x, x * 0.85, 0.8);
  }
  for (let t = ACTOS.solo + 0.1; t < ACTOS.puerta - 0.2; t += COMPAS / 2) for (const [dt, v] of [[0, 0.8], [0.24, 0.5]]) {
    let fase = 0;
    for (let k = 0; k < SR * 0.28; k++) {
      const tt = k / SR;
      fase += (50 + 28 * Math.exp(-tt * 30)) / SR;
      const x = Math.sin(TAU * fase) * Math.exp(-tt * 14) * 0.22 * v;
      poner(FX, Math.round((t + dt) * SR) + k, x, x, 0.1);
    }
  }
}
/* el león se dibuja: parciales de cristal que entran uno a uno */
{
  const a0 = ACTOS.casa + 0.15, a1 = ACTOS.casa + 2.4;
  const ps = ['A5', 'D6', 'E6', 'A6'].map((n) => ({ f: hz(n), fase: 0 }));
  for (let i = Math.round(a0 * SR); i < Math.round((a1 + 1.4) * SR); i++) {
    const t = i / SR, u = tramo(t, a0, a1), g = Math.sin((Math.min(1, u) * Math.PI) / 2) * (1 - tramo(t, a1, a1 + 1.4)) * 0.011;
    let l = 0, r = 0;
    ps.forEach((p, k) => {
      p.fase += (p.f * (1 + 0.003 * Math.sin(t * (4 + k)))) / SR;
      const s = Math.sin(TAU * p.fase) * suave(tramo(u, k * 0.18, k * 0.18 + 0.35));
      l += s * (k % 2 ? 0.6 : 1); r += s * (k % 2 ? 1 : 0.6);
    });
    poner(FX, i, l * g, r * g, 0.85);
  }
}

/* ---------- el tiempo se para: la música del gancho frena como una cinta ---------- */
function frenarCinta(b, a, dur, reentrada) {
  const i0 = Math.round(a * SR), n = Math.round(dur * SR);
  for (const canal of ['L', 'R', 'eL', 'eR']) {
    const x = b[canal], orig = x.slice(i0, i0 + n + 2);
    let pos = 0;
    for (let k = 0; k < n; k++) {
      const u = k / n;
      pos += Math.pow(1 - u, 1.6);
      const j = Math.floor(pos), f = pos - j;
      x[i0 + k] = ((orig[j] ?? 0) * (1 - f) + (orig[j + 1] ?? 0) * f) * (1 - u * u);
    }
    for (let i = i0 + n; i < Math.round(reentrada * SR); i++) x[i] *= suave(tramo(i / SR, a + dur, reentrada));
  }
}
frenarCinta(MUS, 2.2, 0.42, 3.1);
frenarCinta(RIT, 2.2, 0.42, 2.62);

/* ---------- el silencio antes de la puerta: todo cae y solo queda la inhalación ---------- */
for (const b of [MUS, RIT, FX]) for (const canal of ['L', 'R', 'eL', 'eR']) {
  const x = b[canal];
  for (let i = Math.round(6.85 * SR); i < Math.round(ACTOS.porque * SR); i++) x[i] *= 1 - 0.93 * suave(tramo(i / SR, 6.85, 7.05));
}
barridoInverso(ACTOS.porque, ['G3', 'D4', 'Bb4', 'A5'], 0.5, 1.2); /* la inhalación, sola, en el silencio */
impacto(ACTOS.porque, 1.1, 2.8);

/* ---------- la sala: FDN de ocho líneas con matriz de Householder ---------- */
function sala(eL, eR, rt60 = 2.6, predelay = 0.022) {
  const lineas = [1433, 1601, 1867, 2053, 2251, 2399, 2617, 2903].map((n) => ({ b: new Float32Array(n), i: 0, n, lp: 0, g: Math.pow(10, (-3 * n) / (rt60 * SR)) }));
  const pd = Math.round(predelay * SR);
  /* difusión de entrada: cuatro pasa-todo por canal */
  const difusor = (x, ds) => {
    for (const d of ds) { const b = new Float32Array(d); let j = 0; for (let i = 0; i < N; i++) { const y = b[j], v = x[i] + y * 0.6; b[j] = v; x[i] = y - 0.6 * v; j = (j + 1) % d; } }
    return x;
  };
  const inL = difusor(eL.slice(), [142, 107, 379, 277]), inR = difusor(eR.slice(), [151, 113, 391, 263]);
  const oL = new Float32Array(N), oR = new Float32Array(N), s = new Float32Array(8);
  for (let i = 0; i < N; i++) {
    const xl = i >= pd ? inL[i - pd] : 0, xr = i >= pd ? inR[i - pd] : 0;
    let suma = 0;
    for (let k = 0; k < 8; k++) { const l = lineas[k]; l.lp += 0.62 * (l.b[l.i] - l.lp); s[k] = l.lp * l.g; suma += s[k]; }
    suma *= 2 / 8;
    let sl = 0, sr = 0;
    for (let k = 0; k < 8; k++) {
      const l = lineas[k];
      l.b[l.i] = s[k] - suma + (k % 2 ? xr : xl) * 0.5;
      l.i = (l.i + 1) % l.n;
      if (k < 4) sl += s[k]; else sr += s[k];
    }
    oL[i] = sl * 0.4; oR[i] = sr * 0.4;
  }
  return [oL, oR];
}

/* ---------- la voz ---------- */
function leerWav(ruta) {
  const b = fs.readFileSync(ruta);
  let p = 12, sr = 22050, datos = null, canales = 1, bits = 16;
  while (p < b.length) {
    const id = b.toString('ascii', p, p + 4), tam = b.readUInt32LE(p + 4);
    if (id === 'fmt ') { canales = b.readUInt16LE(p + 10); sr = b.readUInt32LE(p + 12); bits = b.readUInt16LE(p + 22); }
    if (id === 'data') datos = b.subarray(p + 8, p + 8 + tam);
    p += 8 + tam + (tam % 2);
  }
  const paso = (bits / 8) * canales, n = Math.floor(datos.length / paso), x = new Float32Array(n);
  for (let i = 0; i < n; i++) x[i] = bits === 32 ? datos.readFloatLE(i * paso) : datos.readInt16LE(i * paso) / 32768;
  return { x, sr };
}
const VOZ = new Float32Array(N), eVoz = new Float32Array(N);
const guion = fs.existsSync('public/voz/guion.json') ? JSON.parse(fs.readFileSync('public/voz/guion.json', 'utf8')) : [];
for (const l of guion) {
  const { x, sr } = leerWav('public/voz/' + l.id + '.wav');
  let pico = 0;
  for (const v of x) pico = Math.max(pico, Math.abs(v));
  const n = Math.floor((x.length * SR) / sr), i0 = Math.round(l.en * SR);
  let hp = 0, prev = 0, env = 0, agudos = 0, prevA = 0, eA = 0, cuerpo = 0;
  for (let k = 0; k < n; k++) {
    const q = (k * sr) / SR, a = Math.floor(q), f = q - a;
    let v = ((x[a] ?? 0) * (1 - f) + (x[a + 1] ?? 0) * f) / pico;
    hp = 0.99 * (hp + v - prev); prev = v; v = hp;           /* fuera lo de debajo de ~80 Hz */
    cuerpo += 0.02 * (v - cuerpo); v += cuerpo * 0.35;       /* un poco de pecho */
    agudos = 0.55 * (agudos + v - prevA); prevA = v;         /* la banda de las eses */
    eA = Math.max(Math.abs(agudos), eA * 0.998);
    v -= agudos * Math.min(0.6, Math.max(0, eA - 0.12) * 2.5); /* de-esser suave */
    env = Math.max(Math.abs(v), env * 0.9996);
    const g = 1 / Math.max(1, Math.pow(env * 1.7, 0.6));     /* compresión suave */
    if (i0 + k < N) VOZ[i0 + k] += v * g * 1.1;
  }
}
/* la envolvente que aparta la música: ataque de 40 ms, suelta en 450 ms */
{
  const at = 1 - Math.exp(-1 / (0.04 * SR)), su = 1 - Math.exp(-1 / (0.45 * SR));
  let e = 0, pico = 0;
  for (let i = 0; i < N; i++) {
    pico = Math.max(Math.abs(VOZ[i]), pico * 0.9985);
    const obj = Math.min(1, pico * 3);
    e += (obj - e) * (obj > e ? at : su);
    eVoz[i] = e;
  }
}

/* ---------- mezcla ---------- */
const eL = new Float32Array(N), eR = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const aparta = 1 - 0.65 * eVoz[i];
  eL[i] = (MUS.eL[i] + RIT.eL[i]) * aparta + FX.eL[i] + VOZ[i] * 0.1;
  eR[i] = (MUS.eR[i] + RIT.eR[i]) * aparta + FX.eR[i] + VOZ[i] * 0.1;
}
const [sL, sR] = sala(eL, eR);
const L = new Float32Array(N), R = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const t = i / SR, aparta = 1 - 0.65 * eVoz[i], fin = Math.min(1, t / 0.01) * (1 - suave(tramo(t, 27.2, 28)));
  L[i] = ((MUS.L[i] + RIT.L[i]) * aparta + FX.L[i] + VOZ[i] + sL[i]) * fin;
  R[i] = ((MUS.R[i] + RIT.R[i]) * aparta + FX.R[i] + VOZ[i] + sR[i]) * fin;
}

/* ---------- limitador con 5 ms de anticipación: sube el nivel sin saturar ---------- */
{
  let rms = 0;
  for (let i = 0; i < N; i++) rms += L[i] * L[i] + R[i] * R[i];
  rms = Math.sqrt(rms / (2 * N));
  const techo = Math.pow(10, -1 / 20), ganancia = Math.pow(10, -16 / 20) / rms, ant = Math.round(0.005 * SR);
  const req = new Float32Array(N);
  for (let i = 0; i < N; i++) { const p = Math.max(Math.abs(L[i]), Math.abs(R[i])) * ganancia; req[i] = p > techo ? techo / p : 1; }
  const suelta = 1 - Math.exp(-1 / (0.08 * SR));
  let g = 1;
  for (let i = 0; i < N; i++) {
    let obj = 1;
    for (let k = 0; k <= ant && i + k < N; k += 4) obj = Math.min(obj, req[i + k]);
    g = obj < g ? obj : g + (obj - g) * suelta;
    L[i] = Math.max(-techo, Math.min(techo, L[i] * ganancia * g));
    R[i] = Math.max(-techo, Math.min(techo, R[i] * ganancia * g));
  }
  console.log('ganancia de salida', (20 * Math.log10(ganancia)).toFixed(1), 'dB');
}

const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8); buf.write('fmt ', 12);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(L[i] * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(R[i] * 32767), 46 + i * 4); }
fs.mkdirSync('public', { recursive: true });
fs.writeFileSync('public/banda-sonora.wav', buf);
console.log('public/banda-sonora.wav ·', DUR, 's');
