import { select, selectAll } from '../core/dom.js';

export function initMobileNav(): void {
  const burger = select<HTMLButtonElement>('[data-burger]');
  const nav = select<HTMLElement>('[data-nav]');
  const label = select<HTMLElement>('[data-burger-label]');

  if (burger === null || nav === null) {
    return;
  }

  function setOpen(open: boolean): void {
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

  function isOpen(): boolean {
    return burger !== null && burger.getAttribute('aria-expanded') === 'true';
  }

  burger.addEventListener('click', (): void => {
    setOpen(!isOpen());
  });

  // Cerrar al elegir un destino.
  for (const link of selectAll<HTMLAnchorElement>('a', nav)) {
    link.addEventListener('click', (): void => {
      setOpen(false);
    });
  }

  // Escape cierra y devuelve el foco al botón.
  document.addEventListener('keydown', (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      burger.focus();
    }
  });

  // Al volver a escritorio el menú deja de estar desplegado.
  window.matchMedia('(min-width: 861px)').addEventListener('change', (event): void => {
    if (event.matches) {
      setOpen(false);
    }
  });
}
