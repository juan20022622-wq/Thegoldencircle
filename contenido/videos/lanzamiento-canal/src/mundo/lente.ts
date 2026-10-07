/* La lente: lo que hace que la imagen parezca rodada y no renderizada.
   · Raya anamórfica: las luces fuertes se estiran en horizontal, como en un
     objetivo anamórfico de cine. Paso de brillo a un cuarto de resolución y
     cinco pasadas de desenfoque horizontal con saltos que se duplican.
   · Aberración cromática: el rojo y el azul se separan un poco hacia los bordes. */
import * as THREE from 'three';
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';

const VERT = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';

export class RayaAnamorfica extends Pass {
  private a: THREE.WebGLRenderTarget;
  private b: THREE.WebGLRenderTarget;
  private brillo: FullScreenQuad;
  private desenfoque: FullScreenQuad;
  private suma: FullScreenQuad;
  constructor(W: number, H: number, fuerza = 0.5, umbral = 1.6) {
    super();
    const op = { type: THREE.HalfFloatType };
    this.a = new THREE.WebGLRenderTarget(Math.round(W / 4), Math.round(H / 4), op);
    this.b = this.a.clone();
    this.brillo = new FullScreenQuad(new THREE.ShaderMaterial({
      uniforms: { mapa: { value: null }, umbral: { value: umbral } },
      vertexShader: VERT,
      fragmentShader: 'uniform sampler2D mapa; uniform float umbral; varying vec2 vUv; void main(){ vec3 c = texture2D(mapa, vUv).rgb; float l = max(c.r, max(c.g, c.b)); gl_FragColor = vec4(c * max(l - umbral, 0.0) / max(l, 1e-4), 1.0); }',
    }));
    this.desenfoque = new FullScreenQuad(new THREE.ShaderMaterial({
      uniforms: { mapa: { value: null }, paso: { value: 1 / W } },
      vertexShader: VERT,
      fragmentShader: `uniform sampler2D mapa; uniform float paso; varying vec2 vUv;
        void main(){ vec3 s = vec3(0.0); float w = 0.0;
          for (int i = -4; i <= 4; i++) { float k = exp(-float(i*i) / 8.0); s += texture2D(mapa, vUv + vec2(float(i) * paso, 0.0)).rgb * k; w += k; }
          gl_FragColor = vec4(s / w, 1.0); }`,
    }));
    this.suma = new FullScreenQuad(new THREE.ShaderMaterial({
      uniforms: { base: { value: null }, raya: { value: null }, fuerza: { value: fuerza }, tinte: { value: new THREE.Color(1.0, 0.78, 0.48) } },
      vertexShader: VERT,
      fragmentShader: 'uniform sampler2D base; uniform sampler2D raya; uniform float fuerza; uniform vec3 tinte; varying vec2 vUv; void main(){ gl_FragColor = vec4(texture2D(base, vUv).rgb + texture2D(raya, vUv).rgb * tinte * fuerza, 1.0); }',
    }));
  }
  render(renderer: THREE.WebGLRenderer, writeBuffer: THREE.WebGLRenderTarget, readBuffer: THREE.WebGLRenderTarget) {
    const mb = this.brillo.material as THREE.ShaderMaterial, md = this.desenfoque.material as THREE.ShaderMaterial, ms = this.suma.material as THREE.ShaderMaterial;
    mb.uniforms.mapa.value = readBuffer.texture;
    renderer.setRenderTarget(this.a);
    this.brillo.render(renderer);
    let de = this.a, a = this.b;
    for (let k = 0; k < 6; k++) {
      md.uniforms.mapa.value = de.texture;
      md.uniforms.paso.value = Math.pow(2, k) / this.a.width;
      renderer.setRenderTarget(a);
      this.desenfoque.render(renderer);
      [de, a] = [a, de];
    }
    ms.uniforms.base.value = readBuffer.texture;
    ms.uniforms.raya.value = de.texture;
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    this.suma.render(renderer);
  }
}

export const aberracion = {
  uniforms: { tDiffuse: { value: null }, fuerza: { value: 0.0022 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float fuerza; varying vec2 vUv;
    void main(){ vec2 d = vUv - 0.5; float r2 = dot(d, d);
      vec2 o = d * r2 * fuerza * 8.0;
      gl_FragColor = vec4(texture2D(tDiffuse, vUv + o).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - o).b, 1.0); }`,
};
