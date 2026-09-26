import { selectAll } from '../core/dom.js';

export function initScrollSpy(): void {
  const links = selectAll<HTMLAnchorElement>('[data-nav-link]');
  if (links.length === 0 || typeof IntersectionObserver === 'undefined') {
    return;
  }

  const byId = new Map<string, HTMLAnchorElement>();
  const sections: HTMLElement[] = [];

  for (const link of links) {
    const href = link.getAttribute('href');
    if (href === null || href.charAt(0) !== '#') {
      continue;
    }
    const id = href.slice(1);
    const section = document.getElementById(id);
    if (section !== null) {
      byId.set(id, link);
      sections.push(section);
    }
  }

  if (sections.length === 0) {
    return;
  }

  function activate(id: string): void {
    for (const link of links) {
      link.classList.remove('is-active');
      link.removeAttribute('aria-current');
    }
    const active = byId.get(id);
    if (active !== undefined) {
      active.classList.add('is-active');
      active.setAttribute('aria-current', 'true');
    }
  }

  const visible = new Set<string>();

  const observer = new IntersectionObserver(
    (entries: IntersectionObserverEntry[]): void => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visible.add(entry.target.id);
        } else {
          visible.delete(entry.target.id);
        }
      }

      // Gana la sección visible que aparece antes en el documento.
      for (const section of sections) {
        if (visible.has(section.id)) {
          activate(section.id);
          return;
        }
      }

      // Ninguna sección en la banda (p. ej. arriba del todo, en el hero):
      // se limpia en vez de dejar marcado un enlace obsoleto.
      activate('');
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  for (const section of sections) {
    observer.observe(section);
  }
}
