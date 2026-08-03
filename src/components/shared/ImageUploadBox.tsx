import { Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadBoxProps {
  label?: string;
  required?: boolean;
  previewUrl: string | null;
  uploading: boolean;
  progress: number;
  disabled?: boolean;
  onRemove: () => void;
  onFileSelect: (file: File) => void;
  hint?: string;
  compact?: boolean;
}

export default function ImageUploadBox({
  label,
  required,
  previewUrl,
  uploading,
  progress,
  disabled,
  onRemove,
  onFileSelect,
  hint = "PNG/JPG up to 5MB",
  compact = false,
}: ImageUploadBoxProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-semibold text-foreground">
          {label}
          {required && <span className="text-destructive"> *</span>}
        </label>
      )}

      {previewUrl ? (
        <div
          className={cn(
            "relative rounded-sm overflow-hidden border border-border/60 group",
            !compact && "h-32"
          )}
        >
          <img
            src={previewUrl}
            alt={label ?? "Preview"}
            className={cn(
              "w-full object-cover",
              compact ? "h-24 w-24" : "h-32"
            )}
          />
          {!uploading && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 bg-destructive text-white text-xs font-bold px-2.5 py-1 rounded-sm hover:bg-destructive/90"
            >
              Remove
            </button>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
              <span className="text-xs font-bold text-white">
                Uploading {progress}%
              </span>
            </div>
          )}
        </div>
      ) : (
        <label
          className={cn(
            "flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border/60 rounded-sm cursor-pointer hover:border-primary/40 transition-colors relative overflow-hidden",
            compact ? "py-4" : "py-8",
            (uploading || disabled) && "cursor-not-allowed opacity-70"
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
              <span className="text-xs font-semibold text-foreground">
                Uploading... {progress}%
              </span>
              {/* Progress bar */}
              <div className="w-3/4 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground">
                {compact ? "Upload image" : "Click to upload"}
              </span>
              <span className="text-[11px] text-muted-foreground/70">{hint}</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading || disabled}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) onFileSelect(file);
            }}
          />
        </label>
      )}
    </div>
  );
}
