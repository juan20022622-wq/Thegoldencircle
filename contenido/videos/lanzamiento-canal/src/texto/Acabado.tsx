/* Lo que va encima de todo: viñeta, grano que cambia en cada fotograma y el
   fundido de entrada. El grano rompe el plano digital; la viñeta lleva el ojo al
   centro sin que se note. */
import { useCurrentFrame } from 'remotion';
import { entra, entraSale, sale, tramo } from '../tiempo';
import { useSegundo } from './primitivas';

export const Acabado: React.FC = () => {
  const f = useCurrentFrame();
  const t = useSegundo();
  const inicio = 1 - tramo(t, 0, 0.25);
  /* el fogonazo de la puerta se tiñe de oro: nunca blanco papel */
  const fogonazo = t < 7.5 ? entra(tramo(t, 7.15, 7.5)) : 1 - sale(tramo(t, 7.5, 8.2));
  /* el pie oscuro sostiene el descargo; al final crece para el texto largo */
  const pie = (0.55 + 0.4 * entraSale(tramo(t, 25.6, 26.6))) * (1 - fogonazo * 0.8);
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 85% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 760, background: `linear-gradient(180deg, rgba(4,4,5,0) 0%, rgba(4,4,5,${pie}) 45%, rgba(4,4,5,${pie}) 100%)` }} />
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07, mixBlendMode: 'overlay' }}>
        <filter id="grano">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 97} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grano)" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, background: '#E4BE78', mixBlendMode: 'multiply', opacity: fogonazo * 0.85 }} />
      <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: inicio * 0.35 }} />
    </>
  );
};
