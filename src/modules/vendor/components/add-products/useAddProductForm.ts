import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { updateProductDraft, setSyncing } from "@/features/productDraftSlice";
import type { RootState } from "@/store";
import {
  addProductSchema,
  type AddProductFormInput,
} from "../../validators/addProductValidator";
import { draftToSpecs } from "../../utils/addProduct.helpers";

export function useAddProductForm(extras: any) {
  const draft = useSelector((s: RootState) => s.productDraft.data);
  const dispatch = useDispatch();
  const hasHydrated = useRef(false);

  const methods = useForm<AddProductFormInput>({
    resolver: zodResolver(addProductSchema),
    mode: "onTouched",
    defaultValues: {
      stock: 0,
    },
  });

  const { reset, watch, getValues } = methods;
  const watchedValues = watch();

  // Auto-save form values to Redux draft (debounced)
  useEffect(() => {
    if (!hasHydrated.current) return;

    dispatch(setSyncing(true));
    const timer = setTimeout(() => {
      dispatch(updateProductDraft(watchedValues as any));
      dispatch(setSyncing(false));
    }, 1000);

    return () => clearTimeout(timer);
  }, [watchedValues, dispatch]);

  // Sync / Hydrate from Draft
  useEffect(() => {
    if (!draft) return;

    // IMPORTANT: Only reset if the draft represents a different product
    // or if we haven't hydrated at all yet.
    // This prevents focus loss caused by reset() during auto-saves.
    const currentId = getValues("id" as any);

    // Check if product is the same (handles both having same ID or both being undefined/new)
    if (hasHydrated.current && currentId === draft.id) {
      return;
    }

    reset({
      ...draft,
      colors: draft.colors ? [...draft.colors] : [],
      variants: draft.variants
        ? draft.variants.map((v: any) => ({ ...v }))
        : [],
      tags: draft.tags ? [...draft.tags] : [],
      highlights: draft.highlights ? [...draft.highlights] : [],
      sizes: draft.sizes ? [...draft.sizes] : [],
    } as any);

    hasHydrated.current = true;

    // Handle extras (complex states managed by parent)
    if (draft.image) extras.setImage(draft.image);
    if (draft.gallery) extras.setGallery(draft.gallery);
    if (draft.specs) extras.setSpecs(draftToSpecs(draft.specs));
    if (draft.tags) extras.setTags(draft.tags);
    if (draft.highlights) extras.setHighlights(draft.highlights);
  }, [
    draft,
    reset,
    extras.setImage,
    extras.setGallery,
    extras.setSpecs,
    extras.setTags,
    extras.setHighlights,
    getValues,
  ]);

  return methods;
}
