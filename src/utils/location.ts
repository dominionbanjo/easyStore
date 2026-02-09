import { NigeriaData } from "./nigeria-data";

export function formatLocation({
  city,
  state,
  country,
  postalCode,
}: {
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
}) {
  const countryObj = country ? NigeriaData.getCountryByCode(country) : null;
  const countryName = countryObj ? countryObj.name : country || "Nigeria";

  const stateObj =
    country === "NG" && state ? NigeriaData.getStateByCode(state) : null;
  const stateName = stateObj ? stateObj.name : state;

  // Deduplicate if city and state are the same
  const finalCity = city;
  const finalState = stateName === city ? null : stateName;

  const parts = [finalCity, finalState, countryName, postalCode].filter(
    Boolean,
  );

  return parts.join(", ");
}
