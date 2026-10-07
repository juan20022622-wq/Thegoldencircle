import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Lienzo3D } from './mundo/Lienzo3D';
import { Tipografia } from './texto/Actos';
import { Acabado } from './texto/Acabado';
import { empujon } from './tiempo';

export type Props = { muestras: number; escala: number; sonido?: boolean; fps?: number };

/* El punch-in del montaje: en cada golpe la imagen se acerca un 4 % y tiembla
   unos píxeles, y vuelve sola. La tipografía no se mueve: el golpe es de cámara. */
const Empuje: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const e = empujon(t);
  const x = Math.sin(t * 83) * e * 5, y = Math.cos(t * 71) * e * 4;
  return <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${1 + 0.042 * e})` }}>{children}</AbsoluteFill>;
};

export const Lanzamiento: React.FC<Props> = ({ muestras, escala, sonido = true }) => (
  <AbsoluteFill style={{ background: '#070708', overflow: 'hidden' }}>
    <Empuje>
      <Lienzo3D muestras={muestras} escala={escala} />
    </Empuje>
    <Acabado />
    <Tipografia />
    {sonido ? <Audio src={staticFile('banda-sonora.wav')} /> : null}
  </AbsoluteFill>
);
