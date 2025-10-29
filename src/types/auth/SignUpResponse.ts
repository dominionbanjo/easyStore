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

export interface IUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  account_type: "user" | "vendor";
  created: boolean;
  email_verified: boolean;
}

export interface IRegisterUserResponse {
  status: number;
  success: boolean;
  message: string;
  token: string;
  user: IUser;
}
