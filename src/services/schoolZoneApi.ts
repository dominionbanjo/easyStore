import { apiManager } from "./apiManager";
import type {
  IGetZonesResponse,
  IGetZoneResponse,
  IGetZoneStoresResponse,
  IGetZoneProductsResponse,
  IGetMembersResponse,
  IGetMyMembershipsResponse,
  IZoneActionResponse,
  ISchoolZone,
  ISchoolZoneAdminItem,
  GetZonesArgs,
  CreateZoneArgs,
  UpdateZoneArgs,
  ApplyToZoneArgs,
  MemberDecisionArgs,
  ZoneApprovalArgs,
} from "@/types/SchoolZone/schoolZoneTypes";
import type { IStorePagination } from "@/types/Store/storeTypes";

export const schoolZoneApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    /* ───────── LIST ACTIVE ZONES ───────── */
    getZones: builder.query<IGetZonesResponse, GetZonesArgs>({
      query: (params) => ({
        url: "school-zones",
        method: "GET",
        params,
      }),
      providesTags: ["SchoolZone"],
    }),

    /* ───────── ZONE DETAIL (slug | id | subdomain) ───────── */
    getZone: builder.query<IGetZoneResponse, string>({
      query: (identifier) => ({
        url: `school-zones/${identifier}`,
        method: "GET",
      }),
      providesTags: ["SchoolZone"],
    }),

    /* ───────── ZONE STORES ───────── */
    getZoneStores: builder.query<
      IGetZoneStoresResponse,
      { identifier: string; page?: number; limit?: number; q?: string }
    >({
      query: ({ identifier, ...params }) => ({
        url: `school-zones/${identifier}/stores`,
        method: "GET",
        params,
      }),
    }),

    /* ───────── ZONE PRODUCTS ───────── */
    getZoneProducts: builder.query<
      IGetZoneProductsResponse,
      { identifier: string; page?: number; limit?: number; q?: string }
    >({
      query: ({ identifier, ...params }) => ({
        url: `school-zones/${identifier}/products`,
        method: "GET",
        params,
      }),
    }),

    /* ───────── MY MEMBERSHIPS (VENDOR) ───────── */
    getMyMemberships: builder.query<IGetMyMembershipsResponse, void>({
      query: () => ({
        url: "school-zones/me/memberships",
        method: "GET",
      }),
      providesTags: ["SchoolZone"],
    }),

    /* ───────── MY REP ZONES (SCHOOL REP) ───────── */
    getMyRepZones: builder.query<
      { status: "success" | "error"; message: string; data: ISchoolZone[] },
      void
    >({
      query: () => ({
        url: "school-zones/admin/mine",
        method: "GET",
      }),
      providesTags: ["SchoolZone"],
    }),

    /* ───────── CREATE ZONE (SCHOOL REP) ───────── */
    createZone: builder.mutation<IZoneActionResponse, CreateZoneArgs>({
      query: (body) => ({
        url: "school-zones",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SchoolZone"],
    }),

    /* ───────── VENDOR APPLY ───────── */
    applyToZone: builder.mutation<IZoneActionResponse, ApplyToZoneArgs>({
      query: ({ zoneId, ...body }) => ({
        url: `school-zones/${zoneId}/apply`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["SchoolZone"],
    }),

    /* ───────── VENDOR LEAVE ───────── */
    leaveZone: builder.mutation<IZoneActionResponse, string>({
      query: (zoneId) => ({
        url: `school-zones/${zoneId}/leave`,
        method: "DELETE",
      }),
      invalidatesTags: ["SchoolZone"],
    }),

    /* ───────── REP: UPDATE ZONE ───────── */
    updateZone: builder.mutation<IZoneActionResponse, UpdateZoneArgs>({
      query: ({ id, ...body }) => ({
        url: `school-zones/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["SchoolZone"],
    }),

    /* ───────── REP: LIST MEMBERS ───────── */
    getZoneMembers: builder.query<
      IGetMembersResponse,
      {
        zoneId: string;
        status?: "pending" | "active" | "rejected";
        page?: number;
        limit?: number;
      }
    >({
      query: ({ zoneId, ...params }) => ({
        url: `school-zones/${zoneId}/members`,
        method: "GET",
        params,
      }),
      providesTags: ["SchoolZone"],
    }),

    /* ───────── REP: MEMBER DECISION ───────── */
    decideMember: builder.mutation<IZoneActionResponse, MemberDecisionArgs>({
      query: ({ zoneId, memberId, ...body }) => ({
        url: `school-zones/${zoneId}/members/${memberId}/decision`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["SchoolZone"],
    }),

    /* ───────── ADMIN: ALL ZONES ───────── */
    getAdminZones: builder.query<
      {
        status: "success" | "error";
        message: string;
        data: {
          items: ISchoolZoneAdminItem[];
          pagination: IStorePagination;
        };
      },
      GetZonesArgs
    >({
      query: (params) => ({
        url: "school-zones/admin/all",
        method: "GET",
        params,
      }),
      providesTags: ["SchoolZone"],
    }),

    /* ───────── ADMIN: ZONE APPROVAL ───────── */
    decideZone: builder.mutation<IZoneActionResponse, ZoneApprovalArgs>({
      query: ({ zoneId, ...body }) => ({
        url: `school-zones/admin/${zoneId}/approval`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["SchoolZone"],
    }),
  }),
});

export const {
  useGetZonesQuery,
  useGetZoneQuery,
  useGetZoneStoresQuery,
  useGetZoneProductsQuery,
  useGetMyMembershipsQuery,
  useGetMyRepZonesQuery,
  useCreateZoneMutation,
  useApplyToZoneMutation,
  useLeaveZoneMutation,
  useUpdateZoneMutation,
  useGetZoneMembersQuery,
  useDecideMemberMutation,
  useGetAdminZonesQuery,
  useDecideZoneMutation,
} = schoolZoneApi;
