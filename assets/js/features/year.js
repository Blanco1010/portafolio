import { select } from '../core/dom.js';
export function initYear() {
    const slot = select('[data-year]');
    if (slot !== null) {
        slot.textContent = String(new Date().getFullYear());
    }
}
//# sourceMappingURL=year.js.map