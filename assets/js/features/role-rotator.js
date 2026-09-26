import { select } from '../core/dom.js';
import { onMotionPreferenceChange, prefersReducedMotion } from '../core/motion.js';
export function initRoleRotator() {
    const word = select('[data-rotator-word]');
    if (word === null) {
        return;
    }
    const roles = [
        'Desarrollador Full-Stack',
        'Desarrollador Flutter',
        'Desarrollador Mobile',
        'Backend & Cloud',
    ];
    const toggle = select('[data-rotator-toggle]');
    let index = 0;
    let timer;
    /** El usuario pulsó pausa: manda sobre cualquier reanudación automática. */
    let pausedByUser = false;
    function stop() {
        if (timer !== undefined) {
            window.clearInterval(timer);
            timer = undefined;
        }
    }
    function start() {
        stop();
        if (prefersReducedMotion() || pausedByUser || document.hidden) {
            return;
        }
        timer = window.setInterval(() => {
            index = (index + 1) % roles.length;
            if (word === null) {
                return;
            }
            word.textContent = roles[index];
            word.classList.remove('is-swapping');
            // Reinicia la animación forzando un reflow.
            void word.offsetWidth;
            word.classList.add('is-swapping');
        }, 2600);
    }
    /** Vuelve al primer rol y deja la animación en un estado limpio. */
    function reset() {
        index = 0;
        if (word !== null) {
            word.textContent = roles[0];
            word.classList.remove('is-swapping');
        }
    }
    if (toggle !== null) {
        toggle.setAttribute('aria-pressed', 'false');
        toggle.addEventListener('click', () => {
            pausedByUser = !pausedByUser;
            toggle.setAttribute('aria-pressed', String(pausedByUser));
            toggle.setAttribute('aria-label', pausedByUser ? 'Reanudar la rotación de roles' : 'Pausar la rotación de roles');
            document.documentElement.classList.toggle('rotator-paused', pausedByUser);
            if (pausedByUser) {
                stop();
            }
            else {
                start();
            }
        });
        // Con movimiento reducido no hay nada que pausar: el control sobra.
        toggle.hidden = prefersReducedMotion();
    }
    start();
    onMotionPreferenceChange((reduced) => {
        if (toggle !== null) {
            toggle.hidden = reduced;
        }
        if (reduced) {
            stop();
            reset();
        }
        else {
            // Reinicia desde el principio en vez de saltar al rol que tocara.
            reset();
            start();
        }
    });
    // No animar mientras la pestaña está oculta.
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stop();
        }
        else {
            start();
        }
    });
}
//# sourceMappingURL=role-rotator.js.map