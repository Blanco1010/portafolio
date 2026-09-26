/**
 * Funciones numéricas puras para animación.
 *
 * Sin estado y sin tocar el DOM: se pueden probar de forma aislada.
 */

/** Interpolación lineal: acerca `current` a `target` en un factor `amount`. */
export function lerp(current: number, target: number, amount: number): number {
  return current + (target - current) * amount;
}

/** Curva de suavizado: arranca rápido y frena al final. */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Acota `value` al intervalo [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
