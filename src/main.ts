/**
 * Portafolio — Juan Camilo Blanco Martinez
 * -----------------------------------------------------------------------------
 * Punto de entrada. Aquí no hay lógica: solo se decide QUÉ se arranca y CUÁNDO.
 * Cada comportamiento vive en su propio módulo dentro de `features/`, y los
 * ayudantes compartidos en `core/`.
 *
 * Se compila a `assets/js/main.js` como módulo ES nativo, sin empaquetador.
 * Por eso las importaciones llevan extensión `.js`: es lo que pide el navegador,
 * y TypeScript las deja tal cual al compilar.
 */

import { initReveal } from './features/reveal.js';
import { initScrollChrome } from './features/scroll-chrome.js';
import { initMobileNav } from './features/mobile-nav.js';
import { initScrollSpy } from './features/scroll-spy.js';
import { initCounters } from './features/counters.js';
import { initRoleRotator } from './features/role-rotator.js';
import { initSkillFilter } from './features/skill-filter.js';
import { initAmbientGlow } from './features/ambient-glow.js';
import { initTilt } from './features/tilt.js';
import { initYear } from './features/year.js';

/**
 * Cada entrada es independiente: si una falla, las demás siguen funcionando.
 * En una página que es la carta de presentación de alguien, un error en el
 * tilt decorativo no puede dejar el menú sin responder.
 */
const comportamientos: Array<[string, () => void]> = [
  ['reveal', initReveal],
  ['scroll-chrome', initScrollChrome],
  ['mobile-nav', initMobileNav],
  ['scroll-spy', initScrollSpy],
  ['counters', initCounters],
  ['role-rotator', initRoleRotator],
  ['skill-filter', initSkillFilter],
  ['ambient-glow', initAmbientGlow],
  ['tilt', initTilt],
  ['year', initYear],
];

function init(): void {
  for (const [nombre, arrancar] of comportamientos) {
    try {
      arrancar();
    } catch (error) {
      console.error(`[portafolio] fallo al iniciar "${nombre}":`, error);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
