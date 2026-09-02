#!/bin/bash
# Prepara las capturas de testimonios para la web.
#
# Uso:  bash web/herramientas/testimonios.sh ~/Desktop/capturas
#
# Toma las imágenes de la carpeta que le pases, las redimensiona, las comprime,
# las renombra a lo que espera index.html y cambia las extensiones en el HTML.
#
# Lo que NO hace: recortar los nombres de terceros ni los saldos. Eso hay que
# hacerlo antes, a mano, en Vista Previa. Ver LEEME.md.

set -e

ORIGEN="${1:?Falta la carpeta de origen. Ej: bash $0 ~/Desktop/capturas}"
DESTINO="$(cd "$(dirname "$0")/.." && pwd)/assets/img/testimonios"

# El orden importa: el primero es el destacado y tiene que ser el del lotaje.
NOMBRES=(lotaje tp-4-minutos historial-01 historial-02)

echo "Origen:  $ORIGEN"
echo "Destino: $DESTINO"
echo

mapfile -t ARCHIVOS < <(find "$ORIGEN" -maxdepth 1 -type f \
  \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.heic' \) | sort)

if [ "${#ARCHIVOS[@]}" -eq 0 ]; then
  echo "No hay imágenes en $ORIGEN"; exit 1
fi

echo "Encontradas ${#ARCHIVOS[@]} imágenes. Se usan las primeras ${#NOMBRES[@]}, en orden alfabético:"
for i in "${!NOMBRES[@]}"; do
  [ -z "${ARCHIVOS[$i]}" ] && continue
  echo "  $(basename "${ARCHIVOS[$i]}")  →  ${NOMBRES[$i]}.jpg"
done
echo
read -r -p "¿Correcto? [s/N] " ok
[ "$ok" = "s" ] || { echo "Cancelado. Renombra los archivos para que el orden alfabético coincida."; exit 1; }
echo

for i in "${!NOMBRES[@]}"; do
  ORIG="${ARCHIVOS[$i]}"
  [ -z "$ORIG" ] && continue
  SALIDA="$DESTINO/${NOMBRES[$i]}.jpg"

  # 900 px de ancho máximo y calidad 80: suficiente para leer una captura de
  # teléfono en pantalla, y una fracción del peso original.
  sips -Z 900 -s format jpeg -s formatOptions 80 "$ORIG" --out "$SALIDA" >/dev/null

  ANTES=$(stat -f%z "$ORIG")
  DESPUES=$(stat -f%z "$SALIDA")
  printf "  %-16s %6.0f KB → %5.0f KB\n" "${NOMBRES[$i]}.jpg" \
    "$(echo "$ANTES/1024" | bc -l)" "$(echo "$DESPUES/1024" | bc -l)"
done

# El HTML apunta a los marcadores .svg hasta que existan los .jpg
HTML="$(cd "$(dirname "$0")/.." && pwd)/index.html"
sed -i '' 's|testimonios/\([a-z0-9-]*\)\.svg|testimonios/\1.jpg|g' "$HTML"
rm -f "$DESTINO"/*.svg

echo
echo "Listo. Peso total de las capturas:"
du -ch "$DESTINO"/*.jpg | tail -1
echo
echo "Si pasa de 400 KB, vuelve a correrlo bajando la calidad a 70."
echo "Después: git add -A && git commit && git push"
