/**
 * Preferencia de movimiento reducido del sistema.
 *
 * Fuente única de verdad para `prefers-reduced-motion`. Se expone como FUNCIÓN
 * y no como variable exportada a propósito: la preferencia puede cambiar con la
 * página ya abierta, y una función garantiza que quien la consulta lee siempre
 * el valor actual, no una copia del momento de la importación.
 */
const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
let reducido = consulta.matches;
const oyentes = [];
consulta.addEventListener('change', (event) => {
    reducido = event.matches;
    for (const oyente of oyentes) {
        oyente(reducido);
    }
});
/** `true` cuando el sistema pide reducir el movimiento. Consúltalo en el momento de usarlo. */
export function prefersReducedMotion() {
    return reducido;
}
/** Avisa cuando la preferencia cambia sin recargar la página. */
export function onMotionPreferenceChange(listener) {
    oyentes.push(listener);
}
//# sourceMappingURL=motion.js.map