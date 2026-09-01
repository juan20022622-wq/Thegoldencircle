# Capturas de testimonios

Poner aquí los archivos con estos nombres exactos:

| Archivo | Cuál |
|---|---|
| `lotaje.jpg` | La del error de lotaje. **Es la más importante de todas.** |
| `tp-4-minutos.jpg` | "Se fue a TP en cuestión de 4 mins" |
| `historial-01.jpg` | Un historial |
| `historial-02.jpg` | Otro historial |

## Antes de subirlas

**Recortar los nombres de terceros.** Varias capturas llevan nombres visibles de
otras personas del canal. Eso es dato personal ajeno: o se recorta, o se tiene su
permiso por escrito. No es lo mismo que la decisión de mostrar resultados, que es
del club; esto es de otra gente.

**Recortar también los saldos de cuenta** si aparecen. Un balance es información
financiera personal de quien la compartió.

**Comprimir.** Son capturas de teléfono y pesan mucho. Exportar a JPG de calidad
80 con un ancho máximo de 900 px, o mejor a WebP. La página entera pesa hoy 31 KB
comprimida; cuatro capturas sin optimizar pueden multiplicar eso por veinte y
tirarse el presupuesto de 2 s en 4G.

Con `sips`, que ya viene en el Mac:

```bash
sips -Z 900 -s format jpeg -s formatOptions 80 entrada.png --out lotaje.jpg
```

## Ahora mismo

Hay marcadores `.svg` que dicen "captura pendiente", para que el sitio en vivo
no muestre imágenes rotas. Cuando dejes los `.jpg` reales aquí, hay que cambiar
la extensión en `index.html`:

```bash
sed -i "" "s|testimonios/\([a-z0-9-]*\)\.svg|testimonios/\1.jpg|g" web/index.html
```

Y borrar los `.svg`.

## Si falta alguna

Mejor quitar del HTML la tarjeta que sobre que dejar un marcador publicado.
