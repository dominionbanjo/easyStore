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
export type AccountType = "user" | "vendor" | "admin";

export interface IUser {
  id: string;
  email: string;
  account_type: "user" | "vendor" | "admin";

  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;

  avatar: string | null;
  avatar_public_id: string | null;

  email_verified: boolean;
  country: string | null;
  bio: string | null;

  products_count: number | null;

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
