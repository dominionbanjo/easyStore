import { useEffect, useState } from "react";
import { loadCountries, loadStates } from "../../utils/addProduct.helpers";

export function useLocationOptions(
  country: string,
  state: string,
  setValue: any,
) {
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);

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
