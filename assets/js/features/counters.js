import { selectAll } from '../core/dom.js';
import { clamp, easeOutCubic } from '../core/math.js';
import { prefersReducedMotion } from '../core/motion.js';
export function initCounters() {
    const counters = selectAll('[data-counter]');
    if (counters.length === 0) {
        return;
    }
    function run(element) {
        const target = Number(element.getAttribute('data-counter'));
        if (!Number.isFinite(target)) {
            return;
        }
        if (prefersReducedMotion()) {
            element.textContent = String(target);
            return;
        }
        const duration = 1400;
        let startedAt = null;
        function step(timestamp) {
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
    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) {
                continue;
            }
            run(entry.target);
            observer.unobserve(entry.target);
        }
    }, { threshold: 0.6 });
    for (const counter of counters) {
        observer.observe(counter);
    }
}
//# sourceMappingURL=counters.js.map