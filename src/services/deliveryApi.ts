import { apiManager } from "./apiManager";

/* ───────────────── TYPES ───────────────── */

export type DeliveryStatus =
  | "pending"
  | "assigned"
  | "in_transit"
  | "delivered"
  | "confirmed"
  | "failed"
  | "returned";

export interface IDelivery {
  id: string;

  order_id: string;
  buyer_id: string;
  vendor_id: string;

  courier_id?: string | null;

  order_items: any[];

  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;

  tracking_number?: string | null;
  estimated_delivery?: string | null;

  delivery_status: DeliveryStatus;

  delivered_at?: string | null;

  proof_of_delivery_url?: string | null;

  created_at: string;
  updated_at?: string;
}

/* ───────────────── DTO ARGS ───────────────── */

export interface CreateDeliveryArgs {
  order_id: string;
  buyer_id: string;
  vendor_id: string;

  courier_id?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  tracking_number?: string | null;
  estimated_delivery?: string | null;
}

export interface AssignCourierArgs {
  delivery_id: string;
  courier_id: string;
}

export interface UpdateDeliveryStatusArgs {
  delivery_id: string;
  status: DeliveryStatus;
}

export interface ConfirmDeliveryArgs {
  order_id: string;
  code: string;
}

/* ───────────────── RESPONSES ───────────────── */

export interface DeliveryResponse {
  success?: boolean;
  message?: string;
  delivery?: IDelivery;
}

/* ───────────────── API ───────────────── */

export const deliveryApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    /* ───────── CREATE (internal / order flow) ───────── */

    createDelivery: builder.mutation<IDelivery, CreateDeliveryArgs>({
      query: (body) => ({
        url: "deliveries",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Store"],
    }),

    /* ───────── READ ───────── */

    getDeliveryById: builder.query<IDelivery, string>({
      query: (id) => ({
        url: `deliveries/${id}`,
        method: "GET",
      }),
      providesTags: (_r, _e, id) => [{ type: "Store", id }],
    }),

    /* ───────── ASSIGN COURIER ───────── */

    assignCourier: builder.mutation<any, AssignCourierArgs>({
      query: ({ delivery_id, courier_id }) => ({
        url: `deliveries/${delivery_id}/assign-courier`,
        method: "PATCH",
        body: { courier_id },
      }),
      invalidatesTags: ["Store"],
    }),

    /* ───────── UPDATE STATUS ───────── */

    updateDeliveryStatus: builder.mutation<any, UpdateDeliveryStatusArgs>({
      query: ({ delivery_id, status }) => ({
        url: `deliveries/${delivery_id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Store"],
    }),

    /* ───────── CONFIRM DELIVERY (ESCROW RELEASE) ───────── */

    confirmDelivery: builder.mutation<any, ConfirmDeliveryArgs>({
      query: (body) => ({
        url: "deliveries/confirm",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Store"],
    }),

    /* ───────── UPLOAD PROOF (FormData from UI) ───────── */

    uploadDeliveryProof: builder.mutation<
      DeliveryResponse,
      { delivery_id: string; data: FormData }
    >({
      query: ({ delivery_id, data }) => ({
        url: `deliveries/${delivery_id}/proof`,
        method: "POST",
        body: data, // FormData (file)
      }),
      invalidatesTags: ["Store"],
    }),
  }),
});

/* ───────────────── HOOK EXPORTS ───────────────── */

export const {
  useCreateDeliveryMutation,
  useGetDeliveryByIdQuery,
  useAssignCourierMutation,
  useUpdateDeliveryStatusMutation,
  useConfirmDeliveryMutation,
  useUploadDeliveryProofMutation,
} = deliveryApi;
