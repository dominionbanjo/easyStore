import {
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  Truck,
  User,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";

export interface StatusConfig {
  label: string;
  icon: LucideIcon;
  className: string;
}

export type StatusType = "payment" | "order" | "delivery";

export const getStatusConfig = (
  status: string,
  type: StatusType,
): StatusConfig => {
  const base =
    "inline-flex items-center justify-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border";

  // Normalizing status string
  const normalizedStatus = status?.toLowerCase() || "";

  // Payment Status Configuration
  if (type === "payment") {
    switch (normalizedStatus) {
      case "success":
      case "paid":
        return {
          label: "Paid",
          icon: CheckCircle2,
          className: `${base} bg-emerald-100 text-emerald-800 border-emerald-200`,
        };
      case "failed":
        return {
          label: "Failed",
          icon: XCircle,
          className: `${base} bg-rose-50 text-rose-700 border-rose-100`,
        };
      case "pending":
      default:
        return {
          label: "Pending",
          icon: Clock,
          className: `${base} bg-yellow-50 text-yellow-700 border-yellow-200`,
        };
    }
  }

  // Delivery Status Configuration
  if (type === "delivery") {
    switch (normalizedStatus) {
      case "pending":
        return {
          label: "Pending",
          icon: Clock,
          className: `${base} bg-slate-50 text-slate-700 border-slate-200`,
        };
      case "assigned":
        return {
          label: "Assigned",
          icon: User,
          className: `${base} bg-indigo-50 text-indigo-700 border-indigo-200`,
        };
      case "in_transit":
      case "shipped":
        return {
          label: "In Transit",
          icon: Truck,
          className: `${base} bg-blue-50 text-blue-700 border-blue-200`,
        };
      case "delivered":
      case "confirmed":
        return {
          label: "Delivered",
          icon: CheckCircle2,
          className: `${base} bg-emerald-50 text-emerald-700 border-emerald-200`,
        };
      case "failed":
        return {
          label: "Failed",
          icon: XCircle,
          className: `${base} bg-red-50 text-red-700 border-red-200`,
        };
      case "returned":
        return {
          label: "Returned",
          icon: XCircle,
          className: `${base} bg-orange-50 text-orange-700 border-orange-200`,
        };
      default:
        return {
          label: status || "Unknown",
          icon: AlertCircle,
          className: `${base} bg-gray-50 text-gray-700 border-gray-200`,
        };
    }
  }

  // Order Status Configuration (Default fallback)
  switch (normalizedStatus) {
    case "pending":
      return {
        label: "Pending",
        icon: Clock,
        className: `${base} bg-slate-50 text-slate-700 border-slate-200`,
      };
    case "paid":
    case "processing":
      return {
        label: "Processing",
        icon: Package,
        className: `${base} bg-blue-50 text-blue-700 border-blue-200`,
      };
    case "shipped":
      return {
        label: "Shipped",
        icon: Truck,
        className: `${base} bg-purple-50 text-purple-700 border-purple-200`,
      };
    case "delivered":
    case "completed":
      return {
        label: "Delivered",
        icon: CheckCircle2,
        className: `${base} bg-emerald-50 text-emerald-700 border-emerald-200`,
      };
    case "canceled":
    case "cancelled":
      return {
        label: "Cancelled",
        icon: XCircle,
        className: `${base} bg-red-50 text-red-700 border-red-200`,
      };
    case "failed":
      return {
        label: "Failed",
        icon: XCircle,
        className: `${base} bg-red-50 text-red-700 border-red-200`,
      };
    default:
      return {
        label: status || "Unknown",
        icon: AlertCircle,
        className: `${base} bg-gray-50 text-gray-700 border-gray-200`,
      };
  }
};
