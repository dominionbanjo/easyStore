"use client";

import { useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  setProductDraft,
  clearProductDraft,
} from "@/features/productDraftSlice";
import {
  useCreateProductWithCloudinaryMutation,
  useGetSingleProductQuery,
  useUpdateProductWithCloudinaryMutation,
} from "@/services/productApi";
import { buildSpecsObject } from "../utils/addProduct.helpers";
import { buildCreateProductPayload } from "@/utils/draftToFormValues";
import { productToDraft } from "../utils/productToDraft";
import { specsObjectToItems } from "../utils/specsObjectToItems";
import { useProductExtras } from "../components/add-products/useProductExtras";
import { useAddProductForm } from "../components/add-products/useAddProductForm";
import { BasicInfoSection } from "../components/add-products/BasicInfoSection";
import { ActionsSection } from "../components/add-products/ActionsSection";
import { ChipsSection } from "../components/add-products/ChipsSection";
import { ImageSection } from "../components/add-products/ImageSection";
import { PricingSection } from "../components/add-products/PricingSection";
import { ShippingSection } from "../components/add-products/ShippingSection";
import { SpecsSection } from "../components/add-products/SpecsSection";

export default function AddProductPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();

  const isEditMode = Boolean(slug);

  /* ───────── FORM ───────── */
  const extras = useProductExtras();
  const methods = useAddProductForm(extras);
  const {
    setValue,
    handleSubmit,
    formState: { isValid },
  } = methods;

  const draft = useSelector((s: RootState) => s.productDraft.data);

  /* ───────── API ───────── */
  const { data: productData, isLoading: loadingProduct } =
    useGetSingleProductQuery(slug!, { skip: !isEditMode });

  const productId = productData?.data?.product?.id;

  const [createProduct, { isLoading: creating }] =
    useCreateProductWithCloudinaryMutation();

  const [updateProduct, { isLoading: updating }] =
    useUpdateProductWithCloudinaryMutation();

  const { image, gallery, specs: specItems, tags, highlights, sizes } = extras;

  /* ───────── HYDRATE EDIT MODE ───────── */
  useEffect(() => {
    if (!isEditMode || !productData?.data?.product) return;

    // Use draft if available (e.g. returning from preview)
    if (draft && draft.id === productData.data.product.id) {
      return;
    }

    const { values, extras: normalizedExtras } = productToDraft(
      productData.data.product,
    );

    Object.entries(values).forEach(([key, value]) =>
      setValue(key as any, value),
    );

    extras.setImage(normalizedExtras.image);
    extras.setGallery(normalizedExtras.gallery);
    extras.setTags(normalizedExtras.tags);
    extras.setHighlights(normalizedExtras.highlights);
    extras.setSizes(normalizedExtras.sizes);
    extras.setSpecs(specsObjectToItems(normalizedExtras.specs));

    dispatch(
      setProductDraft({
        ...values,
        ...normalizedExtras,
        id: productData.data.product.id,
      }),
    );
  }, [isEditMode, productData]);

  /* ───────── PREVIEW ───────── */
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
        id: productId,
      }),
    );

    navigate("/vendor/products/preview");
  };

  /* ───────── SUBMIT ───────── */
  const onSubmit = handleSubmit(async (rawValues) => {
    const values = rawValues as any; // safe after validation

    // assertCreateProductValues(values); // Removed: Zod handles validation

    if (!image) return toast.error("Upload a main product image");
    if (!gallery || gallery.length < 2)
      return toast.error("Upload at least 2 gallery images");

    const payload = buildCreateProductPayload({
      values,
      image,
      gallery,
      tags,
      highlights,
      sizes,
      specItems,
    });

    try {
      if (isEditMode) {
        await updateProduct({ id: productId!, data: payload }).unwrap();
        toast.success("Product updated successfully");
      } else {
        await createProduct(payload).unwrap();
        toast.success("Product created successfully");
      }

      dispatch(clearProductDraft());
      navigate("/vendor/products");
    } catch {
      toast.error("Something went wrong");
    }
  });

  /* ───────── LOADING ───────── */
  if (isEditMode && loadingProduct) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  const canSubmit = isValid && !!image && !!gallery && gallery.length >= 2;

  /* ───────── UI ───────── */
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onPreview)}>
        <Card>
          <Link
            to="/vendor/products"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>

          <CardHeader>
            <CardTitle>
              {isEditMode ? "Edit Product" : "Add Product to Store"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            <BasicInfoSection />
            <ImageSection {...extras} />
            <PricingSection />
            <SpecsSection {...extras} />
            <ChipsSection {...extras} />
            <ShippingSection />

            <ActionsSection
              creating={creating || updating}
              onCreate={onSubmit}
              submitLabel={isEditMode ? "Update Product" : "Create Product"}
              disabled={!canSubmit}
            />
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}
