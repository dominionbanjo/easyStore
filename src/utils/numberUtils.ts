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

  const absValue = Math.abs(value);

  if (absValue < 1000) {
    return `${prefix}${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }

  if (absValue >= 1000 && absValue < 1000000) {
    const kValue = value / 1000;
    return `${prefix}${kValue.toLocaleString(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: kValue % 1 === 0 ? 0 : 2,
    })}K`;
  }

  if (absValue >= 1000000) {
    const mValue = value / 1000000;
    return `${prefix}${mValue.toLocaleString(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: mValue % 1 === 0 ? 0 : 2,
    })}M`;
  }

  return `${prefix}${value.toLocaleString()}`;
}
