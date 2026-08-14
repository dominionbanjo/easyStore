interface VendorPageMeta {
  title: string;
  description: string;
}

const PAGE_META: Array<{
  test: (path: string) => boolean;
  meta: VendorPageMeta;
}> = [
  {
    test: (path) => /^\/products\/new\/?$/.test(path),
    meta: { title: "New Product", description: "Add a new product to your store catalog." },
  },
  {
    test: (path) => /^\/products\/[^/]+\/?$/.test(path),
    meta: { title: "Edit Product", description: "Update the details of an existing product." },
  },
  {
    test: (path) => path.startsWith("/products"),
    meta: { title: "Products", description: "Manage your inventory and product listings in one place." },
  },
  {
    test: (path) => path.startsWith("/orders"),
    meta: { title: "Orders", description: "Track, fulfill, and manage your incoming orders." },
  },
  {
    test: (path) => path.startsWith("/installments"),
    meta: { title: "Installments", description: "Buyers paying in parts across your orders — track each plan and its full payment trail." },
  },
  {
    test: (path) => path.startsWith("/customers"),
    meta: { title: "Customers", description: "See who's buying from you and grow your customer base." },
  },
  {
    test: (path) => path.startsWith("/staff"),
    meta: { title: "Staff", description: "Invite and manage your store staff." },
  },
  {
    test: (path) => path.startsWith("/sales-terminal"),
    meta: { title: "Sales Terminal", description: "Record in-store sales quickly and print receipts." },
  },
  {
    test: (path) => path.startsWith("/sales-history"),
    meta: { title: "Sales History", description: "A record of all your offline sales." },
  },
  {
    test: (path) => path.startsWith("/school-zones"),
    meta: { title: "School Zones", description: "Join campus marketplaces and reach students near you." },
  },
  {
    test: (path) => path.startsWith("/payouts"),
    meta: { title: "Payouts", description: "Track your earnings and payout history." },
  },
  {
    test: (path) => path.startsWith("/templates"),
    meta: { title: "Templates", description: "Pick a design that matches your brand." },
  },
  {
    test: (path) => path.startsWith("/messages"),
    meta: { title: "Messages", description: "Chat with customers and resolve enquiries." },
  },
  {
    test: (path) => path.startsWith("/settings"),
    meta: { title: "Store Settings", description: "Update your store details and delivery setup." },
  },
  {
    test: (path) => path.startsWith("/analytics"),
    meta: { title: "Analytics", description: "Track your performance and manage payouts." },
  },
  {
    test: (path) => path.startsWith("/help"),
    meta: { title: "Help", description: "Find answers and support resources to grow your store." },
  },
];

const DEFAULT_META: VendorPageMeta = {
  title: "Overview",
  description: "Welcome back! Here's what's happening with your store today.",
};

export function getVendorPageMeta(pathname: string): VendorPageMeta {
  const normalized = pathname.replace(/^\/vendor(?=\/|$)/, "") || "/";
  const match = PAGE_META.find(({ test }) => test(normalized));
  return match ? match.meta : DEFAULT_META;
}
