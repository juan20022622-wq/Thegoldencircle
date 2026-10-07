import { Composition, getInputProps } from 'remotion';
import { Lanzamiento, type Props } from './Lanzamiento';
import { DURACION } from './tiempo';

/* 30 para borradores; el máster sale a 60 con --props='{"fps":60,...}' */
const FPS = Number(getInputProps().fps ?? 30);
export const Raiz: React.FC = () => (
  <Composition
    id="Lanzamiento"
    component={Lanzamiento}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={DURACION * FPS}
    defaultProps={{ muestras: 6, escala: 0.5 } satisfies Props}
  />
);
