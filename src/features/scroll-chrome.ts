import { select } from '../core/dom.js';
import { clamp } from '../core/math.js';

export function initScrollChrome(): void {
  const header = select<HTMLElement>('[data-header]');
  const progressBar = select<HTMLElement>('[data-progress]');
  let ticking = false;

  function update(): void {
    const scrollY = window.scrollY;

    if (header !== null) {
      header.classList.toggle('is-stuck', scrollY > 24);
    }

    if (progressBar !== null) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? clamp(scrollY / scrollable, 0, 1) : 0;
      progressBar.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
    }

    ticking = false;
  }

  function requestUpdate(): void {
    if (ticking) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  // Estado inicial correcto al recargar o entrar por un enlace con ancla.
  update();
}
