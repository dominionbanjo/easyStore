import { useState } from "react";
import type { UploadedImage } from "./ImageUploadSection";
import type { SpecItem } from "./SpecificationsSection";

export function useProductExtras() {
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [gallery, setGallery] = useState<UploadedImage[]>([]);
  const [specs, setSpecs] = useState<SpecItem[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);

  return {
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
