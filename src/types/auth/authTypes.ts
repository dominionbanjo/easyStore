export interface IRegisterUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  account_type: "user" | "vendor";
  store_name?: string;
  description?: string;
  referral_code?: string;
  current_sales_channel?: string;
  agree_to_terms?: boolean;
}
export type AccountType = "user" | "vendor" | "admin" | "staff";
export interface IUserAddress {
  id: string;
  is_default?: boolean;
  street?: string;
  country?: string;
  state?: string;
  city?: string;
  postal_code?: string;
}

export interface IUser {
  id: string;

  first_name: string | null;
  last_name: string | null;

  email: string;
  phone_number: string | null;
  username: string | null;

  account_type: "user" | "vendor" | "admin" | "staff";
  account_status: "active" | "pending" | "restricted" | "banned";

  avatar: string | null;

  email_verified: boolean;
  payout_verified: boolean;

  rating_average: string; // backend sends string "0.00"
  rating_count: number;
  review_count: number;

  address: IUserAddress;

  addresses?: IUserAddress[];
  must_change_password?: boolean;
  active_store_id?: string | null;

  bank_code?: string;
  account_number?: string;
  bank_name?: string;

  created_at: string;
  updated_at: string | null;
}

export interface IRegisterUserResponse {
  status: number;
  success: boolean;
  message: string;
  token: string;
  user: IUser;
}

export interface IAuthData {
  user: IUser;
  access: string; // JWT access token
}

export interface IAuthResponse {
  status: "success" | "error";
  message: string;
  data: IAuthData;
}
