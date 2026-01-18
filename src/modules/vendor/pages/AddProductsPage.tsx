import { FormProvider } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { setProductDraft } from "@/features/productDraftSlice";
import { useCreateProductWithCloudinaryMutation } from "@/services/productApi";

import { buildSpecsObject } from "../utils/addProduct.helpers";
import { buildCreateProductPayload } from "@/utils/draftToFormValues";
import { assertCreateProductValues } from "@/utils/assertCreateProductValues";

import { useProductExtras } from "../components/add-products/useProductExtras";
import { useAddProductForm } from "../components/add-products/useAddProductForm";
import { useLocationOptions } from "../components/add-products/useLocationOptions";

import { BasicInfoSection } from "../components/add-products/BasicInfoSection";
import { ActionsSection } from "../components/add-products/ActionsSection";
import { ChipsSection } from "../components/add-products/ChipsSection";
import { ImageSection } from "../components/add-products/ImageSection";
import { PricingSection } from "../components/add-products/PricingSection";
import { ShippingSection } from "../components/add-products/ShippingSection";
import { SpecsSection } from "../components/add-products/SpecsSection";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function AddProductPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const extras = useProductExtras();
  const methods = useAddProductForm(extras);

  const { watch, setValue, handleSubmit } = methods;

  const country = watch("country") ?? "";
  const state = watch("state") ?? "";

  const { countries, states } = useLocationOptions(country, state, setValue);

  const [createProduct, { isLoading: creating }] =
    useCreateProductWithCloudinaryMutation();

  const { image, gallery, specs: specItems, tags, highlights, sizes } = extras;

  const onPreview = (values: any) => {
    dispatch(
      setProductDraft({
        ...values,
        image,
        gallery,
        tags,
        highlights,
        sizes,
        specs: buildSpecsObject(specItems),
      }),
    );

    navigate("/vendor/products/preview");
  };

  const onCreate = handleSubmit(async (values) => {
    // 🔒 Ensure required numeric fields exist
    assertCreateProductValues(values);

    // ❌ MAIN IMAGE REQUIRED
    if (!image) {
      toast.error("Please upload a main product image");
      return;
    }

    // ❌ AT LEAST 2 GALLERY IMAGES
    if (!gallery || gallery.length < 2) {
      toast.error("Please upload at least 2 additional product images");
      return;
    }

    const payload = buildCreateProductPayload({
      values,

      // ✅ PASS LOCATION EXPLICITLY
      country: values.country,
      state: values.state,
      city: values.city,

      image,
      gallery,
      tags,
      highlights,
      sizes,
      specItems,
    });

    await createProduct(payload).unwrap();
    navigate("/vendor/products");
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onPreview)}>
        <Card>
          <Link
            to="/vendor/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>
          <CardHeader>
            <CardTitle>Add Product</CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            <BasicInfoSection />
            <ImageSection {...extras} />
            <PricingSection />
            <SpecsSection {...extras} />
            <ChipsSection {...extras} />
            <ShippingSection countries={countries} states={states} />
            <ActionsSection creating={creating} onCreate={onCreate} />
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}

// import { useEffect, useState } from "react";
// import { FormProvider, useForm } from "react-hook-form";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// import { FormInput } from "@/components/shared/form/FormInput";
// import { FormSelect } from "@/components/shared/form/FormSelect";
// import { FormTextarea } from "@/components/shared/form/FormTextarea";

// import ChipSection from "../components/add-products/ChipSection";
// import ImageUploadSection, {
//   type UploadedImage,
// } from "../components/add-products/ImageUploadSection";
// import SpecificationsSection from "../components/add-products/SpecificationsSection";
// import { CategorySelect } from "@/components/shared/form/CategorySelect";
// import { ColorMultiSelect } from "@/components/shared/form/ColorMultiSelect";

// import type { FormValues, SpecItem } from "../types/vendorTypes";
// import type { RootState } from "@/store";
// import { setProductDraft } from "@/features/productDraftSlice";

