/**
 * Consultas al DOM con tipos.
 *
 * Envuelven `querySelector` para que el tipo del elemento se declare en la
 * llamada y no haya que repetir aserciones `as HTMLElement` por todas partes.
 */

/** Primer elemento que coincide, o `null`. El llamante decide el tipo. */
export function select<T extends Element>(
  selector: string,
  scope: ParentNode = document
): T | null {
  return scope.querySelector<T>(selector);
}

/** Todos los elementos que coinciden, como array (no NodeList). */
export function selectAll<T extends Element>(
  selector: string,
  scope: ParentNode = document
): T[] {
  return Array.prototype.slice.call(scope.querySelectorAll<T>(selector));
}
