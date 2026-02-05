import type { SpecItem } from "../types/vendorTypes";

export function specsObjectToItems(specs: Record<string, string>): SpecItem[] {
  return Object.entries(specs).map(([key, value]) => ({
    key,
    value,
  }));
}
