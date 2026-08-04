import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProductDraft,
  type ProductDraftData,
} from "@/features/productDraftSlice";
import type { RootState } from "@/store";
import {
  addProductSchema,
  type AddProductFormInput,
} from "../../validators/addProductValidator";
import { buildSpecsObject, draftToSpecs } from "../../utils/addProduct.helpers";
import type { ProductExtras } from "./useProductExtras";
import { useSaveProductDraftMutation } from "@/services/productApi";
import type { SaveProductDraftArgs } from "@/types/product/productTypes";

export function useAddProductForm(extras: ProductExtras) {
  const draft = useSelector((s: RootState) => s.productDraft.data);
  const dispatch = useDispatch();
  const hasHydrated = useRef(false);
  const draftIdRef = useRef<string | undefined>(undefined);
  const skipNextSync = useRef(false);

  const [saveProductDraft, { isLoading: isSavingDraft }] =
    useSaveProductDraftMutation();

  const methods = useForm<AddProductFormInput>({
    resolver: zodResolver(addProductSchema),
    mode: "onTouched",
    defaultValues: {
      stock: undefined,
      price: undefined,
      discount_price: undefined,
    },
  });

  const { reset, getValues, trigger } = methods;

  const { setImage, setGallery, setSpecs, setTags, setHighlights } = extras;

  /**
   * Builds the draft payload from the current form values and extras.
   * Images always carry their live Cloudinary URLs (uploaded at selection time).
   * Raw form values are coerced so numeric fields (price/stock) never reach the
   * backend as strings, and incomplete variant rows are omitted (the backend
   * preserves the last persisted state until the draft is published).
   */
  const buildDraftPayload = useCallback((): SaveProductDraftArgs => {
    const toNum = (v: unknown): number | undefined =>
      v === "" || v === null || v === undefined ? undefined : Number(v);

    const currentValues = getValues() as Record<string, unknown>;
    const rawVariants = (currentValues.variants ?? []) as unknown[];

    const allVariantsComplete =
      rawVariants.length > 0 &&
      rawVariants.every(
        (v) =>
          v &&
          typeof v === "object" &&
          "combinations" in v &&
          (v as { combinations?: unknown }).combinations &&
          toNum((v as { price?: unknown }).price) !== undefined &&
          toNum((v as { stock?: unknown }).stock) !== undefined,
      );

    const variants = allVariantsComplete
      ? rawVariants.map((v) => ({
          ...(v as object),
          price: toNum((v as { price?: unknown }).price),
          stock: toNum((v as { stock?: unknown }).stock),
          discount_price: toNum(
            (v as { discount_price?: unknown }).discount_price,
          ),
        }))
      : undefined;

    const valuesToSync = {
      id: currentValues.id,
      name: currentValues.name,
      category_id: currentValues.category_id,
      description: currentValues.description,
      barcode: currentValues.barcode,
      price: toNum(currentValues.price),
      discount_price: toNum(currentValues.discount_price),
      stock: toNum(currentValues.stock),
      shipping_note: currentValues.shipping_note,
      returns_note: currentValues.returns_note,
      options: currentValues.options,
      variants,
      image: extras.image,
      gallery: extras.gallery,
      specs: buildSpecsObject(extras.specs),
      tags: extras.tags,
      highlights: extras.highlights,
    };

    return structuredClone({
      ...(valuesToSync as unknown as SaveProductDraftArgs),
      id: draftIdRef.current ?? draft?.id,
    });
  }, [getValues, extras.image, extras.gallery, extras.specs, extras.tags, extras.highlights, draft?.id]);

  /**
   * Persists the current working copy to the backend draft (silent — no
   * saving indicator). Falls back to local-only persistence on failure so
   * the next sync retries.
   */
  /**
   * Checks whether the form has any meaningful content worth saving.
   * Used by both auto-save (silent) and manual save (toasted).
   */
  const hasFormContent = useCallback(() => {
    const currentValues = getValues();
    return Boolean(
      currentValues.name?.trim() ||
        currentValues.category_id ||
        currentValues.price != null ||
        currentValues.stock != null ||
        extras.image ||
        (extras.gallery && extras.gallery.length > 0) ||
        (extras.tags && extras.tags.length > 0) ||
        (extras.highlights && extras.highlights.length > 0),
    );
  }, [getValues, extras.image, extras.gallery, extras.tags, extras.highlights]);

  const syncDraft = useCallback(async () => {
    if (!hasHydrated.current) return;
    if (skipNextSync.current) {
      skipNextSync.current = false;
      return;
    }

    if (!hasFormContent()) return;

    const payload = buildDraftPayload();

    dispatch(updateProductDraft(payload as unknown as Partial<ProductDraftData>));

    try {
      const res = await saveProductDraft(payload).unwrap();
      if (res?.id) {
        draftIdRef.current = res.id;
        dispatch(updateProductDraft({ id: res.id, syncedToBackend: true }));
      }
    } catch {
      // Silent: draft stays local and will retry on the next sync.
    }
  }, [
    dispatch,
    getValues,
    buildDraftPayload,
    saveProductDraft,
    hasFormContent,
  ]);

  /** Manual "Save as Draft" action with explicit feedback. */
  const saveDraftNow = useCallback(async () => {
    if (!hasHydrated.current) return;
    if (!hasFormContent()) {
      throw new Error("Cannot save an empty draft");
    }
    const payload = buildDraftPayload();
    try {
      const res = await saveProductDraft(payload).unwrap();
      if (res?.id) {
        draftIdRef.current = res.id;
        dispatch(updateProductDraft({ id: res.id, syncedToBackend: true }));
      }
      skipNextSync.current = true;
      return res;
    } catch {
      throw new Error("Failed to save draft");
    }
  }, [dispatch, hasFormContent, buildDraftPayload, saveProductDraft]);

  // Auto-save to backend every 40s (silent, no indicator)
  useEffect(() => {
    if (!hasHydrated.current) return;

    const timer = setInterval(() => {
      void syncDraft();
    }, 40000);

    return () => clearInterval(timer);
  }, [syncDraft]);

  // Sync / Hydrate from Draft
  useEffect(() => {
    // Draft was cleared — reset form to empty and allow fresh hydration
    if (!draft) {
      hasHydrated.current = false;
      draftIdRef.current = undefined;
      reset({
        stock: null,
        price: null,
        discount_price: null,
      } as unknown as AddProductFormInput);
      setImage(null);
      setGallery([]);
      setSpecs([]);
      setTags([]);
      setHighlights([]);
      hasHydrated.current = true;
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

    draftIdRef.current = draft.id;

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
    if (draft.image) setImage(draft.image);
    if (draft.gallery) setGallery(draft.gallery);
    if (draft.specs) setSpecs(draftToSpecs(draft.specs));
    if (draft.tags) setTags(draft.tags);
    if (draft.highlights) setHighlights(draft.highlights);
  }, [
    draft,
    reset,
    trigger,
    setImage,
    setGallery,
    setSpecs,
    setTags,
    setHighlights,
    getValues,
  ]);

  /** Cancel the next auto-sync (call before navigating away). */
  const cancelSync = useCallback(() => {
    skipNextSync.current = true;
  }, []);

  return {
    ...methods,
    saveDraftNow,
    isSavingDraft,
    cancelSync,
  };
}
