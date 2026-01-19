import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm, FormProvider, useWatch } from "react-hook-form";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/shared/form/FormSelect";

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

type Option = { label: string; value: string };

/* ───────────────── UTIL ───────────────── */

const importCSC = () => import("country-state-city");

/* ───────────────── COMPONENT ───────────────── */

export function SearchFiltersSidebar() {
  const [params, setParams] = useSearchParams();

  const [countryOptions, setCountryOptions] = useState<Option[]>([]);
  const [stateOptions, setStateOptions] = useState<Option[]>([]);
  const [cityOptions, setCityOptions] = useState<Option[]>([]);

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

  /* ───────────────── LOAD COUNTRIES (ONCE) ───────────────── */

  useEffect(() => {
    (async () => {
      const { Country } = await importCSC();
      setCountryOptions(
        Country.getAllCountries().map((c) => ({
          label: c.name,
          value: c.isoCode,
        })),
      );
    })();
  }, []);

  /* ───────────────── LOAD STATES ───────────────── */

  useEffect(() => {
    if (!countryCode) {
      setStateOptions([]);
      setCityOptions([]);
      return;
    }

    (async () => {
      const { State } = await importCSC();
      setStateOptions(
        State.getStatesOfCountry(countryCode).map((s) => ({
          label: s.name,
          value: s.isoCode,
        })),
      );
    })();

    setValue("state", undefined);
    setValue("city", undefined);
  }, [countryCode, setValue]);

  /* ───────────────── LOAD CITIES ───────────────── */

  useEffect(() => {
    if (!countryCode || !stateCode) {
      setCityOptions([]);
      return;
    }

    (async () => {
      const { City } = await importCSC();
      setCityOptions(
        City.getCitiesOfState(countryCode, stateCode).map((c) => ({
          label: c.name,
          value: c.name,
        })),
      );
    })();

    setValue("city", undefined);
  }, [countryCode, stateCode, setValue]);

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

  /* ───────────────── FORM → QUERY SYNC ───────────────── */

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
          {/* PRICE */}
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

          {/* LOCATION */}
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

          {/* RATING */}
          <div className="space-y-2">
            <h4 className="font-semibold">Customer Rating</h4>
            {RATINGS.map((r) => (
              <Label key={r} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={params.get("rating") === String(r)}
                  onCheckedChange={() =>
                    setParam(
                      "rating",
                      params.get("rating") === String(r)
                        ? undefined
                        : String(r),
                    )
                  }
                />
                {r}★ & up
              </Label>
            ))}
          </div>

          <Separator />

          {/* SIZES */}
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

          {/* COLORS */}
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

          {/* RESET */}
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
