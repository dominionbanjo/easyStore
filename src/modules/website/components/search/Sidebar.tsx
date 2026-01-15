import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { Country, State, City } from "country-state-city";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/shared/FormSelect";

/* ───────────────── CONSTANTS ───────────────── */

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = ["Black", "White", "Red", "Blue", "Green", "Yellow"];
const RATINGS = [4, 3, 2, 1];

const DEFAULT_COUNTRY = "NG";

/* ───────────────── TYPES ───────────────── */

type FilterForm = {
  country?: string;
  state?: string;
  city?: string;
};

/* ───────────────── COMPONENT ───────────────── */

export function SearchFiltersSidebar() {
  const [params, setParams] = useSearchParams();

  const methods = useForm<FilterForm>({
    defaultValues: {
      country: params.get("country") ?? DEFAULT_COUNTRY,
      state: params.get("state") ?? undefined,
      city: params.get("city") ?? undefined,
    },
  });

  const { reset, setValue, control } = methods;

  /* ───────────────── WATCH DEPENDENCIES ───────────────── */

  const countryCode = useWatch({ name: "country", control });
  const stateCode = useWatch({ name: "state", control });
  const cityValue = useWatch({ name: "city", control });

  /* ───────────────── OPTIONS (country-state-city) ───────────────── */

  const countryOptions = useMemo(
    () =>
      Country.getAllCountries().map((c) => ({
        label: c.name,
        value: c.isoCode,
      })),
    []
  );

  const stateOptions = useMemo(() => {
    if (!countryCode) return [];
    return State.getStatesOfCountry(countryCode).map((s) => ({
      label: s.name,
      value: s.isoCode,
    }));
  }, [countryCode]);

  const cityOptions = useMemo(() => {
    if (!countryCode || !stateCode) return [];
    return City.getCitiesOfState(countryCode, stateCode).map((c) => ({
      label: c.name,
      value: c.name,
    }));
  }, [countryCode, stateCode]);

  /* ───────────────── HELPERS ───────────────── */

  const setParam = (key: string, value?: string) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    next.set("page", "1");
    setParams(next);
  };

  const toggleMulti = (key: string, value: string) => {
    const current = params.get(key)?.split(",") ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    setParam(key, next.length ? next.join(",") : undefined);
  };

  /* ───────────────── INITIAL COUNTRY PARAM ───────────────── */

  useEffect(() => {
    if (!params.get("country")) {
      setParam("country", DEFAULT_COUNTRY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ───────────────── RESET DEPENDENT FIELDS ───────────────── */

  useEffect(() => {
    setValue("state", undefined);
    setValue("city", undefined);
  }, [countryCode, setValue]);

  useEffect(() => {
    setValue("city", undefined);
  }, [stateCode, setValue]);

  /* ───────────────── FORM → QUERY SYNC (IMMEDIATE) ───────────────── */

  useEffect(() => {
    setParam("country", countryCode);
  }, [countryCode]);

  useEffect(() => {
    setParam("state", stateCode);
  }, [stateCode]);

  useEffect(() => {
    setParam("city", cityValue);
  }, [cityValue]);

  /* ───────────────── UI ───────────────── */

  return (
    <FormProvider {...methods}>
      <aside className="space-y-6">
        <Card className="p-5 rounded-2xl shadow-sm space-y-6">
          {/* ─── PRICE ─── */}
          <div>
            <h4 className="font-semibold mb-3">Price (₦)</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Min"
                type="number"
                value={params.get("minPrice") ?? ""}
                onChange={(e) =>
                  setParam("minPrice", e.target.value || undefined)
                }
              />
              <Input
                placeholder="Max"
                type="number"
                value={params.get("maxPrice") ?? ""}
                onChange={(e) =>
                  setParam("maxPrice", e.target.value || undefined)
                }
              />
            </div>
          </div>

          <Separator />

          {/* ─── LOCATION ─── */}
          <div className="space-y-3">
            <h4 className="font-semibold">Location</h4>

            <FormSelect
              name="country"
              placeholder="Select country"
              options={countryOptions}
            />

            <FormSelect
              name="state"
              placeholder="Select state"
              options={stateOptions}
              disabled={!countryCode}
            />

            <FormSelect
              name="city"
              placeholder="Select city"
              options={cityOptions}
              disabled={!stateCode}
            />
          </div>

          <Separator />

          {/* ─── RATING ─── */}
          <div className="space-y-2">
            <h4 className="font-semibold">Customer Rating</h4>
            {RATINGS.map((r) => (
              <Label key={r} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={params.get("rating") === String(r)}
                  onCheckedChange={() =>
                    setParam(
                      "rating",
                      params.get("rating") === String(r) ? undefined : String(r)
                    )
                  }
                />
                {r}★ & up
              </Label>
            ))}
          </div>

          <Separator />

          {/* ─── SIZES ─── */}
          <div className="space-y-2">
            <h4 className="font-semibold">Sizes</h4>
            {SIZES.map((size) => (
              <Label key={size} className="flex items-center gap-2">
                <Checkbox
                  checked={params.get("sizes")?.split(",").includes(size)}
                  onCheckedChange={() => toggleMulti("sizes", size)}
                />
                {size}
              </Label>
            ))}
          </div>

          <Separator />

          {/* ─── COLORS ─── */}
          <div className="space-y-2">
            <h4 className="font-semibold">Colors</h4>
            {COLORS.map((color) => (
              <Label key={color} className="flex items-center gap-2">
                <Checkbox
                  checked={params.get("colors")?.split(",").includes(color)}
                  onCheckedChange={() => toggleMulti("colors", color)}
                />
                {color}
              </Label>
            ))}
          </div>

          <Separator />

          {/* ─── RESET ─── */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              reset({ country: DEFAULT_COUNTRY });
              setParams({ q: params.get("q") ?? "", country: DEFAULT_COUNTRY });
            }}
          >
            Clear all filters
          </Button>
        </Card>
      </aside>
    </FormProvider>
  );
}
