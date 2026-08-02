import type { IStorePagination } from "@/types/Store/storeTypes";
import type { IProduct } from "@/types/product/productTypes";

/* ───────────────── ZONE ───────────────── */

export type SchoolZoneStatus = "pending" | "active" | "rejected";

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

/* ───────────────── MEMBERSHIP (VENDOR) ───────────────── */

export type ZoneMemberStatus = "pending" | "active" | "rejected";

export interface IZoneMember {
  id: string;
  store_id: string;
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
  data: IMyMembership[];
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
}

export interface UpdateZoneArgs extends Partial<CreateZoneArgs> {
  id: string;
}

export interface ApplyToZoneArgs {
  zoneId: string;
  department: string;
  course: string;
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
