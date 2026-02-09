import type { SpecItem } from "../types/vendorTypes";

export type LocalImage = {
  file: File;
  preview: string;
};
import { NigeriaData } from "@/utils/nigeria-data";

export async function loadCountries() {
  return NigeriaData.getCountries().map((c) => ({
    label: c.name,
    value: c.isoCode,
  }));
}

export async function loadStates(countryCode: string) {
  if (countryCode !== "NG") return [];
  return NigeriaData.getStates().map((s) => ({
    label: s.name,
    value: s.isoCode,
  }));
}

/* ───────────────── IMAGE ───────────────── */

export function createImagePreview(file: File): LocalImage {
  return {
    file,
    preview: URL.createObjectURL(file),
  };
}

/* ───────────────── SPECS ───────────────── */

export function addSpec(
  setter: React.Dispatch<React.SetStateAction<SpecItem[]>>,
) {
  setter((p) => [...p, { key: "", value: "" }]);
}

export function updateSpec(
  setter: React.Dispatch<React.SetStateAction<SpecItem[]>>,
  index: number,
  field: "key" | "value",
  value: string,
) {
  setter((p) => p.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
}

export function removeSpec(
  setter: React.Dispatch<React.SetStateAction<SpecItem[]>>,
  index: number,
) {
  setter((p) => p.filter((_, i) => i !== index));
}

/* ───────────────── CHIPS ───────────────── */

export function addChip(
  value: string,
  setter: React.Dispatch<React.SetStateAction<string[]>>,
) {
  const v = value.trim();
  if (!v) return;
  setter((p) => (p.includes(v) ? p : [...p, v]));
}

export function removeChip(
  value: string,
  setter: React.Dispatch<React.SetStateAction<string[]>>,
) {
  setter((p) => p.filter((v) => v !== value));
}

/* ───────────────── SPECS → OBJECT ───────────────── */

export function buildSpecsObject(specs: SpecItem[]) {
  return specs.reduce<Record<string, string>>((acc, s) => {
    if (s.key && s.value) acc[s.key] = s.value;
    return acc;
  }, {});
}

/* ───────────────── DRAFT → FORM ───────────────── */

export function draftToSpecs(draftSpecs?: Record<string, string>): SpecItem[] {
  if (!draftSpecs) return [];
  return Object.entries(draftSpecs).map(([key, value]) => ({
    key,
    value,
  }));
}