// import {
//   loadCountries,
//   loadStates,
//   addSpec,
//   updateSpec,
//   removeSpec,
//   addChip,
//   removeChip,
//   buildSpecsObject,
//   draftToSpecs,
// } from "../utils/addProduct.helpers";

// import { useCreateProductWithCloudinaryMutation } from "@/services/productApi";

// /* ───────────────── PAGE ───────────────── */

// export default function AddProductPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const draft = useSelector((s: RootState) => s.productDraft.data);

//   const [createProduct, { isLoading: creating }] =
//     useCreateProductWithCloudinaryMutation();

//   const methods = useForm<FormValues>({
//     defaultValues: {
//       stock: 0,
//       country: "NG",
//       colors: [],
//     },
//   });

//   const { handleSubmit, watch, setValue, reset, getValues } = methods;
//   const selectedCountry = watch("country");

//   const [countryOptions, setCountryOptions] = useState<any[]>([]);
//   const [stateOptions, setStateOptions] = useState<any[]>([]);

//   const [image, setImage] = useState<UploadedImage | null>(null);
//   const [gallery, setGallery] = useState<UploadedImage[]>([]);
//   const [specs, setSpecs] = useState<SpecItem[]>([]);

//   const [tags, setTags] = useState<string[]>([]);
//   const [highlights, setHighlights] = useState<string[]>([]);
//   const [sizes, setSizes] = useState<string[]>([]);

//   /* ───────── HYDRATE DRAFT ───────── */
//   useEffect(() => {
//     if (!draft) return;

//     reset({
//       ...draft,
//       country: draft.country ?? "NG",
//       state: draft.state ?? "",
//       city: draft.city ?? "",
//       colors: draft.colors ?? [],
//     });

//     setImage(draft.image ?? null);
//     setGallery(draft.gallery ?? []);
//     setSpecs(draftToSpecs(draft.specs));
//     setTags(draft.tags ?? []);
//     setHighlights(draft.highlights ?? []);
//     setSizes(draft.sizes ?? []);
//   }, [draft, reset]);

//   /* ───────── LOAD COUNTRIES ───────── */
//   useEffect(() => {
//     loadCountries().then(setCountryOptions);
//   }, []);

//   /* ───────── LOAD STATES (FIXED) ───────── */
//   useEffect(() => {
//     if (!selectedCountry) return;

//     loadStates(selectedCountry).then((states) => {
//       setStateOptions(states);

//       const draftState = draft?.state;
//       const currentState = getValues("state");

//       // ✅ Re-select draft state if valid
//       if (draftState && states.some((s) => s.value === draftState)) {
//         setValue("state", draftState, {
//           shouldDirty: false,
//           shouldTouch: false,
//         });
//         return;
//       }

//       // 🔒 Clear ONLY if invalid
//       if (currentState && !states.some((s) => s.value === currentState)) {
//         setValue("state", "");
//       }
//     });
//   }, [selectedCountry, draft?.state, getValues, setValue]);

//   /* ───────── PREVIEW ───────── */
//   const onPreview = (values: FormValues) => {
//     dispatch(
//       setProductDraft({
//         ...values,
//         country: values.country,
//         state: values.state || "",
//         city: values.city || "",
//         specs: buildSpecsObject(specs),
//         image,
//         gallery,
//         tags,
//         highlights,
//         sizes,
//       }),
//     );

//     navigate("/vendor/products/preview");
//   };

//   /* ───────── CREATE PRODUCT ───────── */
//   const onCreate = async () => {
//     const values = getValues();

//     if (!values.country || !values.state) {
//       alert("Please select both country and state");
//       return;
//     }

//     await createProduct({
//       ...values,
//       specs: buildSpecsObject(specs),
//       image,
//       gallery,
//       tags,
//       highlights,
//       sizes,
//       colors: values.colors.map((c) => c.id),
//     }).unwrap();

//     navigate("/vendor/products");
//   };

