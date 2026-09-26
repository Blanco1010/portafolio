import { select } from '../core/dom.js';
import { prefersReducedMotion } from '../core/motion.js';

export function initTilt(): void {
  const card = select<HTMLElement>('[data-tilt]');
  if (card === null || prefersReducedMotion()) {
    return;
  }

  if (!window.matchMedia('(pointer: fine)').matches) {
    return;
  }

  const maxTilt = 6;

  card.addEventListener('pointermove', (event: PointerEvent): void => {
    // Se comprueba aquí y no solo al arrancar: la preferencia puede cambiar
    // en caliente mientras la página está abierta.
    if (prefersReducedMotion()) {
      return;
    }
    const bounds = card.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width - 0.5;
    const py = (event.clientY - bounds.top) / bounds.height - 0.5;

    card.style.setProperty('--ry', (px * maxTilt).toFixed(2) + 'deg');
    card.style.setProperty('--rx', (-py * maxTilt).toFixed(2) + 'deg');
  });

  card.addEventListener('pointerleave', (): void => {
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  });
}
