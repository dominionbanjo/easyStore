/**
 * Image Optimizer Utility
 * Compresses images iteratively using HTML5 Canvas to target a specific maximum file size.
 * Based on production best practices (e.g., target ≤ 3.5MB).
 */

const MAX_TARGET_SIZE = 3.5 * 1024 * 1024; // 3.5MB
const INITIAL_MAX_DIMENSION = 3840; // Starts with 4K max
const MIN_QUALITY = 0.3; // Minimum quality we are willing to accept before downscaling more aggressively

/**
 * Iteratively optimizes an image file to fit within a target file size.
 * Adjusts quality and dimensions until the target is met or limits are reached.
 * 
 * @param file The original image file
 * @returns A promise that resolves to the optimized File object
 */
export const optimizeImage = async (file: File): Promise<File> => {
  // Only optimize images
  if (!file.type.startsWith("image/")) {
    return file;
  }

  // Skip optimization if already within reasonable size limits
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

        let currentWidth = img.width;
        let currentHeight = img.height;
        let scaleFactor = 1.0;

        // Step 1: Initial dimension cap if extremely large
        if (currentWidth > INITIAL_MAX_DIMENSION || currentHeight > INITIAL_MAX_DIMENSION) {
          scaleFactor = Math.min(INITIAL_MAX_DIMENSION / currentWidth, INITIAL_MAX_DIMENSION / currentHeight);
          currentWidth *= scaleFactor;
          currentHeight *= scaleFactor;
        }

        let currentBlob: Blob | null = null;
        let quality = 0.9;
        let attempts = 0;
        const maxAttempts = 8; // Prevent infinite loops

        // Iterative optimization loop
        while (attempts < maxAttempts) {
          canvas.width = currentWidth;
          canvas.height = currentHeight;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, currentWidth, currentHeight);

          const blob: Blob | null = await new Promise((res) => 
            canvas.toBlob(res, "image/jpeg", quality)
          );

          if (!blob) break;
          currentBlob = blob;

          // Target reached!
          if (blob.size <= MAX_TARGET_SIZE) {
            break;
          }

          // Step 2: If size still too large, reduce quality or scale
          if (quality > MIN_QUALITY) {
            // Reduce quality in steps
            quality -= 0.15;
          } else {
            // Quality is already low, start reducing dimensions as well (0.8x each time)
            currentWidth *= 0.8;
            currentHeight *= 0.8;
          }
          
          attempts++;
        }

        if (currentBlob) {
          const optimizedFile = new File([currentBlob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          
          // Final check: ensure we didn't accidentally make it larger through over-processing
          resolve(optimizedFile.size < file.size ? optimizedFile : file);
        } else {
          resolve(file);
        }
      };
      
      img.onerror = () => reject(new Error("Failed to load image for optimization"));
    };
    
    reader.onerror = () => reject(new Error("Failed to read image file"));
  });
};
