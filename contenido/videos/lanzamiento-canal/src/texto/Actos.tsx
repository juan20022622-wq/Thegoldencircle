/* La tipografía de los seis actos. El copy pasó por revision-copy-trading
   (2026-09-28): sin promesas, sin cifras, sin instrumento ni broker, Christian
   como alguien que opera su cuenta y lo enseña, no como asesor. */
import { staticFile } from 'remotion';
import { LEON } from './leon';
import { ACTOS, DURACION, LLAVES, NEGRA, aterriza, clamp, encendido, entraSale, sale, tramo } from '../tiempo';
import { Aparece, C, Destello, Golpe, LEER, MONO, Palabras, Trazo, salida, useSegundo } from './primitivas';

const M = 96; // margen lateral
const sombra = '0 2px 40px rgba(0,0,0,0.55)';
const bloque = (top: number): React.CSSProperties => ({ position: 'absolute', left: M, right: M, top, textShadow: sombra });

/* ---------------------------------- 1 ----------------------------------
   El gancho. Tres líneas, tres golpes en corcheas: texto, imagen y sonido en el
   primer fotograma. La primera línea ya está cayendo cuando arranca el video. */
const Gancho: React.FC = () => (
  <div style={bloque(290)}>
    <Golpe texto="Aprender trading" desde={-0.12} hasta={2.3} />
    <Golpe texto="no tiene por qué" desde={NEGRA / 2} hasta={2.34} />
    <Golpe texto="" desde={NEGRA} hasta={2.38}>
      ser <Destello desde={NEGRA + 0.45}>difícil.</Destello>
    </Golpe>
  </div>
);

/* ---------------------------------- 2 ----------------------------------
   El giro dentro del gancho: lo difícil no es aprender, es aprender solo. La
   música se vacía de golpe y queda un latido. «solo» duda y se aleja. */
const Solo: React.FC = () => {
  const t = useSegundo();
  const d = tramo(t, ACTOS.solo + 1.3, ACTOS.solo + 2.3);
  const temblor = Math.sin(t * 60) * 4 * Math.sin(d * Math.PI);
  return (
    <div style={bloque(290)}>
      <Palabras texto="Lo difícil" desde={ACTOS.solo + 0.05} hasta={4.75} tam={124} peso={600} />
      <Palabras
        texto="es hacerlo solo."
        desde={ACTOS.solo + 0.05 + NEGRA}
        hasta={4.8}
        tam={124}
        peso={600}
        color={C.gris}
        resalta={{ "solo.": C.hueso }}
        estilo={{ transform: `translateX(${temblor}px)`, filter: `blur(${Math.sin(d * Math.PI) * 2.5}px)` }}
      />
    </div>
  );
};

const Puerta: React.FC = () => (
  <div style={bloque(290)}>
    <Golpe texto="Por eso abrimos" desde={ACTOS.puerta + 0.02} hasta={6.75} />
    <Golpe texto="" desde={ACTOS.puerta + 0.02 + NEGRA} hasta={6.8} color={C.oroClaro}>
      <Destello desde={ACTOS.puerta + NEGRA + 0.5}>el canal.</Destello>
    </Golpe>
    <Trazo desde={ACTOS.puerta + 0.3 + NEGRA * 2} hasta={6.7} ancho={470} estilo={{ top: 268 }} />
  </div>
);

/* ---------------------------------- 3 ---------------------------------- */
const Tapado: React.FC<{ ancho: number; desde: number }> = ({ ancho, desde }) => {
  const t = useSegundo();
  const u = sale(tramo(t, desde, desde + 0.5));
  const brillo = ((t * 0.9) % 1.6) / 1.6;
  return (
    <span
      style={{
        display: 'inline-block',
        width: ancho * u,
        height: 30,
        borderRadius: 4,
        verticalAlign: 'middle',
        background: `linear-gradient(90deg, rgba(210,166,75,0.22) ${brillo * 100 - 30}%, rgba(231,198,127,0.5) ${brillo * 100}%, rgba(210,166,75,0.22) ${brillo * 100 + 30}%)`,
      }}
    />
  );
};

