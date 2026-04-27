import ImageUploadSection from "./ImageUploadSection";
import type { ProductExtras } from "./useProductExtras";

type Props = Pick<
  ProductExtras,
  "image" | "gallery" | "setImage" | "setGallery"
> & { storeSlug?: string };

export function ImageSection({
  image,
  gallery,
  setImage,
  setGallery,
  storeSlug,
}: Props) {
  return (
    <ImageUploadSection
      image={image}
      gallery={gallery}
      onMainUploaded={setImage}
      onGalleryUploaded={(imgs) => setGallery((prev) => [...prev, ...imgs])}
      onRemoveGallery={(i) =>
        setGallery((prev) => prev.filter((_, idx) => idx !== i))
      }
      storeSlug={storeSlug}
    />
  );
}
