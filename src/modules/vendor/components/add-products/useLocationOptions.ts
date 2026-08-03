import { useEffect, useState } from "react";
import type { UseFormSetValue } from "react-hook-form";
import { loadCountries, loadStates } from "../../utils/addProduct.helpers";

interface LocationOption {
  label: string;
  value: string;
}

export function useLocationOptions(
  country: string,
  state: string,
  setValue: UseFormSetValue<Record<string, unknown>>,
) {
  const [countries, setCountries] = useState<LocationOption[]>([]);
  const [states, setStates] = useState<LocationOption[]>([]);

  useEffect(() => {
    loadCountries().then(setCountries);
  }, []);

  useEffect(() => {
    if (!country) return;

    loadStates(country).then((list) => {
      setStates(list);

      if (state && !list.some((s) => s.value === state)) {
        setValue("state", "");
      }
    });
  }, [country, state, setValue]);

  return { countries, states };
}
