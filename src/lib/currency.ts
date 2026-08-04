/**
 * Helpers for peso amount inputs.
 *
 * Amount fields are plain text inputs so we can group the integer part with
 * commas while the user types (a `type="number"` input cannot hold commas).
 * The state always holds the display string; call `parseAmount` before sending
 * the value anywhere that expects a number.
 */

/** Digits/decimal only, one decimal point, max 2 decimals, comma-grouped. */
export function formatAmountInput(value: string): string {
  let cleaned = value.replace(/[^\d.]/g, "");

  // Keep only the first decimal point.
  const firstDot = cleaned.indexOf(".");
  if (firstDot !== -1) {
    cleaned =
      cleaned.slice(0, firstDot + 1) +
      cleaned.slice(firstDot + 1).replace(/\./g, "");
  }
  if (cleaned === "") return "";

  const [intPart = "", decPart] = cleaned.split(".");
  const grouped = intPart
    .replace(/^0+(?=\d)/, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return decPart === undefined ? grouped : `${grouped}.${decPart.slice(0, 2)}`;
}

/** Display string ("1,234.50") → number. NaN when the field is empty/invalid. */
export function parseAmount(value: string): number {
  return parseFloat(value.replace(/,/g, ""));
}

/** Number → "1,234.50" for prefilling an amount input. */
export function formatAmountValue(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * onChange handler for an amount input: formats the value and restores the
 * caret so inserted commas don't push it to the end of the field.
 */
export function handleAmountChange(
  input: HTMLInputElement,
  setValue: (v: string) => void,
) {
  const raw = input.value;
  const caret = input.selectionStart ?? raw.length;
  const significantBefore = raw.slice(0, caret).replace(/[^\d.]/g, "").length;
  const formatted = formatAmountInput(raw);

  setValue(formatted);

  // React rewrites the value after this tick; reposition the caret afterwards.
  requestAnimationFrame(() => {
    let pos = 0;
    let seen = 0;
    while (pos < formatted.length && seen < significantBefore) {
      if (/[\d.]/.test(formatted.charAt(pos))) seen++;
      pos++;
    }
    input.setSelectionRange(pos, pos);
  });
}
