/**
 * Formats a number into a compact string representation (K for thousands, M for millions)
 * with up to 2 decimal places.
 *
 * @param value The number to format
 * @param prefix Optional prefix (e.g., currency symbol)
 * @returns Formatted string
 */
export function formatCompactNumber(
  value: number,
  prefix: string = "",
): string {
  if (value === 0) return `${prefix}0`;

  const formatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2,
  });

  return `${prefix}${formatter.format(value)}`;
}
