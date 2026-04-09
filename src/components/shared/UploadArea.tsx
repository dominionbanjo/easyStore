import type { ChangeEvent } from "react";
import { UploadIcon, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface UploadAreaProps {
  label?: string;
  id: string;
  value?: File | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
  background?: string;
}

export default function UploadArea({
  label,
  id,
  value,
  onChange,
  error,
  className,
  background,
}: UploadAreaProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowed.includes(file.type)) {
      toast.error("Invalid file type. Only JPG, PNG, GIF allowed.");
      e.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File too large (max 5MB).");
      e.target.value = "";
      return;
    }

    onChange(e);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        className={cn(
          background ?? "bg-gray-50 hover:bg-gray-100",
          "relative rounded-sm min-h-[200px] flex items-center justify-center border border-dashed border-gray-300 cursor-pointer transition"
        )}
      >
        <label
          htmlFor={id}
          className="flex flex-col items-center justify-center text-center gap-2 w-full h-full px-4 py-6"
        >
          {value ? (
            <>
              <CheckCircle className="text-green-600 h-6 w-6" />
              <p className="text-green-700 text-sm font-medium">
                File uploaded successfully
              </p>
            </>
          ) : (
            <>
              <UploadIcon className="text-primary h-5 w-5" />
              <p className="text-sm text-gray-800">
                <span className="font-medium text-primary">
                  Click to upload
                </span>{" "}
                or drag & drop
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG, GIF up to 5MB each
              </p>
            </>
          )}
        </label>

        <input
          id={id}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
