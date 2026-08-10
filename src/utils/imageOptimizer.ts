/**
 * Image Optimizer Utility
 * Compresses images using a single-pass downscale plus binary-searched quality,
 * preferring WebP and falling back to JPEG. Targets low-end device uploads.
 */

const MAX_TARGET_SIZE = 2 * 1024 * 1024; // 2MB
const INITIAL_MAX_DIMENSION = 3840; // Master cap — zoom headroom
const MIN_QUALITY = 0.5;
const MAX_QUALITY = 0.85;
const MAX_ATTEMPTS = 6;

type EncodeType = "image/webp" | "image/jpeg";

const encode = (canvas: HTMLCanvasElement, type: EncodeType, quality: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

const findTargetQuality = async (
  canvas: HTMLCanvasElement,
  type: EncodeType,
): Promise<{ blob: Blob; quality: number } | null> => {
  let low = MIN_QUALITY;
  let high = MAX_QUALITY;
  let best: Blob | null = null;
  let bestQuality = MIN_QUALITY;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const quality = (low + high) / 2;
    const blob = await encode(canvas, type, quality);
    if (!blob) return null;

    if (blob.size <= MAX_TARGET_SIZE) {
      best = blob;
      bestQuality = quality;
      low = quality;
    } else {
      high = quality;
    }
  }

  const bestBlob = best ?? (await encode(canvas, type, bestQuality));
  return bestBlob ? { blob: bestBlob, quality: bestQuality } : null;
};

export const optimizeImage = async (file: File): Promise<File> => {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  if (file.size <= MAX_TARGET_SIZE) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        let width = img.width;
        let height = img.height;
        const scaleFactor = Math.min(
          1,
          INITIAL_MAX_DIMENSION / width,
          INITIAL_MAX_DIMENSION / height,
        );
        width = Math.round(width * scaleFactor);
        height = Math.round(height * scaleFactor);

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        let result: Blob | null = null;
        const webpResult = await findTargetQuality(canvas, "image/webp");
        if (webpResult) {
          result = webpResult.blob;
        } else {
          const jpegResult = await findTargetQuality(canvas, "image/jpeg");
          result = jpegResult?.blob ?? null;
        }

        if (!result) return resolve(file);

        const optimizedFile = new File([result], file.name, {
          type: result.type,
          lastModified: Date.now(),
        });

        resolve(optimizedFile.size < file.size ? optimizedFile : file);
      };

      img.onerror = () => reject(new Error("Failed to load image for optimization"));
    };

    reader.onerror = () => reject(new Error("Failed to read image file"));
  });
};
