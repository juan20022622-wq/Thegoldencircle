# Video · lanzamiento del canal

Motion graphics de 28 s con locución, 1080 × 1920 a 60 fps, para Reels, historias y pauta.
El porqué de cada decisión está en `BRIEF.md`.

## Cómo está hecho

- **Remotion** monta la línea de tiempo; todo se mide en segundos sobre la
  grilla de `src/tiempo.ts` (96 BPM, un compás = 2,5 s).
- **three.js** dibuja el mismo mundo de las piezas de Instagram
  (`src/mundo/escena.ts`). Cada fotograma promedia N subfotogramas moviendo la
  cámara sobre la apertura y dentro del obturador: profundidad de campo y
  desenfoque de movimiento ópticos (`src/mundo/Lienzo3D.tsx`).
- **Tipografía** en HTML encima (`src/texto/`): Manrope e IBM Plex Mono.
- **Locución** guía con voz neuronal local, Kokoro «em_alex» (`herramientas/voz.mjs` →
  `public/voz/`). Para publicar, sustituir por la voz de Christian con los
  mismos nombres de archivo.
- **Banda sonora** sintetizada desde cero, sin muestras de terceros, con la
  voz mezclada encima (`herramientas/banda-sonora.mjs` → `public/banda-sonora.wav`).

## Comandos

```bash
npm install
# la voz necesita el modelo Kokoro (350 MB, fuera de git):
#   curl -L https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/kokoro-multi-lang-v1_0.tar.bz2 | tar xj -C herramientas/modelos
node herramientas/voz.mjs                   # regenera la locución
node herramientas/banda-sonora.mjs          # regenera el audio (con la voz)
npx remotion studio src/index.ts            # previsualizar
herramientas/fotos.sh prueba 6 0.5 90 450   # fotogramas sueltos a salida/fotos
npx remotion render src/index.ts Lanzamiento salida/lanzamiento-canal.mp4 \
  --gl=angle --concurrency=1 --crf=16 --props='{"muestras":24,"escala":1,"fps":60}'
```

Borrador rápido: `--props='{"muestras":4,"escala":0.5}'` (30 fps, ~1 min).
`salida/` y `node_modules/` no se versionan.

## Cumplimiento

El texto en pantalla pasó por `revision-copy-trading`: sin promesas ni cifras,
sin nombrar el broker ni el instrumento (el oro en Exness es un CFD y Meta no
deja anunciarlo), Christian como alguien que opera su cuenta y la enseña, y
descargo fijo de principio a fin, completo en el cierre.