const Tarjeta: React.FC = () => {
  const t = useSegundo();
  const D = 8.95;
  if (t < D - 0.1 || t > 13.9) return null;
  const u = aterriza(tramo(t, D, D + 1.1));
  const deriva = t - D;
  const s = salida(t, 13.2, 0.45);
  const linea = (k: number) => ({ opacity: sale(tramo(t, D + 0.55 + k * 0.42, D + 0.9 + k * 0.42)), transform: `translateY(${(1 - sale(tramo(t, D + 0.55 + k * 0.42, D + 1.0 + k * 0.42))) * 14}px)` });
  const fila: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 0', borderTop: '1px solid rgba(242,237,227,0.10)' };
  const rotulo: React.CSSProperties = { fontFamily: MONO, fontSize: 26, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.gris };
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 790, perspective: 1600, display: 'flex', justifyContent: 'center', opacity: s.opacity as number, filter: s.filter as string }}>
      <div
        style={{
          width: 800,
          padding: '40px 48px 34px',
          borderRadius: 28,
          background: 'linear-gradient(180deg, rgba(24,24,28,0.86), rgba(14,14,16,0.9))',
          border: '1px solid rgba(210,166,75,0.26)',
          boxShadow: '0 60px 120px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 1px 0 rgba(255,255,255,0.08) inset',
          backdropFilter: 'blur(18px)',
          transform: `translateY(${(1 - u) * 220 - deriva * 6}px) rotateX(${(1 - u) * 28 + 7}deg) rotateY(${-9 + deriva * 1.6}deg) rotateZ(${(1 - u) * -3}deg) scale(${0.9 + u * 0.1})`,
          opacity: clamp(u * 1.6),
          color: C.hueso,
          fontFamily: LEER,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 24 }}>
          <img src={staticFile('simbolo.svg')} style={{ width: 44, height: 60, filter: 'invert(71%) sepia(40%) saturate(600%) hue-rotate(2deg) brightness(92%)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.01em' }}>The Golden Syndicate</div>
            <div style={{ fontFamily: MONO, fontSize: 22, color: C.gris, letterSpacing: '0.04em' }}>canal · Christian</div>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 22, color: C.gris }}>07:42</div>
        </div>
        <div style={{ ...fila, ...linea(0) }}>
          <span style={rotulo}>Entro en</span>
          <Tapado ancho={220} desde={D + 0.7} />
        </div>
        <div style={{ ...fila, ...linea(1) }}>
          <span style={rotulo}>Si sale mal, corto en</span>
          <Tapado ancho={220} desde={D + 1.1} />
        </div>
        <div style={{ ...fila, ...linea(2), display: 'block' }}>
          <div style={{ ...rotulo, marginBottom: 12 }}>Por qué</div>
          <div style={{ fontSize: 36, fontWeight: 400, lineHeight: 1.32, color: C.hueso }}>
            El precio volvió a una zona que ya defendió dos veces. Si la rompe, la idea deja de valer.
          </div>
        </div>
      </div>
    </div>
  );
};

const Porque: React.FC = () => (
  <>
    <div style={bloque(300)}>
      <Palabras texto="Christian opera su cuenta" desde={ACTOS.porque + 0.35} hasta={10.9} tam={76} />
      <Palabras texto="y te muestra cada paso." desde={ACTOS.porque + 0.35 + NEGRA} hasta={10.95} tam={76} color={C.gris} />
    </div>
    <div style={bloque(300)}>
      <Palabras texto="Dónde entra." desde={11.0} hasta={13.4} tam={76} />
      <Palabras texto="Dónde corta si sale mal." desde={11.8} hasta={13.45} tam={76} />
      <Palabras texto="Y por qué." desde={12.95} hasta={13.5} tam={76} color={C.oroClaro} />
    </div>
    <Tarjeta />
  </>
);

