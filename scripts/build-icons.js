/**
 * Génère les déclinaisons d'icônes à partir de l'illustration source.
 *
 *   node scripts/build-icons.js <chemin-de-l-image>
 *
 * L'image source est une illustration carrée à coins arrondis, posée sur un
 * fond clair. Le script en extrait le carré, rebouche les coins avec le
 * dégradé, puis produit :
 *   - icon.png                    icône iOS / stores, opaque, sans coins arrondis
 *   - logo.png                    icône affichée dans l'app, coins transparents
 *   - favicon.png                 onglet du navigateur
 *   - splash-icon.png             écran de démarrage
 *   - android-icon-background.png dégradé plein cadre
 *   - android-icon-foreground.png illustration détourée, dans la zone sûre
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC = process.argv[2] ?? path.join(__dirname, '..', 'assets', 'source-icon.png');
const OUT = path.join(__dirname, '..', 'assets');

/** Le carré coloré, isolé du fond clair et de son ombre portée. */
async function findSquare(buffer, info) {
  const { width: W, height: H, channels: C } = info;
  const px = (x, y) => {
    const i = (y * W + x) * C;
    return [buffer[i], buffer[i + 1], buffer[i + 2]];
  };
  // L'ombre portée est grise ; seul le carré est franchement coloré.
  const colorful = (x, y) => {
    const p = px(x, y);
    return Math.max(...p) - Math.min(...p) > 28;
  };

  let x0 = W;
  let y0 = H;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      if (!colorful(x, y)) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  const size = Math.min(x1 - x0 + 1, y1 - y0 + 1);
  return { left: x0, top: y0, size };
}

/**
 * Le fond de l'illustration est un dégradé linéaire en diagonale. On l'ajuste
 * sur deux points échantillonnés à l'intérieur du carré, ce qui permet ensuite
 * aussi bien de reboucher les coins que de détourer l'illustration.
 */
function fitGradient(buffer, size) {
  const at = (x, y) => {
    const i = (y * size + x) * 3;
    return [buffer[i], buffer[i + 1], buffer[i + 2]];
  };
  const pa = Math.round(size * 0.08);
  const pb = Math.round(size * 0.92);
  const a = at(pa, pa);
  const b = at(pb, pb);
  const ta = (pa / size + pa / size) / 2;
  const tb = (pb / size + pb / size) / 2;

  // Extrapolation aux extrémités t = 0 et t = 1.
  const start = a.map((v, i) => v + ((a[i] - b[i]) * ta) / (tb - ta));
  const end = a.map((v, i) => v + ((b[i] - a[i]) * (1 - ta)) / (tb - ta));

  return (x, y) => {
    const t = Math.min(1, Math.max(0, (x / size + y / size) / 2));
    return [0, 1, 2].map((i) => Math.round(start[i] + (end[i] - start[i]) * t));
  };
}

