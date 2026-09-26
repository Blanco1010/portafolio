import { select } from '../core/dom.js';

export function initYear(): void {
  const slot = select<HTMLElement>('[data-year]');
  if (slot !== null) {
    slot.textContent = String(new Date().getFullYear());
  }
}
