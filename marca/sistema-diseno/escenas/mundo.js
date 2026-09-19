/* mundo.js · la base común de todas las escenas
   ---------------------------------------------------------------------------
   Cámara de teleobjetivo, luz, materiales, fondo, primer plano desenfocado y el
   render por teselas con profundidad de campo por acumulación. Cada escena
   importa esto y solo se ocupa de sus objetos: del concepto. */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
export { THREE };

export function crearMundo({ teselas = 6, semilla = 1, halos = [] } = {}) {
  const W = 1080, H = 1350, D = 120, FOV = 4.5, MIRA_Y = 3.35, APERTURA = 3.4;
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(W, H);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene(); const FONDO = new THREE.Color(0x070708);
  scene.background = FONDO; scene.fog = new THREE.Fog(FONDO, 116, 172);
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.16;

  const camera = new THREE.PerspectiveCamera(FOV, (W * teselas) / H, 40, 320);
  const inc = THREE.MathUtils.degToRad(5.5);
  camera.position.set(0, MIRA_Y + Math.sin(inc) * D, Math.cos(inc) * D); camera.lookAt(0, MIRA_Y, 0); camera.updateMatrixWorld();
  const ANCHO = 2 * D * Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * W / H;
  const cx = (i) => (i - (teselas - 1) / 2) * ANCHO;

  let s = semilla | 0; const azar = () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const entre = (a, b) => a + (b - a) * azar();

  const mat = {
    grafito: new THREE.MeshPhysicalMaterial({ color: 0x1b1b20, roughness: 0.36, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.22, side: THREE.DoubleSide }),
    piedra:  new THREE.MeshStandardMaterial({ color: 0x25252a, roughness: 0.88, side: THREE.DoubleSide }),
    hueso:   new THREE.MeshPhysicalMaterial({ color: 0xe9e2d4, roughness: 0.5, clearcoat: 0.25, clearcoatRoughness: 0.4 }),
    oro:     new THREE.MeshStandardMaterial({ color: 0xD2A64B, metalness: 1, roughness: 0.3 }),
    hilo:    new THREE.MeshStandardMaterial({ color: 0xD2A64B, metalness: 1, roughness: 0.28, emissive: 0x7a5a1a, emissiveIntensity: 0.55 }),
  };

  /* Lo que crea la escena (no el mundo) queda marcado para el ajuste de escala
     final: los objetos se piensan en unidades cómodas y luego se agrandan
     alrededor del centro de su lámina. */
  let marcando = false;
  const malla = (geo, m, x = 0, y = 0, z = 0, padre = scene) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; (padre || scene).add(o); if ((padre || scene) === scene && marcando) o.userData.escalable = true; return o; };
  const grupo = (x, y, z, rotY = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = rotY; scene.add(g); if (marcando) g.userData.escalable = true; return g; };
  const fijar = (o) => { o.userData.escalable = false; return o; };
  const caja = (w, h, d, m, x, y, z, padre, r = 0.05) => malla(new RoundedBoxGeometry(w, h, d, 4, Math.min(r, w / 2.2, h / 2.2, d / 2.2)), m, x, y, z, padre);
  const esfera = (r, m, x, y, z, padre) => malla(new THREE.SphereGeometry(r, 96, 64), m, x, y, z, padre);
  const toro = (R, t, m, x, y, z, padre, arco = Math.PI * 2) => malla(new THREE.TorusGeometry(R, t, 28, 160, arco), m, x, y, z, padre);
  const cil = (rt, rb, h, m, x, y, z, padre, seg = 64) => malla(new THREE.CylinderGeometry(rt, rb, h, seg), m, x, y, z, padre);
  const prisma = (r, largo, m, x, y, z, padre) => { const p = cil(r, r, largo, m, x, y, z, padre, 3); p.rotation.x = -Math.PI / 2; return p; };

  const suelo = new THREE.Mesh(new THREE.PlaneGeometry(600, 400), new THREE.MeshStandardMaterial({ color: 0x0c0c0e, roughness: 0.5 }));
  suelo.rotation.x = -Math.PI / 2; suelo.receiveShadow = true; scene.add(suelo);

  for (let i = 0; i < teselas; i++) {
    const f = new THREE.SpotLight(0xfff4e2, 1500, 60, 0.30, 0.65, 2); f.position.set(cx(i) - 3.2, 16, 7); f.target.position.set(cx(i), 1.2, 0);
    f.castShadow = true; f.shadow.mapSize.set(2048, 2048); f.shadow.bias = -0.0004; f.shadow.radius = 5; scene.add(f, f.target);
  }
  const contra = new THREE.DirectionalLight(0xE7C67F, 1.5); contra.position.set(30, 9, -40); scene.add(contra);
  const relleno = new THREE.DirectionalLight(0x7d93a6, 0.25); relleno.position.set(-30, 12, 30); scene.add(relleno);

  function halo(color, x, y, z, tam, alfa) {
    const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
    const r = g.createRadialGradient(128, 128, 0, 128, 128, 128); r.addColorStop(0, color); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(tam, tam), new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: alfa, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }));
    m.position.set(x, y, z); scene.add(m); return m;
  }
  const ORO = 'rgba(200,140,55,1)', NOCHE = 'rgba(18,70,100,1)';
  halo(ORO, cx(0), 3, -46, 46, 0.18); halo(ORO, cx(teselas - 1), 3.5, -46, 56, 0.24);
  halo(NOCHE, cx(1.6), 7, -60, 70, 0.32); halo(NOCHE, cx(teselas - 2.4), 5, -60, 80, 0.28);
  halos.forEach(h => halo(h[0] === 'oro' ? ORO : NOCHE, ...h.slice(1)));

  /* horizonte lejano y primer plano desenfocado, a caballo de las costuras */
  for (let k = 0; k < teselas * 6; k++) { const h = entre(3, 10.5), a = entre(0.8, 2.2); caja(a, h, a, mat.piedra, entre(cx(0) - 8, cx(teselas - 1) + 8), h / 2, entre(-46, -24), scene, 0.06).rotation.y = entre(0, 0.6); }
  for (let i = 1; i < teselas; i++) { const r = entre(0.55, 1.0); esfera(r, azar() > 0.75 ? mat.hueso : mat.grafito, cx(i) - ANCHO / 2 + entre(-0.9, 0.9), r, entre(15, 22)); }

  /* el hilo de oro: lo que une las láminas */
  let puntosHilo = null; const hilo = (puntos) => { puntosHilo = puntos; };
  const tenderHilo = (puntos, radio = 0.04) => { const c = new THREE.CatmullRomCurve3(puntos.map(p => new THREE.Vector3(...p)), false, 'centripetal', 0.5); const m = new THREE.Mesh(new THREE.TubeGeometry(c, puntos.length * 90, radio, 12), mat.hilo); m.castShadow = true; scene.add(m); return m; };

  /* el cierre común de la serie: cinco losas, y la de esta llave encendida */
  function cierre(i, k) {
    const x0 = cx(i) + 0.15, paso = 1.3;
    for (let j = 0; j < 5; j++) {
      const x = x0 + (j - 2) * paso, mia = j === k;
      fijar(caja(0.95, 2.7, 0.46, mia ? mat.oro : mat.grafito, x, 1.35, 0));
      if (mia) { const p = new THREE.PointLight(0xE7B45A, 150, 16, 2); p.position.set(x, 1.6, 1.8); scene.add(p); halo(ORO, x, 1.8, -3, 10, 0.5); }
    }
    return x0 + (k - 2) * paso;
  }

  const gl = renderer.getContext(); const aLineal = new Float32Array(256); for (let v = 0; v < 256; v++) aLineal[v] = Math.pow(v / 255, 2.2);
  let sombras = false;
  window.nTeselas = teselas;
  window.teselar = async (i, N = 40) => {
    const acc = new Float32Array(W * H * 3), buf = new Uint8Array(W * H * 4), M = new THREE.Matrix4();
    for (let q = 0; q < N; q++) {
      const r = Math.sqrt((q + 0.5) / N) * APERTURA, th = q * 2.399963229728653, dx = Math.cos(th) * r, dy = Math.sin(th) * r;
      camera.setViewOffset(W * teselas, H, W * i + (Math.random() - 0.5), (Math.random() - 0.5), W, H);
      M.set(1, 0, -dx / D, -dx, 0, 1, -dy / D, -dy, 0, 0, 1, 0, 0, 0, 0, 1);
      camera.projectionMatrix.multiply(M); camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
      renderer.render(scene, camera); if (!sombras) { sombras = true; renderer.shadowMap.autoUpdate = false; }
      gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, buf);
      for (let p = 0, o = 0; p < buf.length; p += 4, o += 3) { acc[o] += aLineal[buf[p]]; acc[o + 1] += aLineal[buf[p + 1]]; acc[o + 2] += aLineal[buf[p + 2]]; }
      if (q % 8 === 7) await new Promise(r => setTimeout(r, 0));
    }
    const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'), img = g.createImageData(W, H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const o = ((H - 1 - y) * W + x) * 3, p = (y * W + x) * 4; for (let k = 0; k < 3; k++) img.data[p + k] = Math.round(Math.pow(acc[o + k] / N, 1 / 2.2) * 255 + (Math.random() - 0.5) * 1.6); img.data[p + 3] = 255; }
    g.putImageData(img, 0, 0); return c.toDataURL('image/png');
  };

  marcando = true;
  /* Agranda cada objeto alrededor del centro de su lámina; el hilo sigue el
     mismo mapa, que se desvanece hacia las costuras para no romperse. La última
     lámina (el cierre) no se toca. */
  function listo(escalas = {}, porDefecto = 1.34) {
    const tesela = (x) => Math.max(0, Math.min(teselas - 1, Math.round(x / ANCHO + (teselas - 1) / 2)));
    const e = (i) => i === teselas - 1 ? 1 : (escalas[i] ?? porDefecto);
    scene.children.filter(o => o.userData.escalable).forEach(o => { const i = tesela(o.position.x), k = e(i), c = cx(i); o.position.set(c + (o.position.x - c) * k, o.position.y * k, o.position.z * k); o.scale.multiplyScalar(k); });
    if (puntosHilo) tenderHilo(puntosHilo.map(([x, y, z]) => { const i = tesela(x), k = e(i), c = cx(i), dx = x - c; const g = 1 + (k - 1) * Math.max(0, Math.min(1, (ANCHO / 2 - Math.abs(dx)) / (ANCHO / 2 - 1.5))); const gy = 1 + (k - 1) * Math.max(0, Math.min(1, (ANCHO / 2 - Math.abs(dx)) / 1.2)); return [c + dx * g, y * gy, z * gy]; }));
    window.lista = true;
  }
  return { THREE, scene, cx, ANCHO, mat, azar, entre, malla, grupo, fijar, caja, esfera, toro, cil, prisma, hilo, halo, cierre, listo };
}
