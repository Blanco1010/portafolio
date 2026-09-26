import { select, selectAll } from '../core/dom.js';
export function initMobileNav() {
    const burger = select('[data-burger]');
    const nav = select('[data-nav]');
    const label = select('[data-burger-label]');
    if (burger === null || nav === null) {
        return;
    }
    function setOpen(open) {
        if (burger === null || nav === null) {
            return;
        }
        nav.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', String(open));
        if (label !== null) {
            label.textContent = open ? 'Cerrar menú' : 'Abrir menú';
        }
        document.body.style.overflow = open ? 'hidden' : '';
    }
    function isOpen() {
        return burger !== null && burger.getAttribute('aria-expanded') === 'true';
    }
    burger.addEventListener('click', () => {
        setOpen(!isOpen());
    });
    // Cerrar al elegir un destino.
    for (const link of selectAll('a', nav)) {
        link.addEventListener('click', () => {
            setOpen(false);
        });
    }
    // Escape cierra y devuelve el foco al botón.
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isOpen()) {
            setOpen(false);
            burger.focus();
        }
    });
    // Al volver a escritorio el menú deja de estar desplegado.
    window.matchMedia('(min-width: 861px)').addEventListener('change', (event) => {
        if (event.matches) {
            setOpen(false);
        }
    });
}
//# sourceMappingURL=mobile-nav.js.map