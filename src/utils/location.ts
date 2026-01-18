import { Country, State } from "country-state-city";

export function formatLocation({
  city,
  state,
  country,
}: {
  city?: string | null;
  state?: string | null;
  country?: string | null;
}) {
  const countryObj = country ? Country.getCountryByCode(country) : null;

  const stateObj =
    country && state ? State.getStateByCodeAndCountry(state, country) : null;

  const parts = [city, stateObj?.name, countryObj?.name].filter(Boolean);

  return parts.join(", ");
}
