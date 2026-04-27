import axios from "axios";

type UploadResult = {
  url: string;
  public_id: string;
};

type CloudinaryConfig = {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
};

type UploadOptions = {
  onProgress?: (percent: number) => void;
  subfolder?: string;
};

export async function uploadToCloudinary(
  file: File,
  config: CloudinaryConfig,
  options?: UploadOptions,
): Promise<UploadResult> {
  const formData = new FormData();

  const folder = options?.subfolder
    ? `${config.folder}/${options.subfolder}`
    : config.folder;

  formData.append("file", file);
  formData.append("api_key", config.apiKey);
  formData.append("timestamp", String(config.timestamp));
  formData.append("signature", config.signature);
  formData.append("folder", folder);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
      formData,
      {
        headers: {
          Accept: "application/json",
        },
        onUploadProgress: (event) => {
          if (!event.total) return;

          const percent = Math.round((event.loaded * 100) / event.total);

          options?.onProgress?.(percent);
        },
      },
    );

    return {
      url: res.data.secure_url,
      public_id: res.data.public_id,
    };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { error?: { message?: string } } };
    };
    throw new Error(
      err.response?.data?.error?.message || "Cloudinary upload failed",
    );
  }
}

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function deleteFromCloudinary(public_id: string) {
  if (!public_id) return;

  await axios.delete(`${BASE_URL}/uploads/cloudinary`, {
    data: { public_id },
    withCredentials: true, // keep auth if needed
  });
}
