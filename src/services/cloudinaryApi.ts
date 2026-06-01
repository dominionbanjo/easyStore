import { apiManager } from "@/services/apiManager";

export type CloudinaryConfig = {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
};

type CloudinarySignatureApiResponse = {
  status: string;
  message: string;
  data: CloudinaryConfig;
};

export const cloudinaryApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    /* ───────── SIGNATURE ───────── */
    getCloudinarySignature: builder.query<CloudinaryConfig, string | void>({
      query: (subfolder) => ({
        url: "/uploads/cloudinary-signature",
        method: "GET",
        params: subfolder ? { subfolder } : undefined,
      }),
      transformResponse: (response: CloudinarySignatureApiResponse) =>
        response.data,
    }),

    /* ───────── DELETE IMAGE ───────── */
    deleteCloudinaryImage: builder.mutation<
      { status: string; message: string },
      { public_id: string }
    >({
      query: ({ public_id }) => ({
        url: "/uploads/cloudinary",
        method: "DELETE",
        body: { public_id },
      }),
    }),
  }),
});

export const {
  useGetCloudinarySignatureQuery,
  useLazyGetCloudinarySignatureQuery,
  useDeleteCloudinaryImageMutation,
} = cloudinaryApi;
