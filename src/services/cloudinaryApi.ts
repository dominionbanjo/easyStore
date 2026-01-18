import { apiManager } from "@/services/apiManager";

type CloudinarySignatureResponse = {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
};

export const cloudinaryApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    getCloudinarySignature: builder.query<CloudinarySignatureResponse, void>({
      query: () => ({
        url: "/uploads/cloudinary-signature",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCloudinarySignatureQuery } = cloudinaryApi;