//   /* ───────── RENDER ───────── */
//   return (
//     <FormProvider {...methods}>
//       <form onSubmit={handleSubmit(onPreview)} className="space-y-2">
//         <Card>
//           <CardHeader>
//             <CardTitle>Add Product</CardTitle>
//           </CardHeader>

//           <CardContent className="space-y-8">
//             {/* BASIC INFO */}
//             <FormInput
//               name="name"
//               label="Product Name"
//               placeholder="e.g. Solid Wooden Dining Table"
//             />

//             {/* IMAGES */}
//             <ImageUploadSection
//               image={image}
//               gallery={gallery}
//               onMainUploaded={setImage}
//               onGalleryUploaded={(imgs) =>
//                 setGallery((prev) => [...prev, ...imgs])
//               }
//               onRemoveGallery={(i) =>
//                 setGallery((prev) => prev.filter((_, idx) => idx !== i))
//               }
//             />

//             {/* CATEGORY */}
//             <CategorySelect name="category_id" />

//             {/* DESCRIPTION */}
//             <FormTextarea
//               name="description"
//               label="Description"
//               rows={4}
//               placeholder="e.g. A premium handcrafted dining table made from solid oak wood, perfect for family gatherings"
//             />

//             {/* COLORS */}
//             <ColorMultiSelect name="colors" />

//             {/* PRICING */}
//             <div className="grid grid-cols-2 gap-4">
//               <FormInput
//                 name="price"
//                 label="Price"
//                 type="number"
//                 placeholder="e.g. 150000"
//               />
//               <FormInput
//                 name="discount_price"
//                 label="Discount Price"
//                 type="number"
//                 placeholder="e.g. 135000 (optional)"
//               />
//             </div>

//             <FormInput
//               name="stock"
//               label="Stock Quantity"
//               type="number"
//               placeholder="e.g. 12"
//             />

//             {/* SPECS */}
//             <SpecificationsSection
//               specs={specs}
//               onAdd={() => addSpec(setSpecs)}
//               onUpdate={(i, f, v) => updateSpec(setSpecs, i, f, v)}
//               onRemove={(i) => removeSpec(setSpecs, i)}
//             />

//             {/* CHIPS */}
//             <ChipSection
//               label="Tags"
//               values={tags}
//               onAdd={(v) => addChip(v, setTags)}
//               onRemove={(v) => removeChip(v, setTags)}
//             />

//             <ChipSection
//               label="Highlights"
//               values={highlights}
//               onAdd={(v) => addChip(v, setHighlights)}
//               onRemove={(v) => removeChip(v, setHighlights)}
//             />

//             <ChipSection
//               label="Sizes"
//               values={sizes}
//               onAdd={(v) => addChip(v, setSizes)}
//               onRemove={(v) => removeChip(v, setSizes)}
//             />

//             {/* SHIPPING */}
//             <FormSelect
//               name="country"
//               label="Country"
//               options={countryOptions}
//             />

//             <FormSelect
//               name="state"
//               label="State"
//               options={stateOptions}
//               disabled={!stateOptions.length}
//             />

//             <FormInput
//               name="city"
//               label="City"
//               placeholder="e.g. Ikeja, Wuse, Lekki"
//             />

//             <FormInput
//               name="shipping_cost"
//               label="Shipping Cost"
//               type="number"
//               placeholder="e.g. 2000 (leave empty for calculated shipping)"
//             />

//             <FormInput
//               name="shipping_note"
//               label="Shipping Note"
//               placeholder="e.g. Delivery within 3–5 business days"
//             />

//             <FormInput
//               name="returns_note"
//               label="Returns Policy"
//               placeholder="e.g. 7-day return policy applies"
//             />

//             {/* ACTIONS */}
//             <div className="flex gap-4">
//               <Button type="submit" variant="outline" className="flex-1">
//                 Preview Product
//               </Button>

//               <Button
//                 type="button"
//                 className="flex-1"
//                 onClick={onCreate}
//                 disabled={creating}
//               >
//                 {creating ? "Creating…" : "Create Product"}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </form>
//     </FormProvider>
//   );
// }
