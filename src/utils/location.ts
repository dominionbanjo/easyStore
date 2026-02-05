import { Country, State } from "country-state-city";

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
  const countryObj = country ? Country.getCountryByCode(country) : null;
  const countryName = countryObj ? countryObj.name : country;

  const stateObj =
    country && state ? State.getStateByCodeAndCountry(state, country) : null;
  const stateName = stateObj ? stateObj.name : state;

  // Deduplicate if city and state are the same
  const finalCity = city;
  const finalState = stateName === city ? null : stateName;

  const parts = [finalCity, finalState, countryName, postalCode].filter(
    Boolean,
  );

  return parts.join(", ");
}
