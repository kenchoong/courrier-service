/**
 * Roundoff estimated delivery time upto 2 digits
 * @example 3.456 becomes 3.45
 * @param input number
 * @returns rounded off value
 */
export function roundOff(value: number) {
  return Math.trunc(value * 100) / 100
}
