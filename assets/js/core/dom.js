/**
 * Consultas al DOM con tipos.
 *
 * Envuelven `querySelector` para que el tipo del elemento se declare en la
 * llamada y no haya que repetir aserciones `as HTMLElement` por todas partes.
 */
/** Primer elemento que coincide, o `null`. El llamante decide el tipo. */
export function select(selector, scope = document) {
    return scope.querySelector(selector);
}
/** Todos los elementos que coinciden, como array (no NodeList). */
export function selectAll(selector, scope = document) {
    return Array.prototype.slice.call(scope.querySelectorAll(selector));
}
//# sourceMappingURL=dom.js.map