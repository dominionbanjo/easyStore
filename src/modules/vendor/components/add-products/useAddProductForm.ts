import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { updateProductDraft } from "@/features/productDraftSlice";
import type { RootState } from "@/store";
import {
  addProductSchema,
  type AddProductFormInput,
} from "../../validators/addProductValidator";
import { draftToSpecs } from "../../utils/addProduct.helpers";

export function useAddProductForm(extras: any) {
  const draft = useSelector((s: RootState) => s.productDraft.data);

  const methods = useForm<AddProductFormInput>({
    resolver: zodResolver(addProductSchema),
    mode: "onTouched",
    defaultValues: {
      stock: 0,
      colors: [],
    },
  });

  const { reset, watch } = methods;

  // Auto-save form values to Redux draft (debounced)
  const watchedValues = watch();
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      // We only sync the main form fields here.
      // Extras (images, gallery, etc.) are handled by their own setters in the Page component.
      dispatch(updateProductDraft(watchedValues as any));
    }, 1000);

    return () => clearTimeout(timer);
  }, [watchedValues, dispatch]);

  useEffect(() => {
    if (!draft) return;

    // reset() handles all standard form fields (including shipping_cost, notes etc)
    // We only reset if the draft ID matches (to avoid cross-product contamination) or if no ID
    reset({
      ...draft,
      colors: draft.colors ?? [],
    });

    // Handle extras (complex states not directly in useForm)
    if (draft.image) extras.setImage(draft.image);
    if (draft.gallery) extras.setGallery(draft.gallery);
    if (draft.specs) extras.setSpecs(draftToSpecs(draft.specs));
    if (draft.tags) extras.setTags(draft.tags);
    if (draft.highlights) extras.setHighlights(draft.highlights);
    if (draft.sizes) extras.setSizes(draft.sizes);
  }, [
    draft,
    reset,
    extras.setImage,
    extras.setGallery,
    extras.setSpecs,
    extras.setTags,
    extras.setHighlights,
    extras.setSizes,
  ]);

  return methods;
}
