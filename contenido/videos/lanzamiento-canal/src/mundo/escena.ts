/* El mundo del video
   ---------------------------------------------------------------------------
   Es el mismo de las piezas de Instagram (marca/sistema-diseno/escenas): suelo
   negro, horizonte de monolitos, grafito con barniz, hueso mate y oro satinado,
   un foco duro y un contraluz cálido. Tres zonas separadas en x:

     zona 1 (x = 0)    el gancho y la puerta: varas que llueven, se congelan en
                       el aire y se ordenan, el hilo que nace y dos monolitos que se abren
     zona 3 (x = 100)  el porqué: un hilo que corre sobre losas, detrás de la
                       tarjeta del canal
     zona 4 (x = 130)  las cinco llaves: cinco losas con un ojo, el hilo que las
                       enhebra, la esfera que las enciende al pasar, y al final
                       otra puerta

   `actualizar(t)` deja el mundo como está en el segundo t. No guarda estado:
   cualquier fotograma se puede pedir en cualquier orden. */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { plano, type Clave, type Toma } from './camara';
import { ACTOS, azarCon, clamp, empujon, encendido, entra, entraSale, mezclar, sale, suave, tramo } from '../tiempo';

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

export function crearMundo(renderer: THREE.WebGLRenderer) {
  const azar = azarCon(20260928);
  const entre = (a: number, b: number) => a + (b - a) * azar();

  const scene = new THREE.Scene();
  const FONDO = new THREE.Color(0x070708);
  scene.background = FONDO;
  scene.fog = new THREE.Fog(FONDO, 16, 52);
  /* entorno de estudio: la sala de siempre más tres tiras de luz, que son lo que
     el oro refleja en sus cantos */
  const sala = new RoomEnvironment();
  const tira = (w: number, h: number, x: number, y: number, z: number, ry: number, k: number) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k * 0.93, k * 0.82), side: THREE.DoubleSide }));
    m.position.set(x, y, z); m.rotation.y = ry; m.lookAt(0, y * 0.4, 0); sala.add(m);
  };
  tira(14, 1.2, 0, 11, 6, 0, 28); tira(1.4, 12, -12, 4, 2, 0, 18); tira(1.4, 12, 12, 5, -4, 0, 12);
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(sala, 0.03).texture;
  scene.environmentIntensity = 0.2;

  const mat = {
    grafito: new THREE.MeshPhysicalMaterial({ color: 0x1b1b20, roughness: 0.36, clearcoat: 0.7, clearcoatRoughness: 0.22 }),
    piedra: new THREE.MeshStandardMaterial({ color: 0x25252a, roughness: 0.88 }),
    hueso: new THREE.MeshPhysicalMaterial({ color: 0xe9e2d4, roughness: 0.5, clearcoat: 0.25, clearcoatRoughness: 0.4 }),
    oro: new THREE.MeshStandardMaterial({ color: 0xd2a64b, metalness: 1, roughness: 0.3, envMapIntensity: 3.5 }),
    hilo: new THREE.MeshStandardMaterial({ color: 0xd2a64b, metalness: 1, roughness: 0.28, emissive: 0x7a5a1a, emissiveIntensity: 0.8, envMapIntensity: 3.5 }),
    losa: new THREE.MeshPhysicalMaterial({ color: 0x141417, roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.18 }),
  };

  const malla = (geo: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0) => {
    const o = new THREE.Mesh(geo, m);
    o.position.set(x, y, z);
    o.castShadow = o.receiveShadow = true;
    scene.add(o);
    return o;
  };
  const caja = (w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number, r = 0.05) =>
    malla(new RoundedBoxGeometry(w, h, d, 4, Math.min(r, w / 2.2, h / 2.2, d / 2.2)), m, x, y, z);
  const esfera = (r: number, m: THREE.Material, x: number, y: number, z: number) => malla(new THREE.SphereGeometry(r, 96, 64), m, x, y, z);

  /* ---------- suelo, luz y aire ---------- */
  const suelo = new THREE.Mesh(new THREE.PlaneGeometry(600, 400), new THREE.MeshStandardMaterial({ color: 0x0c0c0e, roughness: 0.62 }));
  suelo.rotation.x = -Math.PI / 2;
  suelo.receiveShadow = true;
  scene.add(suelo);

  const foco = (x: number, y: number, z: number, tx: number, ty: number, tz: number, intensidad = 1500, angulo = 0.34) => {
    const f = new THREE.SpotLight(0xfff4e2, intensidad, 70, angulo, 0.7, 2);
    f.position.set(x, y, z);
    f.target.position.set(tx, ty, tz);
    f.castShadow = true;
    f.shadow.mapSize.set(2048, 2048);
    f.shadow.bias = -0.0004;
    f.shadow.radius = 5;
    scene.add(f, f.target);
    return f;
  };
  const focoZona1 = foco(-3.5, 15, 6, 0, 0.5, -2.5, 1500, 0.36);
  foco(96, 15, 7, 101, 0, -1, 1300, 0.5);
  foco(128, 16, 9, 133, 1, -4, 1150, 0.42);
  const contra = new THREE.DirectionalLight(0xe7c67f, 1.6);
  contra.position.set(30, 9, -40);
  scene.add(contra);
  const relleno = new THREE.DirectionalLight(0x7d93a6, 0.28);
  relleno.position.set(-30, 12, 30);
  scene.add(relleno);

  const texturaHalo = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d')!;
    const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    r.addColorStop(0, 'rgba(255,255,255,1)');
    r.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = r;
    g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const ORO = new THREE.Color('rgb(200,140,55)'), NOCHE = new THREE.Color('rgb(18,70,100)');
  const halo = (color: THREE.Color, x: number, y: number, z: number, tam: number, alfa: number) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(tam, tam),
      new THREE.MeshBasicMaterial({ map: texturaHalo, color, transparent: true, opacity: alfa, depthWrite: false, fog: false, blending: THREE.AdditiveBlending })
    );
    m.position.set(x, y, z);
    scene.add(m);
    return m;
  };
  for (const zx of [0, 100, 132]) {
    halo(ORO, zx + 9, 4, -42, 40, 0.22);
    halo(NOCHE, zx - 8, 8, -48, 60, 0.4);
    halo(NOCHE, zx + 20, 6, -50, 50, 0.3);
    for (let k = 0; k < 22; k++) {
      const h = entre(2.5, 7.5), a = entre(0.9, 2.6);
      caja(a, h, a, mat.piedra, zx + entre(-22, 26), h / 2, entre(-40, -22), 0.06).rotation.y = entre(0, 0.6);
    }
  }

  /* ---------- una puerta: dos monolitos que se separan y dejan salir la luz ---------- */
  function puerta(x: number, z: number, alto: number, ancho = 1.5) {
    const izq = caja(ancho, alto, 0.7, mat.grafito, x, alto / 2, z);
    const der = caja(ancho, alto, 0.7, mat.grafito, x, alto / 2, z);
    const luzMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0, 0, 0), fog: false });
    const luz = new THREE.Mesh(new THREE.PlaneGeometry(1.6, alto), luzMat);
    luz.position.set(x, alto / 2, z - 0.45);
    scene.add(luz);
    const p = new THREE.PointLight(0xe7b45a, 0, 26, 2);
    p.position.set(x, 1.8, z + 1.6);
    scene.add(p);
    const brillo = halo(ORO, x, alto * 0.5, z - 1.2, 14, 0);
    /* el haz que cae al suelo hacia la cámara */
    const c = document.createElement('canvas');
    c.width = 64; c.height = 512;
    const g = c.getContext('2d')!;
    const gr = g.createLinearGradient(0, 0, 0, 512);
    gr.addColorStop(0, 'rgba(231,190,110,0.95)');
    gr.addColorStop(1, 'rgba(231,190,110,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 512);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    const hazMat = new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
    const haz = new THREE.Mesh(new THREE.BufferGeometry(), hazMat);
    haz.rotation.x = -Math.PI / 2;
    haz.position.set(x, 0.012, z + 0.35);
    haz.scale.y = -1;
    scene.add(haz);
    return (hueco: number) => {
      izq.position.x = x - ancho / 2 - hueco / 2;
      der.position.x = x + ancho / 2 + hueco / 2;
      const b = clamp(hueco / 0.9);
      luzMat.color.setRGB(2.4 * b, 1.45 * b, 0.42 * b);
      p.intensity = 90 * b;
      brillo.material.opacity = 0.3 * b;
      hazMat.opacity = 0.35 * b;
      if (hueco > 0.001) {
        const w0 = hueco / 2, w1 = hueco / 2 + 1.3 + hueco * 1.4;
        const forma = new THREE.Shape();
        forma.moveTo(-w0, 0); forma.lineTo(w0, 0); forma.lineTo(w1, -12); forma.lineTo(-w1, -12); forma.closePath();
        const geo = new THREE.ShapeGeometry(forma);
        const pos = geo.attributes.position, uv = geo.attributes.uv;
        for (let k = 0; k < pos.count; k++) uv.setXY(k, 0.5, 1 + pos.getY(k) / 12);
        haz.geometry.dispose();
        haz.geometry = geo;
      }
    };
  }

  const tubo = (puntos: THREE.Vector3[], radio = 0.035) => {
    const curva = new THREE.CatmullRomCurve3(puntos, false, 'centripetal', 0.5);
    const geo = new THREE.TubeGeometry(curva, puntos.length * 120, radio, 12);
    const m = malla(geo, mat.hilo);
    return { curva, m, total: geo.index!.count };
  };

  /* =========================== zona 1 · adivinar =========================== */
  const tu = esfera(0.5, mat.oro, 0, 0.5, 0);
  const Z_PUERTA = -9;
  const abrirPuerta1 = puerta(0, Z_PUERTA, 5.6);

  /* Cada vara cae del cielo girando (lluvia en el gancho), se congela en el aire
     cuando el tiempo se para («es hacerlo solo») y encaja en su fila cuando se
     abre la puerta. Algunas alcanzan a tocar el suelo antes de que todo se pare. */
  type Vara = { m: THREE.Mesh; p0: THREE.Vector3; q0: THREE.Quaternion; p1: THREE.Vector3; q1: THREE.Quaternion; retraso: number; aire: THREE.Vector3; eje: THREE.Vector3; giro: number; caida: number };
  const varas: Vara[] = [];
  const geoVara = new RoundedBoxGeometry(0.075, 2.4, 0.075, 2, 0.03).translate(0, 1.2, 0);
  const N_VARAS = 26;
  for (let k = 0; k < N_VARAS; k++) {
    const lado = k % 2 ? 1 : -1, fila = Math.floor(k / 2);
    const p1 = V(lado * 1.25, 0, 2.2 - fila * 0.82);
    const q1 = new THREE.Quaternion();
    let p0: THREE.Vector3;
    do {
      const ang = entre(0, Math.PI * 2), r = entre(1.1, 5.2);
      p0 = V(Math.cos(ang) * r, 0, Math.sin(ang) * r - 2.2);
    } while (p0.length() < 1.1 || p0.z > 1.6);
    const inclina = entre(0.35, 1.25);
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(inclina * Math.cos(k * 2.4), entre(0, Math.PI), inclina * Math.sin(k * 2.4)));
    const m = malla(geoVara, k % 7 === 3 ? mat.hueso : mat.grafito);
    const aire = p0.clone().add(V(entre(-1.2, 1.2), entre(2.8, 6.5), entre(-1, 1)));
    const eje = V(entre(-1, 1), entre(-0.3, 0.3), entre(-1, 1)).normalize();
    varas.push({ m, p0, q0, p1, q1, retraso: fila * 0.05 + entre(0, 0.1), aire, eje, giro: entre(2.2, 5), caida: entre(0.7, 3.4) });
  }

  const hilo1 = tubo([V(0, 0.5, 0), V(0.25, 0.06, -1.2), V(-0.08, 0.05, -3.5), V(0.1, 0.05, -6), V(0, 0.25, -8.4), V(0, 1.9, Z_PUERTA - 0.5)]);

  /* ============================ zona 3 · el porqué ============================ */
  {
    const n = 17 * 12, losas = new THREE.InstancedMesh(new RoundedBoxGeometry(1.92, 0.14, 1.92, 2, 0.03), mat.losa, n);
    const o = new THREE.Object3D();
    let i = 0;
    for (let a = 0; a < 17; a++) for (let b = 0; b < 12; b++) {
      o.position.set(86 + a * 2, entre(-0.05, 0.02), -16 + b * 2);
      o.updateMatrix();
      losas.setMatrixAt(i++, o.matrix);
    }
    losas.receiveShadow = losas.castShadow = true;
    scene.add(losas);
    for (let k = 0; k < 9; k++) {
      const h = entre(1.4, 4.8), a = entre(0.6, 1.2);
      caja(a, h, a, mat.grafito, 90 + k * 3.2 + entre(-1, 1), h / 2, entre(-14, -7));
    }
    for (let k = 0; k < 5; k++) esfera(entre(0.35, 0.6), k % 3 ? mat.grafito : mat.hueso, 93 + k * 3.4, 0.5, entre(3.5, 5));
  }
  const hilo3 = tubo(Array.from({ length: 16 }, (_, k) => V(86 + k * 2.2, 0.95 + Math.sin(k * 0.8) * 0.18, Math.sin(k * 0.5) * 0.4)), 0.03);
  const viajera = esfera(0.3, mat.oro, 0, 0, 0);

  /* entre la zona 3 y la 4: columnas que el barrido convierte en estelas */
  for (let k = 0; k < 14; k++) {
    const h = entre(2, 6);
    caja(entre(0.4, 0.9), h, 0.6, mat.grafito, 108 + k * 1.3 + entre(-0.4, 0.4), h / 2, entre(-7, -2.5));
  }

  /* ========================== zona 4 · las cinco llaves ========================== */
  const PASO = V(1.35, 0, -2.0);
  const DIR = PASO.clone().normalize();
  const OJO_Y = 1.62;
  const ojo = (j: number) => V(130, OJO_Y, 0).addScaledVector(PASO, j);
  const geoLosa = (() => {
    const w = 1.15, h = 3.1, r = 0.27;
    const s = new THREE.Shape();
    s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h); s.lineTo(-w / 2, h); s.closePath();
    const hueco = new THREE.Path();
    hueco.absarc(0, OJO_Y, r, 0, Math.PI * 2, true);
    s.holes.push(hueco);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.42, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025, bevelSegments: 3, curveSegments: 64 });
    g.translate(0, 0, -0.21);
    return g;
  })();
  const losas = Array.from({ length: 5 }, (_, j) => {
    const m = new THREE.MeshPhysicalMaterial({ color: 0x1b1b20, roughness: 0.36, clearcoat: 0.7, clearcoatRoughness: 0.22, emissive: 0x7a5a1a, emissiveIntensity: 0, envMapIntensity: 1 });
    const c = ojo(j);
    const o = malla(geoLosa, m, c.x, 0, c.z);
    o.rotation.y = Math.atan2(DIR.x, DIR.z);
    const p = new THREE.PointLight(0xe7b45a, 0, 9, 2);
    p.position.copy(c).add(V(-0.9, 0.2, 1.2));
    scene.add(p);
    return { m, p };
  });
  const GRAFITO = new THREE.Color(0x1b1b20), ORO_C = new THREE.Color(0xd2a64b);

  const Z4_PUERTA = V(138.2, 0, -15.5);
  const abrirPuerta4 = puerta(Z4_PUERTA.x, Z4_PUERTA.z, 6.4, 1.7);
  const inicio4 = ojo(0).addScaledVector(DIR, -5.5).add(V(0, -0.35, 0));
  const hilo4 = tubo([
    inicio4,
    ojo(0).addScaledVector(DIR, -2.2),
    ...[0, 1, 2, 3, 4].map(ojo),
    ojo(4).addScaledVector(DIR, 1.6).setY(0.9),
    V(137.2, 0.05, -12.2),
    V(Z4_PUERTA.x, 0.05, Z4_PUERTA.z + 1.3),
    V(Z4_PUERTA.x, 2.2, Z4_PUERTA.z - 0.5),
  ]);
  const guia = esfera(0.19, mat.oro, 0, 0, 0);
  const cercano = (c: THREE.Curve<THREE.Vector3>, p: THREE.Vector3) => {
    let mejor = 0, d = Infinity;
    for (let k = 0; k <= 4000; k++) { const u = k / 4000, q = c.getPointAt(u).distanceTo(p); if (q < d) { d = q; mejor = u; } }
    return mejor;
  };
  const uOjo = [0, 1, 2, 3, 4].map((j) => cercano(hilo4.curva, ojo(j)));
  const uSuelo = cercano(hilo4.curva, V(137.2, 0.05, -12.2));
  const uPuerta = cercano(hilo4.curva, V(Z4_PUERTA.x, 0.05, Z4_PUERTA.z + 1.3));
  /* dónde está la esfera guía en cada momento: pasa por cada ojo en su negra */
  const recorrido4 = plano([
    { t: ACTOS.llaves - 0.4, p: [uOjo[0] - 0.14, 0, 0], m: [0, 0, 0] },
    ...[0, 1, 2, 3, 4].map((j): Clave => ({ t: encendido(j), p: [uOjo[j], 0, 0], m: [0, 0, 0] })),
    { t: 18.6, p: [uSuelo, 0, 0], m: [0, 0, 0], quieta: true },
    { t: 23.4, p: [uSuelo, 0, 0], m: [0, 0, 0], quieta: true },
    { t: 27.8, p: [uPuerta, 0, 0], m: [0, 0, 0] },
  ]);

  /* ================================ cámara ================================ */
  const LADO = V(0.83, 0, 0.56);
  const off = (j: number) => ojo(j).addScaledVector(DIR, -4.2).addScaledVector(LADO, 8.6).add(V(0, 0.75, 0));
  const arr = (v: THREE.Vector3): [number, number, number] => [v.x, v.y, v.z];
  const tomaA = plano([
    { t: -0.7, p: [9.5, 6.2, 19], m: [0, 1.4, 0], ap: 0.08, fov: 24 },
    { t: 1.3, p: [4.2, 2.6, 8.9], m: [0, 1.25, 0], foco: 9.8, ap: 0.11, fov: 26, quieta: true },
    { t: 2.5, p: [4.1, 2.4, 8.4], m: [0, 1.15, 0], foco: 9.3, ap: 0.11, fov: 26 },
    { t: 3.75, p: [0.5, 2.0, 8.3], m: [0, 1.1, 0], foco: 8.3, ap: 0.12, fov: 26 },
    { t: 5.0, p: [-2.8, 1.8, 6.6], m: [0, 1.05, -0.6], foco: 7.1, ap: 0.11, fov: 26 },
    { t: 6.1, p: [0.85, 1.3, 3.7], m: [0, 1.7, Z_PUERTA], foco: 12.6, ap: 0.075, fov: 28 },
    { t: 6.9, p: [0.3, 1.5, 0.2], m: [0, 1.8, Z_PUERTA], foco: 9.2, ap: 0.06, fov: 30 },
    { t: 7.5, p: [0.02, 1.85, -7.1], m: [0, 1.95, -10], foco: 2.2, ap: 0.04, fov: 34 },
  ]);
  const tomaB = plano([
    { t: 7.5, p: [95.2, 2.3, 7.9], m: [96.8, 1.0, 0], ap: 0.075, fov: 30 },
    { t: 13.0, p: [101.6, 2.05, 7.3], m: [103.2, 1.0, 0], ap: 0.075, fov: 30 },
    { t: 13.75, p: [119.5, 2.2, 8.4], m: [121.5, 1.3, -1.0], ap: 0.08, fov: 27 },
    ...[0, 1, 2, 3, 4].map((j): Clave => ({ t: encendido(j) + 0.05, p: arr(off(j)), m: arr(ojo(j).addScaledVector(DIR, -1.05).add(V(0, 0.55, 0))), foco: off(j).distanceTo(ojo(j)), ap: 0.16, fov: 24 })),
    { t: 19.2, p: [142.5, 3.6, 13.5], m: [132.8, 1.7, -4.4], ap: 0.12, fov: 28 },
    { t: 23.0, p: [142.0, 8.2, 15.0], m: [134.2, 5.6, -6.5], foco: 24, ap: 0.16, fov: 28 },
    { t: 28.0, p: [139.3, 3.1, 8.0], m: [138.4, 4.6, -15.0], ap: 0.1, fov: 28 },
  ]);
  const toma = (t: number): Toma => {
    const c = t < ACTOS.porque ? tomaA(t) : tomaB(t);
    /* cámara en mano: menos de un centímetro del mundo, suma de senos lentos */
    const n = (f: number, s: number) => Math.sin(t * f + s) * 0.6 + Math.sin(t * f * 2.13 + s * 1.7) * 0.4;
    c.p = [c.p[0] + n(0.9, 1) * 0.012, c.p[1] + n(1.1, 2) * 0.01, c.p[2]];
    c.m = [c.m[0] + n(0.7, 3) * 0.01, c.m[1] + n(0.8, 4) * 0.008, c.m[2]];
    return c;
  };

  /* el tiempo de las varas: corre normal, frena en seco en «solo» y queda casi
     parado (tiempo bala) hasta que se abre la puerta */
  const velocidadVaras = (t: number) => (t < 2.2 ? 1 : t < 2.65 ? mezclar(1, 0.025, suave(tramo(t, 2.2, 2.65))) : 0.025);
  const tiempoVaras = (t: number) => {
    if (t <= 2.2) return t;
    const n = 48, h = (t - 2.2) / n;
    let s = 2.2;
    for (let k = 0; k < n; k++) s += velocidadVaras(2.2 + (k + 0.5) * h) * h;
    return s;
  };
  const qGiro = new THREE.Quaternion();
  const poseCaida = (v: Vara, tau: number, pos: THREE.Vector3, rot: THREE.Quaternion) => {
    const u = clamp(tau / v.caida);
    pos.lerpVectors(v.aire, v.p0, u * u);
    rot.copy(v.q0).multiply(qGiro.setFromAxisAngle(v.eje, v.giro * Math.max(0, v.caida - tau)));
  };
  const pIni = new THREE.Vector3(), qIni = new THREE.Quaternion();

  /* ============================== el tiempo ============================== */
  const q = new THREE.Quaternion(), p = new THREE.Vector3();
  function actualizar(t: number) {
    /* zona 1: las varas se ordenan en dos filas, de cerca a lejos */
    for (const v of varas) {
      const arranque = ACTOS.puerta + 0.05 + v.retraso;
      const u = entraSale(tramo(t, arranque, arranque + 1.1));
      poseCaida(v, tiempoVaras(Math.min(t, arranque)), pIni, qIni);
      p.lerpVectors(pIni, v.p1, u);
      p.y += Math.sin(u * Math.PI) * 0.35;
      q.slerpQuaternions(qIni, v.q1, u);
      v.m.position.copy(p);
      v.m.quaternion.copy(q);
    }
    /* el hilo nace de la esfera y corre hasta la puerta */
    const crece = sale(tramo(t, ACTOS.puerta + 0.1, ACTOS.puerta + 1.6));
    hilo1.m.geometry.setDrawRange(0, Math.floor((hilo1.total / 6) * crece) * 6);
    hilo1.m.visible = crece > 0.001;
    abrirPuerta1(1.05 * entraSale(tramo(t, ACTOS.puerta + 0.4, ACTOS.puerta + 1.9)));
    /* la esfera respira mientras duda y luego sigue el hilo */
    const u1 = entra(tramo(t, ACTOS.puerta + 1.2, 7.6)) * 0.93;
    if (u1 > 0) {
      tu.position.copy(hilo1.curva.getPointAt(u1));
      tu.position.y = Math.max(0.5, tu.position.y);
    } else tu.position.set(0, 0.5 + Math.sin(t * 2.2) * 0.012, 0);
    focoZona1.intensity = 1500 - 500 * Math.sin(Math.PI * tramo(t, ACTOS.solo, ACTOS.puerta));

    /* zona 3: la viajera recorre el hilo */
    viajera.position.copy(hilo3.curva.getPointAt(clamp(0.28 + (t - ACTOS.porque) * 0.028, 0, 1)));

    /* zona 4: la guía enhebra las losas y cada una se enciende al pasar */
    guia.position.copy(hilo4.curva.getPointAt(clamp(recorrido4(t).p[0], 0, 1)));
    if (guia.position.y < 0.19) guia.position.y = 0.19;
    losas.forEach(({ m, p: luz }, j) => {
      const u = sale(tramo(t, encendido(j) - 0.04, encendido(j) + 0.5));
      const golpe = Math.exp(-Math.max(0, t - encendido(j)) * 3.2) * (t >= encendido(j) ? 1 : 0);
      m.color.lerpColors(GRAFITO, ORO_C, u);
      m.metalness = u;
      m.envMapIntensity = mezclar(1, 3.5, u);
      m.roughness = mezclar(0.36, 0.3, u);
      m.clearcoat = mezclar(0.7, 0.1, u);
      m.emissiveIntensity = golpe * 0.9 + u * 0.04;
      luz.intensity = u * 2.2 + golpe * 9;
    });
    abrirPuerta4(1.1 * entraSale(tramo(t, 23.2, 25.4)));
  }

  /* cuánto se abre la exposición: el fogonazo que tapa el corte de la puerta */
  const exposicion = (t: number) => {
    const antes = entra(tramo(t, 7.05, ACTOS.porque)), despues = 1 - sale(tramo(t, ACTOS.porque, 8.05));
    const cierre = sale(tramo(t, 25, 28)) * 0.55;
    /* la luz contiene la respiración antes del fogonazo */
    const aguanta = 1 - 0.4 * Math.sin(Math.PI * tramo(t, 6.7, 7.3));
    return (1.02 + (t < ACTOS.porque ? antes : despues) * 1.9 + empujon(t) * 0.18) * (1 - cierre) * aguanta;
  };

  return { scene, actualizar, toma, exposicion };
}
