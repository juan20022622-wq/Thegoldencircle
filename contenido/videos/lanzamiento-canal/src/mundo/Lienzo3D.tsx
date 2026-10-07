/* El lienzo 3D
   ---------------------------------------------------------------------------
   Cada fotograma del video es la media de N subfotogramas. En cada uno:
     · la cámara se desplaza sobre el disco de la apertura y apunta al plano de
       foco → profundidad de campo óptica, con bokeh de verdad;
     · el tiempo avanza dentro del obturador de 180° → desenfoque de movimiento
       de la cámara y de los objetos, sin posproceso.
   Se acumula en coma flotante, se le pone un resplandor contenido y se pasa a
   la pantalla con el mapeo de tono ACES. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { continueRender, delayRender, useCurrentFrame, useVideoConfig } from 'remotion';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { TexturePass } from 'three/examples/jsm/postprocessing/TexturePass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { crearMundo } from './escena';
import { RayaAnamorfica, aberracion } from './lente';

type Motor = {
  renderer: THREE.WebGLRenderer;
  mundo: ReturnType<typeof crearMundo>;
  camera: THREE.PerspectiveCamera;
  escenaRT: THREE.WebGLRenderTarget;
  acumulado: THREE.WebGLRenderTarget;
  suma: { scene: THREE.Scene; cam: THREE.OrthographicCamera; mat: THREE.ShaderMaterial };
  composer: EffectComposer;
};

function crearMotor(canvas: HTMLCanvasElement, W: number, H: number): Motor {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;

  const mundo = crearMundo(renderer);
  const camera = new THREE.PerspectiveCamera(30, W / H, 0.1, 400);
  const escenaRT = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
  const acumulado = new THREE.WebGLRenderTarget(W, H, { type: THREE.FloatType });

  const mat = new THREE.ShaderMaterial({
    uniforms: { mapa: { value: escenaRT.texture }, peso: { value: 1 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: 'uniform sampler2D mapa; uniform float peso; varying vec2 vUv; void main(){ gl_FragColor = vec4(texture2D(mapa, vUv).rgb * peso, 1.0); }',
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false,
  });
  const suma = { scene: new THREE.Scene(), cam: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), mat };
  suma.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));

  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType }));
  composer.addPass(new TexturePass(acumulado.texture));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), 0.42, 0.75, 0.92));
  composer.addPass(new RayaAnamorfica(W, H, 0.32, 3.2));
  composer.addPass(new OutputPass());
  composer.addPass(new ShaderPass(aberracion));
  return { renderer, mundo, camera, escenaRT, acumulado, suma, composer };
}

const ANGULO_DORADO = 2.399963229728653;

function pintar(m: Motor, t: number, fps: number, N: number) {
  const { renderer, mundo, camera, escenaRT, acumulado, suma } = m;
  const obturador = 0.5 / fps;
  renderer.setRenderTarget(acumulado);
  renderer.setClearColor(0x000000, 1);
  renderer.clear();
  suma.mat.uniforms.peso.value = 1 / N;
  const dir = new THREE.Vector3(), der = new THREE.Vector3(), arriba = new THREE.Vector3(), foco = new THREE.Vector3();
  for (let q = 0; q < N; q++) {
    /* el orden de las muestras de tiempo se baraja respecto al de la apertura */
    const ts = t + (((q * 7) % N) / N - 0.5 + 0.5 / N) * obturador;
    mundo.actualizar(ts);
    const c = mundo.toma(ts);
    camera.fov = c.fov;
    camera.position.set(...c.p);
    camera.up.set(0, 1, 0);
    camera.lookAt(...c.m);
    camera.updateMatrixWorld();
    dir.set(...c.m).sub(camera.position).normalize();
    foco.copy(camera.position).addScaledVector(dir, c.foco);
    der.setFromMatrixColumn(camera.matrixWorld, 0);
    arriba.setFromMatrixColumn(camera.matrixWorld, 1);
    const r = Math.sqrt((q + 0.5) / N) * c.ap, th = q * ANGULO_DORADO;
    camera.position.addScaledVector(der, Math.cos(th) * r).addScaledVector(arriba, Math.sin(th) * r);
    camera.lookAt(foco);
    /* medio píxel de temblor: antialias gratis */
    camera.setViewOffset(escenaRT.width, escenaRT.height, Math.sin(q * 12.9898) * 0.5, Math.cos(q * 78.233) * 0.5, escenaRT.width, escenaRT.height);
    camera.updateProjectionMatrix();
    if (q === 0) renderer.shadowMap.needsUpdate = true;
    renderer.setRenderTarget(escenaRT);
    renderer.render(mundo.scene, camera);
    renderer.setRenderTarget(acumulado);
    renderer.autoClear = false;
    renderer.render(suma.scene, suma.cam);
    renderer.autoClear = true;
  }
  renderer.toneMappingExposure = mundo.exposicion(t);
  renderer.setRenderTarget(null);
  m.composer.render();
}

export const Lienzo3D: React.FC<{ muestras: number; escala: number }> = ({ muestras, escala }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const ref = useRef<HTMLCanvasElement>(null);
  const [motor, setMotor] = useState<Motor | null>(null);
  const [espera] = useState(() => delayRender('Montando el mundo 3D'));

  useEffect(() => {
    if (!ref.current) return;
    const m = crearMotor(ref.current, Math.round(width * escala), Math.round(height * escala));
    setMotor(m);
    continueRender(espera);
    return () => m.renderer.dispose();
  }, [width, height, escala, espera]);

  useLayoutEffect(() => {
    if (!motor) return;
    const h = delayRender('Fotograma ' + frame);
    pintar(motor, frame / fps, fps, muestras);
    motor.renderer.getContext().finish();
    continueRender(h);
  }, [motor, frame, fps, muestras]);

  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width, height }} />;
};
