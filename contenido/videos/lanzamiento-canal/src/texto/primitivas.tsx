/* Primitivas de tipografía en movimiento. Todo se mide en segundos del video
   para que cuadre con la grilla de `tiempo.ts`. */
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { aterriza, clamp, entra, rebota, sale, tramo } from '../tiempo';
import { loadFont as manrope } from '@remotion/google-fonts/Manrope';
import { loadFont as plex } from '@remotion/google-fonts/IBMPlexMono';

export const LEER = manrope('normal', { weights: ['300', '400', '500', '600'], subsets: ['latin', 'latin-ext'] }).fontFamily;
export const MONO = plex('normal', { weights: ['400', '500'], subsets: ['latin', 'latin-ext'] }).fontFamily;

export const C = {
  hueso: '#F2EDE3',
  gris: '#8A8578',
  oro: '#D2A64B',
  oroClaro: '#E7C67F',
  negro: '#0A0A0B',
};

export const useSegundo = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};

/* salida común: sube un poco, se desenfoca y se va */
export const salida = (t: number, fin: number, dur = 0.38) => {
  const u = entra(tramo(t, fin, fin + dur));
  return { opacity: 1 - u, transform: `translateY(${-u * 26}px)`, filter: `blur(${u * 12}px)` };
};

type PalabrasProps = {
  texto: string;
  desde: number;
  hasta: number;
  tam?: number;
  peso?: number;
  color?: string;
  resalta?: Record<string, string>; // palabra → color
  escalon?: number;
  estilo?: React.CSSProperties;
};

/* Una línea que entra palabra a palabra desde abajo, con máscara: cada palabra
   sube desde detrás de su propia línea base y aterriza con una curva larga. */
export const Palabras: React.FC<PalabrasProps> = ({ texto, desde, hasta, tam = 100, peso = 500, color = C.hueso, resalta = {}, escalon = 0.07, estilo }) => {
  const t = useSegundo();
  if (t < desde - 0.05 || t > hasta + 0.5) return null;
  const palabras = texto.split(' ');
  return (
    <div style={{ fontFamily: LEER, fontSize: tam, fontWeight: peso, letterSpacing: '-0.028em', lineHeight: 1.04, color, whiteSpace: 'nowrap', ...salida(t, hasta), ...estilo }}>
      {palabras.map((p, i) => {
        const u = clamp(tramo(t, desde + i * escalon, desde + i * escalon + 0.85));
        const a = aterriza(u);
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: '0.12em', marginBottom: '-0.12em', verticalAlign: 'top' }}>
            <span
              style={{
                display: 'inline-block',
                transform: `translateY(${(1 - a) * 108}%) rotate(${(1 - a) * 4}deg)`,
                transformOrigin: 'left bottom',
                filter: `blur(${(1 - sale(u)) * 6}px)`,
                color: resalta[p] ?? undefined,
              }}
            >
              {p}
              {i < palabras.length - 1 ? ' ' : ''}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/* Aparición limpia por opacidad y desenfoque, para rótulos y textos pequeños */
export const Aparece: React.FC<{ desde: number; hasta: number; dur?: number; estilo?: React.CSSProperties; children: React.ReactNode }> = ({ desde, hasta, dur = 0.6, estilo, children }) => {
  const t = useSegundo();
  if (t < desde - 0.05 || t > hasta + 0.5) return null;
  const u = sale(tramo(t, desde, desde + dur));
  const s = salida(t, hasta);
  return (
    <div style={{ ...estilo, opacity: u * (s.opacity as number), filter: `blur(${(1 - u) * 10 + parseFloat(String(s.filter).slice(5))}px)`, transform: `translateY(${(1 - u) * 18}px) ${s.transform}` }}>
      {children}
    </div>
  );
};

/* Una línea fina de oro que se traza de izquierda a derecha */
export const Trazo: React.FC<{ desde: number; hasta: number; ancho: number; estilo?: React.CSSProperties }> = ({ desde, hasta, ancho, estilo }) => {
  const t = useSegundo();
  if (t < desde || t > hasta + 0.5) return null;
  const u = sale(tramo(t, desde, desde + 0.9));
  const fuera = entra(tramo(t, hasta, hasta + 0.4));
  return <div style={{ position: 'absolute', height: 2, background: C.oro, width: ancho * u, marginLeft: ancho * fuera, maxWidth: ancho * (1 - fuera), ...estilo }} />;
};

/* Una línea que cae de golpe: entra grande y desenfocada, aterriza pasándose
   un poco y se asienta. Es la forma del gancho: cada línea es un impacto. */
export const Golpe: React.FC<{ texto: string; desde: number; hasta: number; tam?: number; color?: string; estilo?: React.CSSProperties; children?: React.ReactNode }> = ({ texto, desde, hasta, tam = 124, color = C.hueso, estilo, children }) => {
  const t = useSegundo();
  if (t < desde - 0.02 || t > hasta + 0.5) return null;
  const u = tramo(t, desde, desde + 0.34);
  const r = rebota(u);
  const s = salida(t, hasta, 0.3);
  return (
    <div
      style={{
        fontFamily: LEER,
        fontSize: tam,
        fontWeight: 600,
        letterSpacing: '-0.035em',
        lineHeight: 1.0,
        color,
        whiteSpace: 'nowrap',
        transformOrigin: 'left 70%',
        opacity: clamp(u * 3) * (s.opacity as number),
        transform: `scale(${1.32 - 0.32 * r}) translateY(${(1 - r) * 30}px) ${s.transform}`,
        filter: `blur(${(1 - sale(u)) * 16 + parseFloat(String(s.filter).slice(5))}px)`,
        ...estilo,
      }}
    >
      {children ?? texto}
    </div>
  );
};

/* Un destello que cruza una palabra de oro, como luz sobre metal */
export const Destello: React.FC<{ desde: number; children: React.ReactNode }> = ({ desde, children }) => {
  const t = useSegundo();
  const x = -40 + 180 * tramo(t, desde, desde + 0.7);
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(100deg, ${C.oroClaro} ${x - 18}%, #FFF6DD ${x}%, ${C.oroClaro} ${x + 18}%)`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        textShadow: 'none',
        filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.55)) drop-shadow(0 0 34px rgba(0,0,0,0.45))',
      }}
    >
      {children}
    </span>
  );
};
