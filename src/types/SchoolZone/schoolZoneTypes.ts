import type { IStorePagination } from "@/types/Store/storeTypes";
import type { IProduct } from "@/types/product/productTypes";

/* ───────────────── ZONE ───────────────── */

export type SchoolZoneStatus =
  | "pending"
  | "active"
  | "rejected"
  | "restricted"
  | "banned";

export interface ISchoolZone {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  tagline: string | null;
  description: string | null;
  logo: string | null;
  cover_image: string | null;
  state: string;
  location: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  status?: SchoolZoneStatus;
  member_count: number;
  created_at?: string;
}

export interface ISchoolZoneAdminItem {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  state: string;
  location: string | null;
  status: SchoolZoneStatus;
  created_by: string | null;
  rejection_reason: string | null;
  created_at: string;
}

/* ───────────────── ZONE DETAIL (ADMIN) ───────────────── */

export interface ISchoolZoneRequester {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  avatar: string | null;
  account_type: "user" | "vendor" | "admin" | "staff";
  account_status: "active" | "pending" | "restricted" | "banned";
  created_at: string;
}

export interface ISchoolZoneDetail {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  tagline: string | null;
  description: string | null;
  logo: string | null;
  cover_image: string | null;
  state: string;
  location: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  status: SchoolZoneStatus;
  created_by: string | null;
  department: string | null;
  course: string | null;
  student_id_number: string | null;
  school_id_image: string | null;
  delivery_fee: number | null;
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  member_count: number;
  created_at: string;
  updated_at: string;
}

export interface IMyCreatedZone {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  tagline: string | null;
  logo: string | null;
  cover_image: string | null;
  state: string;
  location: string | null;
  status: SchoolZoneStatus;
  department: string | null;
  course: string | null;
  student_id_number: string | null;
  delivery_fee: number | null;
  rejection_reason: string | null;
  created_at: string;
}

export interface IGetMyCreatedZonesResponse {
  status: "success" | "error";
  message: string;
  data: {
    items: IMyCreatedZone[];
    pagination: IStorePagination;
  };
}

export interface IGetZoneDetailResponse {
  status: "success" | "error";
  message: string;
  data: {
    zone: ISchoolZoneDetail;
    requester: ISchoolZoneRequester | null;
  };
}

/* ───────────────── ZONE STATS (ADMIN) ───────────────── */

export interface ISchoolZoneStats {
  total: number;
  pending: number;
  active: number;
  rejected: number;
  restricted: number;
  banned: number;
  active_members: number;
}

export interface IGetZoneStatsResponse {
  status: "success" | "error";
  message: string;
  data: ISchoolZoneStats;
}

/* ───────────────── MEMBERSHIP (VENDOR) ───────────────── */

export type ZoneMemberStatus =
  | "pending"
  | "active"
  | "rejected"
  | "suspended";

export interface IZoneMember {
  id: string;
  store_id: string;
  user_id: string | null;
  store_name: string;
  store_slug: string;
  store_logo: string | null;
  store_status: string;
  status: ZoneMemberStatus;
  department: string | null;
  course: string | null;
  student_id_number: string | null;
  school_id_image: string | null;
  delivery_fee: number | null;
  rejection_reason: string | null;
  requested_at: string;
  approved_at: string | null;
}

export interface IMyMembership {
  id: string;
  school_zone_id: string;
  status: ZoneMemberStatus;
  department: string | null;
  course: string | null;
  student_id_number: string | null;
  delivery_fee: number | null;
  rejection_reason: string | null;
  requested_at: string;
  zone: {
    id: string;
    name: string;
    slug: string;
    subdomain: string;
    logo: string | null;
    cover_image: string | null;
    state: string;
    location: string | null;
    status: SchoolZoneStatus;
  } | null;
}

/* ───────────────── ZONE STORES / PRODUCTS ───────────────── */

export interface IZoneStore {
  id: string;
  store_name: string;
  slug: string;
  subdomain: string | null;
  category: string | null;
  description: string | null;
  logo: string | null;
  cover_image: string | null;
  rating_average: string;
  address: {
    city: string | null;
    state: string | null;
    country: string | null;
  };
  total_products: number;
}

/* ───────────────── RESPONSES ───────────────── */

export interface IGetZonesResponse {
  status: "success" | "error";
  message: string;
  data: {
    items: ISchoolZone[];
    pagination: IStorePagination;
  };
}

export interface IGetZoneResponse {
  status: "success" | "error";
  message: string;
  data: ISchoolZone;
}

export interface IGetZoneStoresResponse {
  status: "success" | "error";
  message: string;
  data: {
    items: IZoneStore[];
    pagination: IStorePagination;
  };
}

export interface IGetZoneProductsResponse {
  status: "success" | "error";
  message: string;
  data: {
    items: IProduct[];
    pagination: IStorePagination;
  };
}

export interface IGetMembersResponse {
  status: "success" | "error";
  message: string;
  data: {
    items: IZoneMember[];
    pagination: IStorePagination;
  };
}

export interface IGetMyMembershipsResponse {
  status: "success" | "error";
  message: string;
  data: {
    items: IMyMembership[];
    pagination: IStorePagination;
  };
}

export interface IZoneActionResponse {
  status: "success" | "error";
  message: string;
  data: {
    success: boolean;
    message: string;
  };
}

/* ───────────────── QUERY ARGS ───────────────── */

export interface GetZonesArgs {
  page?: number;
  limit?: number;
  q?: string;
  state?: string;
  status?: SchoolZoneStatus;
}

export interface CreateZoneArgs {
  name: string;
  subdomain: string;
  tagline?: string;
  description?: string;
  state: string;
  location?: string;
  contact_email?: string;
  contact_phone?: string;
  logo?: string;
  cover_image?: string;
  department?: string;
  course?: string;
  student_id_number?: string;
  school_id_image?: string;
  delivery_fee?: number;
}

export interface UpdateZoneArgs extends Partial<CreateZoneArgs> {
  id: string;
}

export interface ApplyToZoneArgs {
  zoneId: string;
  department: string;
  course?: string;
  student_id_number: string;
  school_id_image: string;
  delivery_fee: number;
}

export interface MemberDecisionArgs {
  zoneId: string;
  memberId: string;
  decision: "approve" | "reject";
  reason?: string;
}

export interface ZoneApprovalArgs {
  zoneId: string;
  decision: "approve" | "reject";
  reason?: string;
}
