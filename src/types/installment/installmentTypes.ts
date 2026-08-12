export type InstallmentMode = "auto" | "manual";

export type InstallmentPlanStatus =
  | "active"
  | "completed"
  | "defaulted"
  | "canceled"
  | "refunding";

export type InstallmentPaymentStatus = "pending" | "paid" | "refunded";

export interface InstallmentPreset {
  id: string;
  name: string;
  count: number;
  interval_days: number;
}

export interface InstallmentConfig {
  presets: InstallmentPreset[];
  min_order_kobo: number;
  max_concurrent_plans: number;
  default_lockout_days: number;
}

export interface InstallmentPaymentView {
  id: string;
  plan_id: string;
  index: number;
  amount_kobo: number;
  fee_kobo: number;
  due_date: string | null;
  paid_at: string | null;
  payment_reference: string | null;
  payment_url: string | null;
  status: InstallmentPaymentStatus;
  refunded_at: string | null;
  created_at: string;
}

export interface InstallmentPlanView {
  id: string;
  order_id: string;
  buyer_id: string;
  vendor_id: string;
  store_id: string | null;
  total_kobo: number;
  paid_kobo: number;
  installments_total: number;
  installments_paid: number;
  mode: InstallmentMode;
  preset_id: string;
  next_due_date: string | null;
  status: InstallmentPlanStatus;
  deposit_expires_at: string | null;
  defaulted_at: string | null;
  canceled_at: string | null;
  completed_at: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  payments?: InstallmentPaymentView[];
}

export interface CreateInstallmentPlanArgs {
  order_id: string;
  preset_id: string;
  mode: InstallmentMode;
}

export interface InstallmentPaymentInitResponse {
  success: boolean;
  payment_url: string;
  reference: string;
}

export interface CreateInstallmentOrderArgs {
  email: string;
  order_items: {
    product_id: string;
    variant_id?: string | null;
    quantity: number;
    size?: string | null;
    color?: string | null;
  }[];
  delivery_rate_id?: string;
  delivery_address_id?: string;
}

export interface CreateInstallmentOrderResponse {
  success: boolean;
  order_id: string;
  total_kobo: number;
}

export interface PaginatedInstallmentPlans {
  success: boolean;
  data: InstallmentPlanView[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
