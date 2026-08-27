#!/usr/bin/env bash
# Copia los documentos vigentes a project-claude/knowledge/ para subirlos
# como knowledge al Project de claude.ai. Sobrescribe, no borra.
set -euo pipefail
cd "$(dirname "$0")/.."
dest="project-claude/knowledge"
mkdir -p "$dest"
cp -f CLAUDE.md                              "$dest/00-reglas-del-proyecto.md"
cp -f docs/propuesta-resumen.md              "$dest/01-propuesta.md"
cp -f docs/contexto-cliente.md               "$dest/02-contexto-cliente.md"
cp -f estrategia/00-marco-estrategico.md     "$dest/03-marco-estrategico.md"
cp -f estrategia/01-brief-descubrimiento.md  "$dest/04-brief-descubrimiento.md"
cp -f marca/identidad.md                     "$dest/05-identidad-de-marca.md"
echo "Listo. Sube estos archivos al Project:"
ls -1 "$dest" | grep -v '^\.gitkeep$' | sed 's/^/  · /'
