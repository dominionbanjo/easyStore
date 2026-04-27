import { useState } from "react";
import type { UploadedImage } from "./ImageUploadSection";
import type { SpecItem } from "./SpecificationsSection";

import { useStoreSetup } from "@/modules/vendor/hooks/useStoreSetup";

export function useProductExtras() {
  const { store } = useStoreSetup();
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [gallery, setGallery] = useState<UploadedImage[]>([]);
  const [specs, setSpecs] = useState<SpecItem[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);

  return {
    store,
    image,
    gallery,
    specs,
    tags,
    highlights,
    setImage,
    setGallery,
    setSpecs,
    setTags,
    setHighlights,
  };
}
export type ProductExtras = ReturnType<typeof useProductExtras>;
