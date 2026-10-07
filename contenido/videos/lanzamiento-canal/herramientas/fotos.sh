#!/bin/sh
# herramientas/fotos.sh <prefijo> <muestras> <escala> f1 f2 ... : fotogramas sueltos a salida/fotos
p=$1; n=$2; e=$3; shift 3
npx remotion bundle src/index.ts --out-dir=.remotion/bundle >/dev/null 2>&1
for f in "$@"; do npx remotion still .remotion/bundle Lanzamiento salida/fotos/$p$f.png --frame=$f --gl=angle --props="{\"muestras\":$n,\"escala\":$e}" --log=error; done
