# Capturas de testimonios

Nueve archivos WebP, **todos a 600x750 (4:5) exactos**. Van en un mazo
deslizable y una proporción distinta rompe la fila.

| Archivo | Qué muestra |
|---|---|
| `lotaje.webp` | El error de lotaje. **Es la más importante de todas.** |
| `flotante.webp` | Seis compras abiertas, cinco en rojo |
| `perdedora.webp` | Historial con una operación cerrada en -0.04 |
| `zonas.webp` | Ocho ventas escalonadas sobre niveles marcados |
| `historial-01.webp` | Compras del 25 de agosto |
| `historial-02.webp` | Ventas y compras del 21 de agosto |
| `ventas.webp` | Ventas de 0,01 del 17 de junio |
| `salidas.webp` | Cierres parciales de una posición |
| `posiciones.webp` | Nueve compras de 0,03 al mismo cierre |

**El orden del mazo importa y no es el que llegaron.** Las tres primeras son las
que no salieron bien: el error de gestión, la posición en rojo y el cierre en
negativo. Un mazo que abre con nueve pantallas de ganancia es exactamente la
página de "mira cuánto ganamos" que el cliente pidió no hacer, y es lo que la
skill `revision-copy-trading` marca como bloqueante.

## Las tres que quedaron fuera

De las doce que mandó Cristian se descartaron tres, y por motivos distintos:

- **La del gráfico ascendente.** `web/CLAUDE.md`: ningún gráfico de esta página
  puede subir, tampoco uno real. Una línea que sube en una landing de trading es
  una promesa de rentabilidad dibujada.
- **La de la conversación de Telegram.** Nombres reales y fotos de perfil de
  otras personas del canal en toda la captura. No hay recorte que la salve.
- **La del "se fue a TP en 4 mins".** El panel deja un hueco negro enorme entre
  las operaciones y el mensaje, y abajo aparece un avatar con cara. Su frase ya
  vive como texto en la página.

## Antes de subir una nueva

**Recortar los nombres y las caras de terceros**, incluidos los avatares de
quien reaccionó al mensaje. Es dato personal ajeno: o se recorta, o se tiene su
permiso por escrito.

**Recortar los saldos, depósitos y retiros.** Un balance es información
financiera personal de quien la compartió. `historial-02` traía un depósito de
323,83 y `salidas` un retiro de -115,00; los dos recortes cortan antes de la
fila de resumen.

## Cómo se generan

`sips` recorta **centrado** por defecto: sin `--cropOffset` se lleva justo lo que
quieres conservar. El orden es `--cropOffset <y> <x>`.

Y no hay que pasar por JPEG: son capturas de texto plano, que comprimen fatal en
JPEG y muy bien en WebP. Las nueve en JPEG pesaban 744 KB; en WebP, 348 KB.

```bash
# 1. recortar en 4:5 y bajar a 600x750, sin pérdida
sips -c 1070 856 --cropOffset 440 95 origen.jpeg --out paso.png -s format png
sips -z 750 600 paso.png --out lotaje.png

# 2. a WebP (sharp no está instalado; npx lo trae y no deja nada)
npx -y sharp-cli@5 -i "lotaje.png" -o . -f webp -q 78
```

## Si falta alguna

El mazo funciona con las que haya, pero la tarjeta que sobre aparecerá rota:
quitarla del HTML.