/* ---------------------------------- 4 ---------------------------------- */
const Llaves: React.FC = () => {
  const t = useSegundo();
  return (
    <div style={bloque(250)}>
      <Palabras texto="Y no es solo trading." desde={ACTOS.llaves + 0.1} hasta={18.9} tam={76} />
      <div style={{ marginTop: 60 }}>
        {LLAVES.map((l, j) => {
          const e = encendido(j);
          const siguiente = j < 4 ? encendido(j + 1) : 99;
          const actual = clamp(sale(tramo(t, e, e + 0.3)) - sale(tramo(t, siguiente, siguiente + 0.4)));
          const color = `rgb(${[242, 237, 227].map((c, k) => Math.round(c + ([231, 198, 127][k] - c) * actual)).join(',')})`;
          return (
            <div key={l} style={{ display: 'flex', alignItems: 'baseline', gap: 28 }}>
              <Aparece desde={e - 0.05} hasta={19.0 + j * 0.04} dur={0.4} estilo={{ fontFamily: MONO, fontSize: 26, color: C.gris, width: 48 }}>
                0{j + 1}
              </Aparece>
              <Palabras texto={l} desde={e - 0.08} hasta={19.0 + j * 0.04} tam={96} peso={500} color={color} escalon={0} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------------------------- 5 ---------------------------------- */
export const Leon: React.FC<{ desde: number; hasta: number; alto: number }> = ({ desde, hasta, alto }) => {
  const t = useSegundo();
  if (t < desde - 0.05 || t > hasta + 0.5) return null;
  const u = entraSale(tramo(t, desde, desde + 1.9));
  const s = salida(t, hasta, 0.45);
  return (
    <svg viewBox="391 475 250 393" style={{ height: alto, overflow: "visible", ...s, filter: `${s.filter} drop-shadow(0 0 ${10 + 14 * u}px rgba(210,166,75,${0.25 + 0.3 * u}))` }}>
      <g transform="matrix(1 0 0 -1 0 1350)">
        {LEON.map((d, i) => (
          <path key={i} d={d} pathLength={1} fill="none" stroke={C.oro} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - clamp(u * 1.08 - i * 0.04)} />
        ))}
      </g>
    </svg>
  );
};

const Casa: React.FC = () => {
  const t = useSegundo();
  const A = ACTOS.casa;
  const abre = aterriza(tramo(t, A + 1.2, A + 2.6));
  const s = salida(t, 22.8, 0.45);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', flexDirection: 'column', alignItems: 'center', textShadow: sombra }}>
      <Leon desde={A + 0.15} hasta={22.75} alto={440} />
      {t > A + 1.1 && t < 23.4 ? (
        <div style={{ marginTop: 70, fontFamily: LEER, fontWeight: 500, fontSize: 58, color: C.hueso, letterSpacing: `${0.5 - abre * 0.32}em`, marginRight: `${-(0.5 - abre * 0.32)}em`, opacity: abre * (s.opacity as number), filter: `blur(${(1 - abre) * 8}px) ${s.filter}`, whiteSpace: 'nowrap' }}>
          THE GOLDEN SYNDICATE
        </div>
      ) : null}
      <Aparece desde={A + 2.0} hasta={22.8} estilo={{ marginTop: 26, fontFamily: MONO, fontSize: 28, color: C.gris, letterSpacing: '0.04em' }}>
        dinero · propósito · cuerpo · mentalidad · educación
      </Aparece>
    </div>
  );
};

/* ---------------------------------- 6 ---------------------------------- */
const Entrar: React.FC = () => {
  const t = useSegundo();
  const E = ACTOS.entrar;
  const u = aterriza(tramo(t, E + 1.35, E + 2.2));
  return (
    <div style={bloque(300)}>
      <Palabras texto="Entrar es gratis." desde={E + 0.2} hasta={99} tam={112} />
      <Palabras texto="Empiezas desde cero." desde={E + 0.2 + NEGRA} hasta={99} tam={64} color={C.gris} estilo={{ marginTop: 18 }} />
      <div
        style={{
          marginTop: 64,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 20,
          padding: '26px 38px',
          borderRadius: 999,
          border: `1.5px solid rgba(210,166,75,${0.7 * u})`,
          background: `rgba(10,10,11,${0.55 * u})`,
          fontFamily: MONO,
          fontSize: 42,
          fontWeight: 500,
          color: C.hueso,
          opacity: u,
          transform: `translateY(${(1 - u) * 30}px) scale(${0.94 + u * 0.06})`,
          filter: `blur(${(1 - u) * 10}px)`,
          textShadow: 'none',
        }}
      >
        <span style={{ width: 14, height: 14, borderRadius: 7, background: C.oro, boxShadow: `0 0 ${18 + Math.sin(t * 5) * 6}px ${C.oro}` }} />
        thegoldensyndicate.com
      </div>
      <Aparece desde={E + 2.0} hasta={99} estilo={{ marginTop: 22, marginLeft: 8, fontFamily: MONO, fontSize: 28, color: C.gris, letterSpacing: '0.06em', textShadow: 'none' }}>
        Canal gratis en Telegram · enlace en la bio
      </Aparece>
    </div>
  );
};

/* ------------------------------ descargo ------------------------------ */
const Descargo: React.FC = () => {
  const t = useSegundo();
  /* el corto sale del todo antes de que entre el largo: nunca se pisan */
  const sale1 = entraSale(tramo(t, 25.9, 26.2));
  const cambio = entraSale(tramo(t, 26.25, 26.75));
  const base: React.CSSProperties = { position: 'absolute', left: M, right: M, fontFamily: MONO, color: C.gris, textAlign: 'center', letterSpacing: '0.01em' };
  return (
    <>
      <div style={{ ...base, top: 1590, fontSize: 23, lineHeight: 1.45, opacity: (1 - sale1) * 0.9 * sale(tramo(t, 0.1, 0.8)) }}>
        El trading conlleva riesgo de pérdida.
        <br />
        Contenido educativo, no asesoría de inversión.
      </div>
      <div style={{ ...base, top: 1480, fontSize: 23, lineHeight: 1.5, opacity: cambio * 0.95, transform: `translateY(${(1 - cambio) * 14}px)` }}>
        El trading conlleva riesgo de pérdida. El contenido es educativo y no constituye asesoría de inversión. Los resultados pasados no garantizan resultados futuros. Opera solo con capital que puedas permitirte perder.
      </div>
    </>
  );
};

export const Tipografia: React.FC = () => {
  const t = useSegundo();
  const barrido = Math.sin(clamp(tramo(t, 13.35, 14.1)) * Math.PI);
  return (
    <div style={{ position: 'absolute', inset: 0, filter: barrido > 0.01 ? `blur(${barrido * 14}px)` : undefined }}>
      {t < ACTOS.solo + 0.4 && <Gancho />}
      {t >= ACTOS.solo - 0.1 && t < ACTOS.puerta + 0.4 && <Solo />}
      {t >= ACTOS.puerta && t < ACTOS.porque && <Puerta />}
      {t >= ACTOS.porque && t < ACTOS.llaves + 0.4 && <Porque />}
      {t >= ACTOS.llaves && t < ACTOS.casa + 0.4 && <Llaves />}
      {t >= ACTOS.casa - 0.2 && t < ACTOS.entrar + 0.4 && <Casa />}
      {t >= ACTOS.entrar && <Entrar />}
      <Descargo />
      <div style={{ position: 'absolute', left: 0, top: 0, height: 5, width: `${(t / DURACION) * 100}%`, background: C.oro, boxShadow: `0 0 16px ${C.oro}` }} />
    </div>
  );
};