async function main() {
  if (!fs.existsSync(SRC)) throw new Error(`image source introuvable : ${SRC}`);

  const source = sharp(SRC).removeAlpha();
  const { data: full, info } = await source.raw().toBuffer({ resolveWithObject: true });
  const found = await findSquare(full, info);
  console.log(`carré détecté : ${found.size}×${found.size} à (${found.left}, ${found.top})`);

  // Le bord du carré est anticrénelé contre le fond clair. On rogne ce liseré,
  // sinon un halo blanchâtre subsiste tout autour de l'icône.
  const inset = Math.round(found.size * 0.025);
  const left = found.left + inset;
  const top = found.top + inset;
  const size = found.size - inset * 2;

  const square = await sharp(SRC)
    .removeAlpha()
    .extract({ left, top, width: size, height: size })
    .raw()
    .toBuffer();

  const gradient = fitGradient(square, size);
  const corner = Math.round(size * 0.3);

  // Version opaque : les coins arrondis sont remplis par le dégradé, sinon ils
  // laisseraient des angles clairs sous le masque arrondi d'iOS.
  const opaque = Buffer.from(square);
  // Version transparente : les mêmes coins deviennent invisibles.
  const rounded = Buffer.alloc(size * size * 4);
  // Illustration seule : tout ce qui ressemble au dégradé disparaît.
  const artwork = Buffer.alloc(size * size * 4);

  const inCorner = (x, y) =>
    (x < corner || x >= size - corner) && (y < corner || y >= size - corner);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i3 = (y * size + x) * 3;
      const i4 = (y * size + x) * 4;
      const r = square[i3];
      const g = square[i3 + 1];
      const b = square[i3 + 2];
      const pale = r > 205 && g > 215 && b > 220;
      const outside = pale && inCorner(x, y);

      const [gr, gg, gb] = gradient(x, y);
      if (outside) {
        opaque[i3] = gr;
        opaque[i3 + 1] = gg;
        opaque[i3 + 2] = gb;
      }

      rounded[i4] = opaque[i3];
      rounded[i4 + 1] = opaque[i3 + 1];
      rounded[i4 + 2] = opaque[i3 + 2];
      rounded[i4 + 3] = outside ? 0 : 255;

      // L'illustration n'atteint jamais le bord : tout ce qui s'y trouve est du
      // fond, y compris le reste d'anticrénelage des coins arrondis.
      const margin = Math.round(size * 0.03);
      const nearEdge =
        x < margin || x >= size - margin || y < margin || y >= size - margin;
      const distance = Math.abs(r - gr) + Math.abs(g - gg) + Math.abs(b - gb);
      const isBackground = outside || nearEdge || distance < 46;
      artwork[i4] = r;
      artwork[i4 + 1] = g;
      artwork[i4 + 2] = b;
      artwork[i4 + 3] = isBackground ? 0 : 255;
    }
  }

  const raw = (buf, channels) => ({ raw: { width: size, height: size, channels } });
  const write = (name) => path.join(OUT, name);

  // iOS et stores : opaque, plein cadre, sans coins arrondis.
  await sharp(opaque, raw(opaque, 3))
    .resize(1024, 1024)
    .png()
    .toFile(write('icon.png'));

  // Usage dans l'app : coins transparents pour se poser sur n'importe quel fond.
  await sharp(rounded, raw(rounded, 4))
    .resize(512, 512)
    .png()
    .toFile(write('logo.png'));

  await sharp(rounded, raw(rounded, 4)).resize(196, 196).png().toFile(write('favicon.png'));

  await sharp(rounded, raw(rounded, 4)).resize(512, 512).png().toFile(write('splash-icon.png'));

  // Android : le dégradé occupe tout le cadre, l'illustration reste dans la
  // zone sûre (les deux tiers centraux), quel que soit le masque du lanceur.
  const canvas = 1024;
  const gradientPixels = Buffer.alloc(canvas * canvas * 3);
  for (let y = 0; y < canvas; y += 1) {
    for (let x = 0; x < canvas; x += 1) {
      const [r, g, b] = gradient((x / canvas) * size, (y / canvas) * size);
      const i = (y * canvas + x) * 3;
      gradientPixels[i] = r;
      gradientPixels[i + 1] = g;
      gradientPixels[i + 2] = b;
    }
  }
  await sharp(gradientPixels, { raw: { width: canvas, height: canvas, channels: 3 } })
    .png()
    .toFile(write('android-icon-background.png'));

  const safe = Math.round(canvas * 0.6);
  const art = await sharp(artwork, raw(artwork, 4))
    .trim({ threshold: 1 })
    .resize(safe, safe, { fit: 'inside' })
    .png()
    .toBuffer();
  await sharp({
    create: { width: canvas, height: canvas, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: art, gravity: 'center' }])
    .png()
    .toFile(write('android-icon-foreground.png'));

  const centre = gradient(size / 2, size / 2);
  console.log('couleur de fond :', `#${centre.map((v) => v.toString(16).padStart(2, '0')).join('')}`);
  console.log('assets écrits dans', OUT);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
