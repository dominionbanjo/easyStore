import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { FormInput } from "@/components/shared/form/FormInput";
import { FormSelect } from "@/components/shared/form/FormSelect";
import { FormTextarea } from "@/components/shared/form/FormTextarea";

import ChipSection from "../components/add-products/ChipSection";
import ImageUploadSection, {
  type LocalImage,
} from "../components/add-products/ImageUploadSection";

import type { FormValues, SpecItem } from "../types/vendorTypes";
import { CategorySelect } from "@/components/shared/form/CategorySelect";
import { ColorMultiSelect } from "@/components/shared/form/ColorMultiSelect";
import SpecificationsSection from "../components/add-products/SpecificationsSection";

const importCSC = () => import("country-state-city");

/* ───────────────── PAGE ───────────────── */

export default function AddProductPage() {
  const methods = useForm<FormValues>({
    defaultValues: {
      stock: 0,
      country: "NG", // default Nigeria
    },
  });

  const { handleSubmit, watch, setValue } = methods;

  /* ───────── LOCATION STATE ───────── */

  const selectedCountry = watch("country");

  const [countryOptions, setCountryOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const [stateOptions, setStateOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    importCSC().then(({ Country }) => {
      const countries = Country.getAllCountries().map((c) => ({
        label: c.name,
        value: c.isoCode,
      }));
      setCountryOptions(countries);
    });
  }, []);

  useEffect(() => {
    if (!selectedCountry) {
      setStateOptions([]);
      return;
    }

    importCSC().then(({ State }) => {
      const states = State.getStatesOfCountry(selectedCountry).map((s) => ({
        label: s.name,
        value: s.name,
      }));
      setStateOptions(states);
      setValue("state", ""); // reset state when country changes
    });
  }, [selectedCountry, setValue]);

  /* ───────── LOCAL STATE ───────── */

  const [image, setImage] = useState<LocalImage | null>(null);
  const [gallery, setGallery] = useState<LocalImage[]>([]);
  const [specs, setSpecs] = useState<SpecItem[]>([]);

  const [tags, setTags] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);

  /* ───────── IMAGE HANDLERS ───────── */

  function createPreview(file: File): LocalImage {
    return {
      file,
      preview: URL.createObjectURL(file),
    };
  }

  const handleMainImage = (file: File) => {
    setImage(createPreview(file));
  };

  const handleGalleryAdd = (file: File) => {
    setGallery((p) => [...p, createPreview(file)]);
  };

  /* ───────── SPECS ───────── */

  const addSpec = () => setSpecs((p) => [...p, { key: "", value: "" }]);

  const updateSpec = (i: number, field: "key" | "value", v: string) => {
    setSpecs((p) => p.map((s, idx) => (idx === i ? { ...s, [field]: v } : s)));
  };

  const removeSpec = (i: number) =>
    setSpecs((p) => p.filter((_, idx) => idx !== i));

  /* ───────── CHIP HELPERS ───────── */

  function addChip(
    value: string,
    set: React.Dispatch<React.SetStateAction<string[]>>,
  ) {
    const v = value.trim();
    if (!v) return;
    set((p) => (p.includes(v) ? p : [...p, v]));
  }

  function removeChip(
    value: string,
    set: React.Dispatch<React.SetStateAction<string[]>>,
  ) {
    set((p) => p.filter((v) => v !== value));
  }

  /* ───────── SUBMIT (FRONTEND ONLY) ───────── */

  const onSubmit = (values: FormValues) => {
    const specsObject = specs.reduce<Record<string, string>>((acc, s) => {
      if (s.key && s.value) acc[s.key] = s.value;
      return acc;
    }, {});

    const payload = {
      ...values,
      image,
      gallery,
      specs: specsObject,
      tags,
      highlights,
      colors,
      sizes,
    };

    console.log("FORM PREVIEW DATA:", payload);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <Card>
          <CardHeader>
            <CardTitle>Add Product</CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* PRODUCT NAME */}
            <FormInput
              name="name"
              label="Product Name"
              placeholder="e.g. Wooden Dining Table"
            />

            {/* IMAGE UPLOAD */}
            <ImageUploadSection
              image={image}
              gallery={gallery}
              onMainImageChange={handleMainImage}
              onGalleryAdd={handleGalleryAdd}
              onRemoveMain={() => setImage(null)}
              onRemoveGallery={(i) =>
                setGallery((p) => p.filter((_, idx) => idx !== i))
              }
            />

            {/* CATEGORY */}
            <CategorySelect name="category_id" />

            {/* DESCRIPTION */}
            <FormTextarea
              name="description"
              label="Description"
              placeholder="Describe the product, its use case, and benefits"
              rows={4}
            />
            <ColorMultiSelect name="colors" />

            {/* PRICING */}
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                name="price"
                label="Price"
                type="number"
                placeholder="e.g. 120000"
              />
              <FormInput
                name="discount_price"
                label="Discount Price"
                type="number"
                placeholder="Optional"
              />
            </div>

            <FormInput
              name="stock"
              label="Stock"
              type="number"
              placeholder="Available quantity"
            />

            {/* SPECS */}
            <SpecificationsSection
              specs={specs}
              onAdd={addSpec}
              onUpdate={updateSpec}
              onRemove={removeSpec}
            />

            {/* CHIP SECTIONS */}
            <ChipSection
              label="Tags"
              values={tags}
              onAdd={(v) => addChip(v, setTags)}
              onRemove={(v) => removeChip(v, setTags)}
            />
            <ChipSection
              label="Highlights"
              values={highlights}
              onAdd={(v) => addChip(v, setHighlights)}
              onRemove={(v) => removeChip(v, setHighlights)}
            />
            <ChipSection
              label="Sizes"
              values={sizes}
              onAdd={(v) => addChip(v, setSizes)}
              onRemove={(v) => removeChip(v, setSizes)}
            />

            {/* SHIPPING */}
            <FormSelect
              name="country"
              label="Country"
              placeholder="Select country"
              options={countryOptions}
            />

            <FormSelect
              name="state"
              label="State"
              placeholder="Select state"
              options={stateOptions}
              disabled={!stateOptions.length}
            />

            <FormInput name="city" label="City" placeholder="e.g. Ikeja" />

            <FormInput
              name="shipping_cost"
              label="Shipping Cost"
              type="number"
              placeholder="Optional"
            />

            <FormInput
              name="shipping_note"
              label="Shipping Note"
              placeholder="Delivery takes 3–5 business days"
            />

            <FormInput
              name="returns_note"
              label="Returns Policy"
              placeholder="7-day return policy applies"
            />

            <Button type="submit" className="w-full">
              Preview Product Payload
            </Button>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}
