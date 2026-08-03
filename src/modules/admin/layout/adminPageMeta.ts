interface AdminPageMeta {
  title: string;
  description: string;
}

const PAGE_META: Array<{
  test: (path: string) => boolean;
  meta: AdminPageMeta;
}> = [
  {
    test: (path) => path.startsWith("/orders"),
    meta: { title: "Order Management", description: "Monitor and manage all orders placed across the platform." },
  },
  {
    test: (path) => path.startsWith("/vendors"),
    meta: { title: "Vendors Management", description: "Approve new vendors, manage store visibility, and control access across the platform." },
  },
  {
    test: (path) => path.startsWith("/school-zones"),
    meta: { title: "School Zones", description: "Review and approve school zone creation requests." },
  },
  {
    test: (path) => path.startsWith("/users"),
    meta: { title: "Users Management", description: "Monitor all registered users, review their activity, and manage account access." },
  },
  {
    test: (path) => path.startsWith("/transactions"),
    meta: { title: "Transactions", description: "Complete platform oversight of financial flows, refunds, and vendor payouts." },
  },
  {
    test: (path) => path.startsWith("/payouts"),
    meta: { title: "Payouts & Escrow", description: "Manage vendor payouts and monitor held escrow funds across the platform." },
  },
  {
    test: (path) => path.startsWith("/reports"),
    meta: { title: "Reports & Analytics", description: "Revenue, orders, and comprehensive platform performance reports." },
  },
  {
    test: (path) => path.startsWith("/logs"),
    meta: { title: "System Logs", description: "Review all system activities, admin actions, vendor updates, and security events in real time." },
  },
  {
    test: (path) => path.startsWith("/notifications"),
    meta: { title: "Notifications Center", description: "Manage automated system alerts and manual platform-wide broadcasts." },
  },
  {
    test: (path) => path.startsWith("/analytics"),
    meta: { title: "Platform Analysis", description: "Comprehensive insight into platform health, growth, and performance metrics." },
  },
  {
    test: (path) => path.startsWith("/access-control"),
    meta: { title: "Access Control", description: "Manage roles, permissions, and access levels across the platform." },
  },
  {
    test: (path) => path.startsWith("/settings"),
    meta: { title: "Platform Settings", description: "Configure global platform behavior, themes, integrations, and security policies." },
  },
  {
    test: (path) => path.startsWith("/system"),
    meta: { title: "Server Configuration", description: "Manage environment variables, caching, performance tuning, and backup settings for your backend infrastructure." },
  },
];

const DEFAULT_META: AdminPageMeta = {
  title: "Dashboard Overview",
  description: "Real-time platform performance and vendor ecosystem metrics.",
};

export function getAdminPageMeta(pathname: string): AdminPageMeta {
  const normalized = pathname.replace(/^\/admin(?=\/|$)/, "") || "/";
  const match = PAGE_META.find(({ test }) => test(normalized));
  return match ? match.meta : DEFAULT_META;
}
