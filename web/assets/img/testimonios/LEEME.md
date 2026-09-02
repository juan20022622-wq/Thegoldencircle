# Capturas de testimonios

Tres archivos, **los tres a 600x800 (3:4) exactos**. Van en un mazo deslizable
y una proporción distinta rompe la fila.

| Archivo | Cuál |
|---|---|
| `lotaje.jpg` | La del error de lotaje. **Es la más importante de todas.** |
| `historial-01.jpg` | Historial del 25 de agosto |
| `historial-02.jpg` | Historial del 21 de agosto |

## Antes de subirlas

**Recortar los nombres de terceros.** Varias capturas llevan nombres visibles de
otras personas del canal. Eso es dato personal ajeno: o se recorta, o se tiene su
permiso por escrito.

**Recortar los saldos y depósitos de cuenta.** Un balance es información
financiera personal de quien la compartió. `historial-02` traía un depósito de
323,83 a la vista y por eso su recorte corta antes de la fila de resumen.

**Recortar caras y avatares.** Las capturas de WhatsApp traen la foto de perfil
de quien reaccionó al mensaje.

**Comprimir.** JPG de calidad 82, 600 px de ancho. Las tres juntas pesan 284 KB;
sin optimizar se comen el presupuesto de 2 s en 4G.

## Cómo se recortaron

`sips` recorta **centrado** por defecto: sin `--cropOffset` se lleva justo lo
que quieres conservar. El orden es `--cropOffset <y> <x>`.

```bash
# ventana de recorte en 3:4 sobre el original, y después a 600x800
sips -c 1140 856 --cropOffset 370 95 origen.jpeg --out paso.jpg
sips -z 800 600 paso.jpg --out lotaje.jpg
sips -s format jpeg -s formatOptions 82 lotaje.jpg --out lotaje.jpg
```

## Si falta alguna

El mazo funciona con las que haya, pero la tarjeta que sobre aparecerá rota:
quitarla del HTML.
