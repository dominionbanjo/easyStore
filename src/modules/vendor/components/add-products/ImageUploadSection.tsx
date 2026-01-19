import { Plus, X, Image as ImageIcon, Upload } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";

import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import {
  useGetCloudinarySignatureQuery,
  useDeleteCloudinaryImageMutation,
} from "@/services/cloudinaryApi";
import type { CloudinaryConfig } from "@/services/cloudinaryApi";

export type UploadedImage = {
  url: string;
  public_id: string;
};

interface ImageUploadSectionProps {
  image: UploadedImage | null;
  gallery: UploadedImage[];

  onMainUploaded: (image: UploadedImage | null) => void;
  onGalleryUploaded: (images: UploadedImage[]) => void;
  onRemoveGallery: (index: number) => void;
}

export default function ImageUploadSection({
  image,
  gallery,
  onMainUploaded,
  onGalleryUploaded,
  onRemoveGallery,
}: ImageUploadSectionProps) {
  const {
    data: signature,
    isLoading: signing,
    isError,
    refetch,
  } = useGetCloudinarySignatureQuery();

  const [deleteImage, { isLoading: deleting }] =
    useDeleteCloudinaryImageMutation();

  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const canUpload = Boolean(signature?.signature) && !signing && !isError;

  /* ───────── UPLOAD ───────── */

  const uploadMain = async (file: File, input?: HTMLInputElement) => {
    if (!canUpload) return;

    // 🔐 Always ensure fresh signature
    const fresh = await refetch().unwrap();

    setUploadingMain(true);
    try {
      const uploaded = await uploadToCloudinary(
        file,
        fresh as CloudinaryConfig,
      );
      onMainUploaded(uploaded);
    } finally {
      setUploadingMain(false);
      if (input) input.value = "";
    }
  };

  const uploadGallery = async (files: FileList, input?: HTMLInputElement) => {
    if (!canUpload) return;

    const fresh = await refetch().unwrap();

    setUploadingGallery(true);
    try {
      const uploads = await Promise.all(
        Array.from(files).map((file) =>
          uploadToCloudinary(file, fresh as CloudinaryConfig),
        ),
      );
      onGalleryUploaded(uploads);
    } finally {
      setUploadingGallery(false);
      if (input) input.value = "";
    }
  };

  /* ───────── DELETE ───────── */

  const removeMainImage = async () => {
    if (!image || deleting) return;

    try {
      await deleteImage({ public_id: image.public_id }).unwrap();
      onMainUploaded(null);
    } catch (err) {
      console.error("Failed to delete image", err);
    }
  };

  const removeGalleryImage = async (index: number) => {
    const img = gallery[index];
    if (!img || deleting) return;

    try {
      await deleteImage({ public_id: img.public_id }).unwrap();
      onRemoveGallery(index);
    } catch (err) {
      console.error("Failed to delete image", err);
    }
  };

  /* ───────────────── RENDER ───────────────── */

  return (
    <div className="space-y-6">
      {/* ─── MAIN IMAGE ─── */}
      <div className="space-y-2">
        <Label>Main Image</Label>

        <label className="group relative flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-6 cursor-pointer hover:bg-muted/40">
          {image ? (
            <div className="relative">
              <img
                src={image.url}
                alt="Main product"
                className="w-44 h-44 object-cover rounded-md"
              />

              <button
                type="button"
                onClick={removeMainImage}
                disabled={deleting}
                className="absolute -top-2 -right-2 bg-background rounded-full p-1 shadow"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-md flex items-center justify-center">
                <Upload className="h-6 w-6 text-white" />
              </div>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <ImageIcon className="h-7 w-7 text-muted-foreground" />
              </div>

              <p className="text-sm text-muted-foreground text-center">
                {signing
                  ? "Preparing upload…"
                  : uploadingMain
                    ? "Uploading image…"
                    : "Upload main product image"}
              </p>
            </>
          )}

          <input
            hidden
            type="file"
            accept="image/*"
            disabled={!canUpload || uploadingMain}
            onChange={(e) =>
              e.target.files && uploadMain(e.target.files[0], e.target)
            }
          />
        </label>
      </div>

      {/* ─── GALLERY ─── */}
      <div className="space-y-2">
        <Label>Gallery</Label>

        <div className="flex gap-3 flex-wrap">
          {gallery.map((g, i) => (
            <div key={g.public_id} className="relative group">
              <img
                src={g.url}
                alt={`Gallery ${i + 1}`}
                className="w-24 h-24 object-cover rounded-md"
              />

              <button
                type="button"
                onClick={() => removeGalleryImage(i)}
                disabled={deleting}
                className="absolute -top-2 -right-2 bg-background rounded-full p-1 shadow"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          <label className="w-24 h-24 border border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/40">
            <Plus className="h-5 w-5" />
            <span className="text-[11px] text-muted-foreground mt-1">
              {uploadingGallery ? "Uploading…" : "Add images"}
            </span>

            <input
              hidden
              type="file"
              accept="image/*"
              multiple
              disabled={!canUpload || uploadingGallery}
              onChange={(e) =>
                e.target.files && uploadGallery(e.target.files, e.target)
              }
            />
          </label>
        </div>
      </div>
    </div>
  );
}
