// node herramientas/hoja.mjs salida.jpg a.png b.png ... · fotogramas en fila para revisarlos
import sharp from 'sharp';
const [out, ...fs] = process.argv.slice(2);
const H = 800, imgs = await Promise.all(fs.map(f => sharp(f).resize({ height: H }).toBuffer({ resolveWithObject: true })));
const W = imgs.reduce((s, i) => s + i.info.width + 8, 0);
let x = 0; const comp = imgs.map(i => { const c = { input: i.data, left: x, top: 0 }; x += i.info.width + 8; return c; });
await sharp({ create: { width: W, height: H, channels: 3, background: '#333' } }).composite(comp).jpeg({ quality: 88 }).toFile(out);
