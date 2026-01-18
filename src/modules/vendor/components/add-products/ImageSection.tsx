import ImageUploadSection from "./ImageUploadSection";

export function ImageSection({ image, gallery, setImage, setGallery }: any) {
  return (
    <ImageUploadSection
      image={image}
      gallery={gallery}
      onMainUploaded={setImage}
      onGalleryUploaded={(imgs) =>
        setGallery((prev: any[]) => [...prev, ...imgs])
      }
      onRemoveGallery={(i) =>
        setGallery((prev: any[]) => prev.filter((_, idx) => idx !== i))
      }
    />
  );
}
