import { select, selectAll } from '../core/dom.js';
import { prefersReducedMotion } from '../core/motion.js';
export function initSkillFilter() {
    const container = select('[data-skills]');
    const buttons = selectAll('[data-filter]');
    const status = select('[data-skills-status]');
    if (container === null || buttons.length === 0) {
        return;
    }
    const skills = selectAll('.skill', container);
    function apply(category) {
        const visibles = [];
        // Paso 1: solo escrituras, sin leer geometría.
        for (const skill of skills) {
            // `data-category` admite varias categorías separadas por espacios: así
            // JavaScript puede salir en "Frontend" y en "Lenguajes" a la vez.
            const cats = (skill.getAttribute('data-category') || '').split(/\s+/);
            const matches = category === 'all' || cats.indexOf(category) !== -1;
            skill.classList.remove('is-entering');
            skill.classList.toggle('is-hidden', !matches);
            if (matches) {
                visibles.push(skill);
            }
        }
        const shown = visibles.length;
        // Paso 2: un único reflow para reiniciar todas las animaciones a la vez,
        // en lugar de forzar uno por tarjeta dentro del bucle.
        if (!prefersReducedMotion() && container !== null && shown > 0) {
            void container.offsetWidth;
            for (let i = 0; i < visibles.length; i += 1) {
                const skill = visibles[i];
                skill.style.setProperty('animation-delay', (i + 1) * 35 + 'ms');
                skill.classList.add('is-entering');
            }
        }
        for (const button of buttons) {
            const isActive = button.getAttribute('data-filter') === category;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        }
        if (status !== null) {
            status.textContent =
                shown === skills.length
                    ? 'Mostrando las ' + String(shown) + ' tecnologías.'
                    : 'Mostrando ' + String(shown) + ' de ' + String(skills.length) + ' tecnologías.';
        }
    }
    for (const button of buttons) {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-filter');
            if (category !== null) {
                apply(category);
            }
        });
    }
    apply('all');
}
//# sourceMappingURL=skill-filter.js.map