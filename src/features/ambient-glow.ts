import { select } from '../core/dom.js';
import { lerp } from '../core/math.js';
import { prefersReducedMotion } from '../core/motion.js';

export function initAmbientGlow(): void {
  const glow = select<HTMLElement>('[data-glow]');
  if (glow === null || prefersReducedMotion()) {
    return;
  }

  // En dispositivos sin puntero fino el efecto no aporta nada.
  if (!window.matchMedia('(pointer: fine)').matches) {
    return;
  }

  let targetX = window.innerWidth * 0.7;
  let targetY = window.innerHeight * 0.28;
  let currentX = targetX;
  let currentY = targetY;
  let running = false;

  function frame(): void {
    currentX = lerp(currentX, targetX, 0.07);
    currentY = lerp(currentY, targetY, 0.07);

    if (glow !== null) {
      glow.style.setProperty('--mx', currentX.toFixed(1) + 'px');
      glow.style.setProperty('--my', currentY.toFixed(1) + 'px');
    }

    // Se detiene cuando ya prácticamente alcanzó el objetivo.
    if (Math.abs(currentX - targetX) > 0.5 || Math.abs(currentY - targetY) > 0.5) {
      window.requestAnimationFrame(frame);
    } else {
      running = false;
    }
  }

  window.addEventListener(
    'pointermove',
    (event: PointerEvent): void => {
      if (prefersReducedMotion()) {
        return;
      }
      targetX = event.clientX;
      targetY = event.clientY;
      if (!running) {
        running = true;
        window.requestAnimationFrame(frame);
      }
    },
    { passive: true }
  );
}
