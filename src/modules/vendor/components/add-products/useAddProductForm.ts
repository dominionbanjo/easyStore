import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProductDraft,
  setSyncing,
  type ProductDraftData,
} from "@/features/productDraftSlice";
import type { RootState } from "@/store";
import {
  addProductSchema,
  type AddProductFormInput,
} from "../../validators/addProductValidator";
import { draftToSpecs } from "../../utils/addProduct.helpers";
import type { ProductExtras } from "./useProductExtras";

export function useAddProductForm(extras: ProductExtras) {
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

  const { reset, watch, getValues, trigger } = methods;
  const watchedValues = watch();

  // Auto-save form values to Redux draft (debounced)
  useEffect(() => {
    if (!hasHydrated.current) return;

    dispatch(setSyncing(true));
    const timer = setTimeout(() => {
      // We deep clone to prevent Redux/Immer from freezing the objects
      // that React Hook Form is still using internally.
      // structuredClone is preferred as it handles undefined values better than JSON.parse/stringify.
      const valuesToSync = structuredClone(watchedValues);
      dispatch(
        updateProductDraft(
          valuesToSync as unknown as Partial<ProductDraftData>,
        ),
      );
      dispatch(setSyncing(false));
    }, 1000);

    return () => clearTimeout(timer);
  }, [watchedValues, dispatch]);

  // Sync / Hydrate from Draft
  useEffect(() => {
    // Draft was cleared — reset form to empty and allow fresh hydration
    if (!draft) {
      hasHydrated.current = false;
      reset({ stock: 0 } as AddProductFormInput);
      extras.setImage(null);
      extras.setGallery([]);
      extras.setSpecs([]);
      extras.setTags([]);
      extras.setHighlights([]);
      return;
    }

    // IMPORTANT: Only reset if the draft represents a different product
    // or if we haven't hydrated at all yet.
    // This prevents focus loss caused by reset() during auto-saves.
    const currentId = getValues("id");

    // Check if product is the same (handles both having same ID or both being undefined/new)
    if (hasHydrated.current && currentId === draft.id) {
      return;
    }

    reset({
      ...draft,
      colors: draft.colors ? [...draft.colors] : [],
      variants: draft.variants ? draft.variants.map((v) => ({ ...v })) : [],
      options: draft.options ? draft.options.map((o) => ({ ...o })) : [],
      tags: draft.tags ? [...draft.tags] : [],
      highlights: draft.highlights ? [...draft.highlights] : [],
      sizes: draft.sizes ? [...draft.sizes] : [],
    } as AddProductFormInput);

    // Trigger validation so isValid reflects the hydrated data immediately.
    // Without this, mode:"onTouched" keeps isValid=false because no fields
    // have been interacted with by the user.
    setTimeout(() => trigger(), 0);

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
    trigger,
    extras.setImage,
    extras.setGallery,
    extras.setSpecs,
    extras.setTags,
    extras.setHighlights,
    getValues,
  ]);

  return methods;
}
