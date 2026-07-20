import {
  Plus,
  X,
  Image as ImageIcon,
  Upload,
  CheckCircle2,
  Loader2,
  ImagePlus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { optimizeImage } from "@/utils/imageOptimizer";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import {
  useLazyGetCloudinarySignatureQuery,
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
  storeSlug?: string;
}

export default function ImageUploadSection({
  image,
  gallery,
  onMainUploaded,
  onGalleryUploaded,
  onRemoveGallery,
  storeSlug,
}: ImageUploadSectionProps) {
  const [triggerSignature, { isLoading: signing }] =
    useLazyGetCloudinarySignatureQuery();

  const [deleteImage, { isLoading: deleting }] =
    useDeleteCloudinaryImageMutation();

  const [mainProgress, setMainProgress] = useState<number | null>(null);
  const [galleryUploads, setGalleryUploads] = useState<
    { id: string; progress: number }[]
  >([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const canUpload = !signing;

  /* ───────── UPLOAD MAIN ───────── */
  const uploadMain = async (file: File, input?: HTMLInputElement) => {
    if (!canUpload) return;
    try {
      const fresh = await triggerSignature(storeSlug).unwrap();
      setMainProgress(0);

      // Optimize image before upload
      const optimized = await optimizeImage(file);

      const uploaded = await uploadToCloudinary(
        optimized,
        fresh as CloudinaryConfig,
        {
          onProgress: (p) => setMainProgress(p),
        },
      );
      onMainUploaded(uploaded);
      toast.success("Main image uploaded");
    } catch (err) {
      toast.error("Main upload failed");
    } finally {
      setMainProgress(null);
      if (input) input.value = "";
    }
  };

  /* ───────── UPLOAD GALLERY ───────── */
  const uploadGallery = async (files: FileList, input?: HTMLInputElement) => {
    if (!canUpload) return;
    const fresh = await triggerSignature(storeSlug).unwrap();

    // Create placeholders for each file
    const fileArray = Array.from(files);
    const newUploads = fileArray.map((_, _i) => ({
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
    }));

    setGalleryUploads((prev) => [...prev, ...newUploads]);

    try {
      const results = await Promise.all(
        fileArray.map(async (file, index) => {
          // Optimize image before upload
          const optimized = await optimizeImage(file);

          return uploadToCloudinary(optimized, fresh as CloudinaryConfig, {
            onProgress: (p) => {
              setGalleryUploads((prev) =>
                prev.map((u) =>
                  u.id === newUploads[index].id ? { ...u, progress: p } : u,
                ),
              );
            },
          });
        }),
      );
      onGalleryUploaded(results);
      toast.success(`${results.length} images added to gallery`);
    } catch (err) {
      toast.error("Some images failed to upload");
    } finally {
      setGalleryUploads((prev) =>
        prev.filter((u) => !newUploads.some((n) => n.id === u.id)),
      );
      if (input) input.value = "";
    }
  };

  /* ───────── DELETE ───────── */
  const removeMainImage = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!image || deleting) return;

    if (confirmDeleteId !== image.public_id) {
      setConfirmDeleteId(image.public_id);
      return;
    }

    setConfirmDeleteId(null);
    setDeletingId(image.public_id);
    try {
      await deleteImage({ public_id: image.public_id }).unwrap();
      onMainUploaded(null);
      toast.success("Cover image removed");
    } catch (err) {
      toast.error("Failed to remove cover image");
    } finally {
      setDeletingId(null);
    }
  };

  const removeGalleryImage = async (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const img = gallery[index];
    if (!img || deleting) return;

    if (confirmDeleteId !== img.public_id) {
      setConfirmDeleteId(img.public_id);
      return;
    }

    setConfirmDeleteId(null);
    setDeletingId(img.public_id);
    try {
      await deleteImage({ public_id: img.public_id }).unwrap();
      onRemoveGallery(index);
      toast.success("Gallery image removed");
    } catch (err) {
      toast.error("Failed to remove gallery image");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* ─── MAIN IMAGE ─── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-sm bg-primary/10 flex items-center justify-center">
            <ImageIcon className="h-4 w-4 text-primary" />
          </div>
          <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground/80">
            Cover Image
          </Label>
        </div>

        <label
          className={cn(
            "group relative flex flex-col items-center justify-center overflow-hidden transition-all duration-500 cursor-pointer rounded-sm border-2 border-dashed",
            image
              ? "h-80 border-transparent bg-muted/20"
              : "h-64 border-muted-foreground/20 hover:border-primary/40 hover:bg-primary/5",
            (mainProgress !== null || deletingId === image?.public_id) &&
              "pointer-events-none",
          )}
        >
            {mainProgress !== null ? (
              <div className="flex flex-col items-center gap-6 w-full max-w-xs px-6"
              >
                <div className="relative h-20 w-20 flex items-center justify-center">
                  <Loader2 className="h-10 w-10 text-primary animate-spin absolute" />
                  <span className="text-xs font-black text-primary">
                    {mainProgress}%
                  </span>
                </div>
                <div className="w-full space-y-2">
                  <Progress value={mainProgress} className="h-2 rounded-sm" />
                  <p className="text-[10px] text-center uppercase tracking-widest font-black text-primary">
                    Uploading Cover...
                  </p>
                </div>
              </div>
            ) : image ? (
              <div className="relative w-full h-full group"
              >
                <img
                  src={image.url}
                  alt="Main"
                  className={cn(
                    "w-full h-full object-cover transition-all duration-700",
                    deletingId === image.public_id
                      ? "scale-95 blur-md grayscale"
                      : "group-hover:scale-105",
                  )}
                />

                {/* Deleting Overlay */}
                {deletingId === image.public_id && (
                  <div className="absolute inset-0 bg-background/40 backdrop-blur-md flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-10 w-10 text-destructive animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-destructive">
                      Removing Image...
                    </p>
                  </div>
                )}

                <div
                  className={cn(
                    "absolute inset-0 bg-black/40 opacity-0 transition-all duration-300 flex items-center justify-center backdrop-blur-sm",
                    deletingId !== image.public_id && "group-hover:opacity-100",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={removeMainImage}
                      disabled={deletingId !== null}
                      className="h-12 w-12 rounded-sm bg-white/20 hover:bg-destructive text-white flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-destructive  backdrop-blur-md"
                    >
                      <X className="h-6 w-6" />
                    </button>
                    <div className="h-12 px-6 rounded-sm bg-white text-black flex items-center gap-2 font-black uppercase tracking-widest text-[10px] ">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Cover Uploaded
                    </div>
                  </div>
                </div>

                {/* Confirm Removal Overlay */}
                  {confirmDeleteId === image.public_id && (
                    <div className="absolute inset-0 bg-red-600/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20"
                    >
                      <Trash2 className="h-10 w-10 text-white mb-4 animate-bounce" />
                      <p className="text-white text-sm font-black uppercase tracking-tight mb-6">
                        Delete this cover image?
                      </p>
                      <div className="flex items-center gap-3 w-full max-w-[200px]">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setConfirmDeleteId(null);
                          }}
                          className="flex-1 h-10 rounded-sm bg-white/20 hover:bg-white/30 text-white font-bold text-[10px] uppercase tracking-widest transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={removeMainImage}
                          className="flex-1 h-10 rounded-sm bg-white text-red-600 hover:bg-white/90 font-bold text-[10px] uppercase tracking-widest transition-all "
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-8"
              >
                <div className="h-20 w-20 rounded-sm bg-background flex items-center justify-center  border border-muted-foreground/10 group-hover:scale-110 group-hover:bg-primary transition-all duration-500">
                  <Upload className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-black text-foreground">
                    Select Main Product Image
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    PNG, JPG or WEBP (Max 5MB)
                  </p>
                </div>
              </div>
            )}

          <input
            hidden
            type="file"
            accept="image/png, image/jpeg, image/webp, image/jpg"
            disabled={!canUpload || mainProgress !== null}
            onChange={(e) =>
              e.target.files && uploadMain(e.target.files[0], e.target)
            }
          />
        </label>
      </div>

      {/* ─── GALLERY ─── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-sm bg-primary/10 flex items-center justify-center">
              <ImagePlus className="h-4 w-4 text-primary" />
            </div>
            <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground/80">
              Gallery Images
            </Label>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
            {gallery.length} Images Uploaded
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {gallery.map((g, i) => (
              <div
                key={g.public_id}
                className="relative aspect-square group rounded-sm overflow-hidden border border-muted-foreground/10 bg-muted/20"
              >
                <img
                  src={g.url}
                  alt={`Gallery ${i}`}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-500",
                    deletingId === g.public_id
                      ? "scale-90 blur-sm grayscale"
                      : "group-hover:scale-110",
                  )}
                />

                {/* Deleting Overlay */}
                {deletingId === g.public_id && (
                  <div className="absolute inset-0 bg-background/20 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-destructive animate-spin" />
                  </div>
                )}

                <div
                  className={cn(
                    "absolute inset-0 bg-black/60 opacity-0 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]",
                    deletingId !== g.public_id && "group-hover:opacity-100",
                  )}
                >
                  <button
                    type="button"
                    onClick={(e) => removeGalleryImage(i, e)}
                    disabled={deletingId !== null}
                    className="h-10 w-10 rounded-sm bg-white/20 hover:bg-destructive text-white flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-destructive  backdrop-blur-md"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Confirm Deletion Overlay */}
                  {confirmDeleteId === g.public_id && (
                    <div className="absolute inset-0 bg-red-600/95 flex flex-col items-center justify-center p-2 text-center z-10"
                    >
                      <p className="text-[9px] font-black text-white uppercase tracking-tighter mb-3 leading-tight">
                        Confirm Delete?
                      </p>
                      <div className="flex flex-col gap-2 w-full px-2">
                         <button
                           type="button"
                           onClick={(e) => {
                             e.preventDefault();
                             e.stopPropagation();
                             setConfirmDeleteId(null);
                           }}
                           className="h-8 rounded-sm bg-white/20 text-white text-[9px] font-bold uppercase transition-all hover:bg-white/30"
                         >
                           No
                         </button>
                         <button
                           type="button"
                           onClick={(e) => removeGalleryImage(i, e)}
                           className="h-8 rounded-sm bg-white text-red-600 text-[9px] font-bold uppercase  transition-all hover:bg-white/90"
                         >
                           Yes
                         </button>
                      </div>
                    </div>
                  )}
              </div>
            ))}

            {galleryUploads.map((u) => (
              <div
                key={u.id}
                className="relative aspect-square rounded-sm overflow-hidden border-2 border-primary/20 bg-primary/5 flex flex-col items-center justify-center p-4 gap-3"
              >
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
                <div className="w-full space-y-1">
                  <Progress value={u.progress} className="h-1.5" />
                  <p className="text-[9px] text-center font-black text-primary uppercase tracking-tighter">
                    {u.progress}%
                  </p>
                </div>
              </div>
            ))}

            <label
              className={cn(
                "aspect-square rounded-sm border-2 border-dashed border-muted-foreground/20 hover:border-primary/40 hover:bg-primary/5 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 gap-3 group",
                signing && "opacity-50 cursor-not-allowed",
              )}
            >
              <div className="h-12 w-12 rounded-sm bg-background flex items-center justify-center  border border-border group-hover:scale-110 group-hover:bg-primary transition-all duration-500">
                <Plus className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary">
                Add Images
              </span>

              <input
                hidden
                type="file"
                accept="image/png, image/jpeg, image/webp, image/jpg"
                multiple
                disabled={!canUpload}
                onChange={(e) =>
                  e.target.files && uploadGallery(e.target.files, e.target)
                }
              />
            </label>
        </div>

        {gallery.length < 2 && !galleryUploads.length && (
          <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest text-center">
            At least 2 gallery images are required
          </p>
        )}
      </div>
    </div>
  );
}
