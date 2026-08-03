import { apiManager } from "./apiManager";
import type {
  IGetZonesResponse,
  IGetZoneResponse,
  IGetZoneStoresResponse,
  IGetZoneProductsResponse,
  IGetMembersResponse,
  IGetMyMembershipsResponse,
  IGetMyCreatedZonesResponse,
  IGetZoneDetailResponse,
  IGetZoneStatsResponse,
  IZoneActionResponse,
  ISchoolZone,
  ISchoolZoneAdminItem,
  GetZonesArgs,
  CreateZoneArgs,
  UpdateZoneArgs,
  ApplyToZoneArgs,
  MemberDecisionArgs,
  ZoneApprovalArgs,
  ZoneMemberStatus,
} from "@/types/SchoolZone/schoolZoneTypes";
import type { IStorePagination } from "@/types/Store/storeTypes";

export const schoolZoneApi = apiManager.injectEndpoints({
  endpoints: (builder) => ({
    /* ───────── CHECK SUBDOMAIN AVAILABILITY ───────── */
    checkZoneSubdomain: builder.query<
      {
        status: "success" | "error";
        message: string;
        data: { available: boolean };
      },
      { subdomain: string }
    >({
      query: ({ subdomain }) => ({
        url: "school-zones/check-subdomain",
        method: "GET",
        params: { subdomain },
      }),
    }),

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
    getMyMemberships: builder.query<
      IGetMyMembershipsResponse,
      { page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "school-zones/me/memberships",
        method: "GET",
        params,
      }),
      providesTags: ["SchoolZone"],
    }),

    /* ───────── MY CREATED ZONES (VENDOR) ───────── */
    getMyCreatedZones: builder.query<
      IGetMyCreatedZonesResponse,
      { page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "school-zones/me/created",
        method: "GET",
        params,
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
        status?: ZoneMemberStatus;
        q?: string;
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

    /* ───────── REP/ADMIN: SUSPEND MEMBER ───────── */
    suspendMember: builder.mutation<
      IZoneActionResponse,
      { zoneId: string; memberId: string }
    >({
      query: ({ zoneId, memberId }) => ({
        url: `school-zones/${zoneId}/members/${memberId}/suspend`,
        method: "POST",
      }),
      invalidatesTags: ["SchoolZone"],
    }),

    /* ───────── REP/ADMIN: UNSUSPEND MEMBER ───────── */
    unsuspendMember: builder.mutation<
      IZoneActionResponse,
      { zoneId: string; memberId: string }
    >({
      query: ({ zoneId, memberId }) => ({
        url: `school-zones/${zoneId}/members/${memberId}/unsuspend`,
        method: "POST",
      }),
      invalidatesTags: ["SchoolZone"],
    }),

    /* ───────── REP/ADMIN: REMOVE MEMBER FROM ZONE ───────── */
    removeZoneMember: builder.mutation<
      IZoneActionResponse,
      { zoneId: string; memberId: string }
    >({
      query: ({ zoneId, memberId }) => ({
        url: `school-zones/${zoneId}/members/${memberId}`,
        method: "DELETE",
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

    /* ───────── ADMIN: ZONE STATS ───────── */
    getAdminZoneStats: builder.query<IGetZoneStatsResponse, void>({
      query: () => ({
        url: "school-zones/admin/stats",
        method: "GET",
      }),
      providesTags: ["SchoolZone"],
    }),

    /* ───────── ADMIN: ZONE DETAIL (WITH REQUESTER) ───────── */
    getAdminZoneDetail: builder.query<IGetZoneDetailResponse, string>({
      query: (zoneId) => ({
        url: `school-zones/admin/${zoneId}`,
        method: "GET",
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
  useCheckZoneSubdomainQuery,
  useLazyCheckZoneSubdomainQuery,
  useGetZonesQuery,
  useGetZoneQuery,
  useGetZoneStoresQuery,
  useGetZoneProductsQuery,
  useGetMyMembershipsQuery,
  useGetMyCreatedZonesQuery,
  useGetMyRepZonesQuery,
  useCreateZoneMutation,
  useApplyToZoneMutation,
  useLeaveZoneMutation,
  useUpdateZoneMutation,
  useGetZoneMembersQuery,
  useDecideMemberMutation,
  useSuspendMemberMutation,
  useUnsuspendMemberMutation,
  useRemoveZoneMemberMutation,
  useGetAdminZonesQuery,
  useGetAdminZoneDetailQuery,
  useGetAdminZoneStatsQuery,
  useDecideZoneMutation,
} = schoolZoneApi;
