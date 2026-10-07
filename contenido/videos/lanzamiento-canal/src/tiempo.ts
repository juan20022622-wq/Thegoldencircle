/* La grilla del video. Todo cae en compases de 96 BPM: un compás son 2,5 s y
   una negra 0,625 s. La imagen, la tipografía y la banda sonora leen de aquí,
   así que mover un acto mueve las tres cosas a la vez. */

export const BPM = 96;
export const NEGRA = 60 / BPM;
export const COMPAS = NEGRA * 4;
export const DURACION = 28;

export const ACTOS = {
  gancho: 0,
  solo: COMPAS,
  puerta: COMPAS * 2,
  porque: 7.5,
  llaves: 13.75,
  casa: 19.375,
  entrar: 23.125,
  fin: DURACION,
} as const;

/* los golpes: cada uno empuja la cámara un instante (el punch-in del montaje)
   y la banda sonora pone un impacto en el mismo sitio. [segundo, fuerza] */
export const GOLPES: [number, number][] = [
  [0, 1], [NEGRA / 2, 0.7], [NEGRA, 0.8],
  [COMPAS, 0.6], [COMPAS * 2, 0.7], [COMPAS * 3, 1],
  [13.75, 0.8], [19.375, 0.6], [23.125, 0.8],
];
export const empujon = (t: number) => GOLPES.reduce((s, [g, f]) => s + (t >= g ? f * Math.exp(-(t - g) * 7) : 0), 0);

/* cada losa se enciende en una negra */
export const LLAVES = ['dinero', 'propósito', 'cuerpo', 'mentalidad', 'educación'];
export const encendido = (j: number) => 15.0 + j * NEGRA;

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const tramo = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const mezclar = (a: number, b: number, u: number) => a + (b - a) * u;

export const suave = (u: number) => u * u * (3 - 2 * u);
export const entraSale = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
export const sale = (u: number) => 1 - Math.pow(1 - u, 3);
export const saleFuerte = (u: number) => 1 - Math.pow(1 - u, 5);
export const entra = (u: number) => u * u * u;
/* aterriza pasándose un poco: para los golpes de texto */
export const rebota = (u: number) => { const c = 1.9; return u >= 1 ? 1 : 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
/* la curva de las entradas de texto: arranca rápido y aterriza largo */
export const aterriza = (u: number) => 1 - Math.pow(2, -10 * u) * (u < 1 ? 1 : 0);

/* azar con semilla: el mismo mundo en cada fotograma */
export function azarCon(semilla: number) {
  let s = semilla | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
