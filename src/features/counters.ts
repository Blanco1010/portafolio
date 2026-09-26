import { selectAll } from '../core/dom.js';
import { clamp, easeOutCubic } from '../core/math.js';
import { prefersReducedMotion } from '../core/motion.js';

export function initCounters(): void {
  const counters = selectAll<HTMLElement>('[data-counter]');
  if (counters.length === 0) {
    return;
  }

  function run(element: HTMLElement): void {
    const target = Number(element.getAttribute('data-counter'));
    if (!Number.isFinite(target)) {
      return;
    }

    if (prefersReducedMotion()) {
      element.textContent = String(target);
      return;
    }

    const duration = 1400;
    let startedAt: number | null = null;

    function step(timestamp: number): void {
      if (startedAt === null) {
        startedAt = timestamp;
      }
      const progress = clamp((timestamp - startedAt) / duration, 0, 1);
      element.textContent = String(Math.round(easeOutCubic(progress) * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }

  if (typeof IntersectionObserver === 'undefined') {
    for (const counter of counters) {
      run(counter);
    }
    return;
  }

  const observer = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]): void => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }
        run(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.6 }
  );

  for (const counter of counters) {
    observer.observe(counter);
  }
}
