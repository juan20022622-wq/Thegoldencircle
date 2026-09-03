# Capturas de testimonios

Diez archivos WebP, **todos a 600x800 (3:4) exactos**. Van en un mazo
deslizable y una proporción distinta rompe la fila.

**Las capturas van con su marco, no recortadas al panel.** Fondo de Telegram a
los lados, esquinas redondeadas, la hora superpuesta, la barra de estado del
móvil. Recortadas al panel limpio parecían capturas de cualquiera —de hecho eso
fue lo primero que se hizo, y era el problema: sin el marco no hay nada que diga
que salieron del canal. Lo que se recorta son los nombres, las caras y los
saldos, no el contexto.

| Archivo | Qué muestra |
|---|---|
| `lotaje.webp` | El error de lotaje, con su mensaje. **La más importante de todas.** |
| `flotante.webp` | Seis compras abiertas, cinco en rojo, con su mensaje |
| `tp-4-minutos.webp` | Dos entradas cerradas en el objetivo, con su mensaje |
| `perdedora.webp` | Historial con una operación cerrada en -0.04 |
| `zonas.webp` | Ocho ventas escalonadas sobre niveles marcados |
| `historial-01.webp` | Compras del 25 de agosto |
| `historial-02.webp` | Ventas y compras del 21 de agosto |
| `ventas.webp` | Ventas de 0,01 del 17 de junio |
| `salidas.webp` | Cierres parciales de una posición |
| `posiciones.webp` | Nueve compras de 0,03 al mismo cierre |

**Primero las que llevan el mensaje de la persona.** Una captura suelta puede
ser de cualquiera; un mensaje escrito al mandarla, no. Y las dos primeras de esas
tres son además las que no salieron bien —el error de gestión y la posición en
rojo— así que el orden sirve a las dos cosas: diez pantallas seguidas de ganancia
son la página de "mira cuánto ganamos" que el cliente pidió no hacer, y lo que
`revision-copy-trading` marca como bloqueante.

## Las dos que quedaron fuera

De las doce que mandó Cristian, diez están dentro. Las otras dos:

- **La del gráfico ascendente.** `web/CLAUDE.md`: ningún gráfico de esta página
  puede subir, tampoco uno real. Una línea que sube en una landing de trading es
  una promesa de rentabilidad dibujada.
- **La conversación de "GRACIAS LEE".** Aquí no es el recorte, es el contenido:
  un círculo rojo trazado a mano sobre una ganancia, "rompiendo desde Aruba", un
  emoji de billetes —prohibido por `marca/identidad.md`— y el nombre de un
  tercero encima de dos de los mensajes. Es el registro de estilo de vida que
  Meta penaliza en categoría financiera, y no aporta nada sobre el método. Las
  otras tres con mensaje sí: un error de gestión, una posición en rojo y un
  cierre en el objetivo.

## Antes de subir una nueva

**Recortar los nombres y las caras de terceros**, incluidos los avatares de
quien reaccionó al mensaje. Es dato personal ajeno: o se recorta, o se tiene su
permiso por escrito.

**Recortar los saldos, depósitos y retiros.** Un balance es información
financiera personal de quien la compartió. `historial-02` traía un depósito de
323,83 y `salidas` un retiro de -115,00; los dos recortes cortan antes de la
fila de resumen.

## Cómo se generan

Con `herramientas/testimonios.mjs`, que lleva dentro la tabla de recortes: por
cada captura, el rectángulo medido **sobre una vista previa de 500 px de lado
mayor**. El script escala, cuadra a 3:4, extrae y saca el WebP.

```bash
# 1. vista previa para medir
sips -Z 500 "origen.jpeg" --out vista.jpg

# 2. anotar [x0, y0, x1, y1] en la tabla del script, y generar
npx -y -p sharp node web/herramientas/testimonios.mjs
```

**No usar `sips -c` para esto.** `sips` recorta centrado y su `--cropOffset` se
mide desde el centro, no desde la esquina; calcularlo a mano dio encuadres
torcidos varias veces. `sharp` usa esquina + tamaño y no hay ambigüedad. Además
va de JPEG a WebP en un paso, sin recompresión intermedia.

## Si falta alguna

El mazo funciona con las que haya, pero la tarjeta que sobre aparecerá rota:
quitarla del HTML.
