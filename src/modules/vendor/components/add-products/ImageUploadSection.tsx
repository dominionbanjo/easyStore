import { Plus, X, Image as ImageIcon, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";

export type LocalImage = {
  file: File;
  preview: string;
};

interface ImageUploadSectionProps {
  image: LocalImage | null;
  gallery: LocalImage[];
  onMainImageChange: (file: File) => void;
  onGalleryAdd: (file: File) => void;
  onRemoveMain: () => void;
  onRemoveGallery: (index: number) => void;
}

export default function ImageUploadSection({
  image,
  gallery,
  onMainImageChange,
  onGalleryAdd,
  onRemoveMain,
  onRemoveGallery,
}: ImageUploadSectionProps) {
  return (
    <div className="space-y-6">
      {/* ─── Main Image ─── */}
      <div className="space-y-2">
        <Label>Main Image</Label>

        <label className="group relative flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-6 cursor-pointer transition-colors hover:bg-muted/40">
          {image ? (
            <div className="relative">
              <img
                src={image.preview}
                className="w-44 h-44 object-cover rounded-md"
                alt="Main preview"
              />

              <button
                type="button"
                onClick={onRemoveMain}
                className="absolute -top-2 -right-2 bg-background rounded-full p-1 shadow"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-md bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <Upload className="h-6 w-6 text-white" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                <ImageIcon className="h-7 w-7 text-muted-foreground" />
              </div>
              <div className="text-sm text-muted-foreground text-center">
                <p className="font-medium text-foreground">
                  Upload main product image
                </p>
                <p>PNG, JPG or WEBP</p>
              </div>
            </>
          )}

          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files && onMainImageChange(e.target.files[0])
            }
          />
        </label>
      </div>

      {/* ─── Gallery ─── */}
      <div className="space-y-2">
        <Label>Gallery</Label>

        <div className="flex gap-3 flex-wrap">
          {gallery.map((g, i) => (
            <div key={i} className="relative group">
              <img
                src={g.preview}
                className="w-24 h-24 object-cover rounded-md"
                alt={`Gallery ${i + 1}`}
              />

              <button
                type="button"
                onClick={() => onRemoveGallery(i)}
                className="absolute -top-2 -right-2 bg-background rounded-full p-1 shadow"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="absolute inset-0 rounded-md bg-black/40 opacity-0 group-hover:opacity-100 transition" />
            </div>
          ))}

          {/* Add gallery image */}
          <label className="group w-24 h-24 border border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/40 transition">
            <Plus className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
            <span className="text-[11px] text-muted-foreground mt-1">
              Add image
            </span>
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && onGalleryAdd(e.target.files[0])
              }
            />
          </label>
        </div>
      </div>
    </div>
  );
}
