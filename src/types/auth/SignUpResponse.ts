export interface IRegisterUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  account_type: "user" | "vendor";
  store_name?: string;
  username?: string;
  referral_code?: string;
  current_sales_channel?: string;
  agree_to_terms?: boolean;
}
export type AccountType = "user" | "vendor" | "admin";

export interface IUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;

  username: string | null;
  avatar: string | null;

  account_type: AccountType;

  store_id: string | null;
  store_name: string | null;

  email_verified: boolean;
  signup_medium: "signed" | "google" | "facebook" | string;

  created_at: string; // ISO date string
}

export interface IRegisterUserResponse {
  status: number;
  success: boolean;
  message: string;
  token: string;
  user: IUser;
}

export interface GUser {
  id: string;
  name: string;
  email: string;
  account_type: "user" | "vendor";
  avatar?: string;
}

export interface IAuthResponse {
  status: number;
  success: boolean;
  message: string;
  token: string;
  user: GUser;
}
export interface IAuthData {
  user: IUser;
  access: string; // JWT access token
}

export interface ILoginResponse {
  status: "success" | "error";
  message: string;
  data: IAuthData;
}
