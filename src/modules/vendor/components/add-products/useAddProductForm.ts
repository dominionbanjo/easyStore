import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";

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

  const { reset } = methods;

  useEffect(() => {
    if (!draft) return;

    reset({
      ...draft,
      colors: draft.colors ?? [],
    });

    extras.setImage(draft.image ?? null);
    extras.setGallery(draft.gallery ?? []);
    extras.setSpecs(draftToSpecs(draft.specs));
    extras.setTags(draft.tags ?? []);
    extras.setHighlights(draft.highlights ?? []);
    extras.setSizes(draft.sizes ?? []);
  }, [draft, reset]);

  return methods;
}
