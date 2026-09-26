/**
 * Ensambla src/css/** en assets/css/styles.css
 * -----------------------------------------------------------------------------
 * El CSS se escribe repartido en archivos pequeños (uno por componente o zona),
 * pero el navegador recibe UNO SOLO. Es deliberado: una hoja de estilos bloquea
 * el pintado, así que 31 <link> serían 31 bloqueos en cadena. Aquí se paga el
 * coste una vez, en tiempo de build.
 *
 * ORDEN: el array ARCHIVOS define la cascada. NO lo reordenes a la ligera —
 * dos reglas con la misma especificidad se resuelven por orden de aparición.
 *
 * Uso:  node tools/build-css.mjs [--watch]
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { watch } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGEN = join(RAIZ, 'src', 'css');
const DESTINO = join(RAIZ, 'assets', 'css', 'styles.css');

/** Orden de la cascada. Los comentarios marcan las capas. */
const ARCHIVOS = [
  // — Base: tokens, reset y utilidades. Todo lo demás se apoya aquí.
  'base/tokens.css',
  'base/reset.css',
  'base/utilities.css',

  // — Layout: el armazón de la página.
  'layout/ambient.css',
  'layout/scroll-progress.css',
  'layout/header.css',

  // — Componentes y secciones, en el orden en que aparecen en la página.
  'components/button.css',
  'sections/hero.css',
  'components/role-toggle.css',
  'components/code-card.css',
  'components/scroll-cue.css',
  'layout/section.css',
  'sections/about.css',
  'components/stat.css',
  'components/timeline.css',
  'components/chip.css',
  'sections/skills.css',
  'components/filter.css',
  'components/skill.css',
  'sections/education.css',
  'components/panel.css',
  'components/language.css',
  'sections/contact.css',
  'components/contact-card.css',
  'components/cta.css',
  'layout/footer.css',

  // — Animaciones: los @keyframes que usan los bloques anteriores.
  'base/animations.css',

  // — Ajustes finales. Van al final a propósito: sobrescriben todo lo anterior.
  'settings/responsive.css',
  'settings/reduced-motion.css',
  'settings/forced-colors.css',
  'settings/print.css',
];

const CABECERA = `/* =============================================================================
   ARCHIVO GENERADO — NO EDITAR A MANO
   -----------------------------------------------------------------------------
   Se ensambla desde src/css/** con: npm run build
   Edita los archivos de origen, no este.
   ========================================================================== */

`;

async function construir() {
  const partes = [];
  for (const rel of ARCHIVOS) {
    partes.push(await readFile(join(ORIGEN, rel), 'utf8'));
  }
  await mkdir(dirname(DESTINO), { recursive: true });
  await writeFile(DESTINO, CABECERA + partes.join('\n'), 'utf8');
  const kb = (Buffer.byteLength(CABECERA + partes.join('\n')) / 1024).toFixed(1);
  console.log(`css: ${ARCHIVOS.length} archivos -> assets/css/styles.css (${kb} kB)`);
}

await construir();

if (process.argv.includes('--watch')) {
  console.log('css: vigilando src/css/ …');
  let pendiente = null;
  watch(ORIGEN, { recursive: true }, () => {
    // Un guardado dispara varios eventos; se agrupan.
    clearTimeout(pendiente);
    pendiente = setTimeout(() => {
      construir().catch((e) => console.error('css:', e.message));
    }, 80);
  });
}
