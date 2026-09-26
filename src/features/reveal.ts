import { selectAll } from '../core/dom.js';
import { prefersReducedMotion } from '../core/motion.js';

export function initReveal(): void {
  const targets = selectAll<HTMLElement>('[data-reveal]');
  if (targets.length === 0) {
    return;
  }

  for (const element of targets) {
    const delay = element.getAttribute('data-reveal-delay');
    if (delay !== null) {
      element.style.setProperty('--reveal-delay', delay);
    }
  }

  // Sin IntersectionObserver (o con movimiento reducido) se muestra todo ya.
  if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
    for (const element of targets) {
      element.classList.add('is-visible');
    }
    return;
  }

  const observer = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]): void => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  for (const element of targets) {
    observer.observe(element);
  }
}
