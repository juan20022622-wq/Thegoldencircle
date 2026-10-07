/* La cámara se mueve como en un programa de animación: claves con tiempo y la
   curva pasa por ellas con velocidad continua (Hermite con tangentes de
   Catmull-Rom sobre tiempo no uniforme). Una clave marcada `quieta` aterriza
   con velocidad cero; las demás se atraviesan sin frenar. */

export type Vec = [number, number, number];
export type Clave = {
  t: number;
  p: Vec; // posición
  m: Vec; // hacia dónde mira
  foco?: number; // distancia de foco; si falta, la distancia a `m`
  ap?: number; // radio de la apertura
  fov?: number;
  quieta?: boolean;
};
export type Toma = { p: Vec; m: Vec; foco: number; ap: number; fov: number };

const escalares = (c: Clave): number[] => {
  const d = Math.hypot(c.p[0] - c.m[0], c.p[1] - c.m[1], c.p[2] - c.m[2]);
  return [...c.p, ...c.m, c.foco ?? d, c.ap ?? 0.05, c.fov ?? 30];
};

export function plano(claves: Clave[]) {
  const v = claves.map(escalares);
  const n = claves.length;
  const tang = (i: number, k: number) => {
    if (claves[i].quieta || i === 0 || i === n - 1) return 0;
    return (v[i + 1][k] - v[i - 1][k]) / (claves[i + 1].t - claves[i - 1].t);
  };
  return (t: number): Toma => {
    let i = 0;
    while (i < n - 2 && t > claves[i + 1].t) i++;
    const a = claves[i], b = claves[i + 1];
    const h = b.t - a.t;
    const u = Math.min(1, Math.max(0, (t - a.t) / h));
    const u2 = u * u, u3 = u2 * u;
    const h00 = 2 * u3 - 3 * u2 + 1, h10 = u3 - 2 * u2 + u, h01 = -2 * u3 + 3 * u2, h11 = u3 - u2;
    const r = v[i].map((_, k) => h00 * v[i][k] + h10 * h * tang(i, k) + h01 * v[i + 1][k] + h11 * h * tang(i + 1, k));
    return { p: [r[0], r[1], r[2]], m: [r[3], r[4], r[5]], foco: r[6], ap: r[7], fov: r[8] };
  };
}
