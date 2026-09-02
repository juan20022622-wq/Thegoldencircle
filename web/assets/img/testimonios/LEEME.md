# Capturas de testimonios

## Qué hay

| Archivo | Cuál |
|---|---|
| `lotaje.jpg` | La del error de lotaje. **Es la que sostiene la sección.** |
| `historial-01.jpg` | Historial del 25 de agosto |
| `historial-02.jpg` | Historial del 21 de agosto |

Originales en `~/Downloads/WhatsApp Image 2026-09-01 at 02.53.*`.

## Qué se les hizo

**Recortado el pie de cada una.** Las tres llevaban abajo la foto de perfil de
quien las compartió, y en un caso la de otra persona más. Eso es dato personal
ajeno: se eliminó del archivo, no se tapó con CSS. La captura publicada no
contiene esos píxeles.

**Descartada la de "GRACIAS LEE".** Lleva el nombre "Anthoinne Kock" dos veces y
fotos de perfil de dos personas. Para usarla haría falta su permiso por escrito.

**Comprimidas** a 900 px de ancho y calidad 82. Las tres suman 348 KB.

## Si se cambian

```bash
sips -c <alto> <ancho> --cropOffset 0 0 origen.jpeg --out _r.jpg
sips -Z 900 -s format jpeg -s formatOptions 82 _r.jpg --out destino.jpg
```

`--cropOffset 0 0` recorta desde arriba; sin él, `sips` recorta centrado y deja
el pie dentro. Después hay que actualizar `width` y `height` en `index.html` y
subir el `?v=` de los assets.

Y siempre: **abrir el resultado y mirarlo** antes de publicar. Los dos primeros
recortes que hice dejaban todavía media cara asomando.
