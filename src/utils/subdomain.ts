/**
 * Utility functions for handling domains and subdomains
 */

/**
 * Checks if subdomain-based routing is explicitly disabled via env.
 * This is useful for localhost development where subdomains like 
 * vendor.localhost are tricky to set up.
 */
export const areSubdomainsDisabled = (): boolean => {
  return (import.meta.env as any).VITE_DISABLE_SUBDOMAIN === "true";
};

export const getSubdomain = (): string | null => {
  const hostname = window.location.hostname;
  const path = window.location.pathname;

  // If subdomains are disabled, we infer the "subdomain" from the path prefix
  if (areSubdomainsDisabled()) {
    if (path.startsWith("/vendor")) return "vendor";
    if (path.startsWith("/admin")) return "admin";
    
    // For store subdomains, they usually appear as /stores/:slug
    // If we are on a path like /stores/my-store, we can treat 'my-store' as the subdomain
    if (path.startsWith("/stores/")) {
      const parts = path.split("/");
      if (parts.length >= 3 && parts[2]) {
        return parts[2];
      }
    }
    return null;
  }
  
  if (hostname === "localhost" || hostname.startsWith("127.0.0.1")) return null;

  const parts = hostname.split(".");
  
  // Local testing e.g. store1.localhost
  if (parts.slice(-1)[0] === "localhost") {
    if (parts.length >= 2 && parts[0] !== "www") {
      return parts[0];
    }
    return null;
  }
  
  let normalized = hostname;
  if (normalized.startsWith("www.")) {
    normalized = normalized.substring(4);
  }
  
  const p = normalized.split(".");
  if (p.length === 2) return null; // e.g., easystore.com
  
  const secondToLast = p[p.length - 2];
  const knownSLDs = ["com", "co", "org", "net", "edu", "gov", "mil"];
  
  if (knownSLDs.includes(secondToLast) && p.length === 3) {
    // e.g., eazystore.com.ng or easusss.co
    return null;
  }
  
  // Return the first part as subdomain
  return p[0];
};

export const getBaseDomain = (): string => {
  let host = window.location.host; // Host includes the port
  const hostname = window.location.hostname;
  
  // If subdomains are disabled, the base domain is just the host
  if (areSubdomainsDisabled()) {
    return host;
  }

  const subdomain = getSubdomain();
  
  if (subdomain) {
    if (hostname.startsWith(`${subdomain}.`)) {
       host = host.substring(subdomain.length + 1);
    }
  }
  
  // Strip www. if it exists to prevent things like admin.www.eazystore.com.ng
  if (host.startsWith("www.")) {
    host = host.substring(4);
  }

  return host;
};

export const getCookieDomain = (): string | undefined => {
  const baseDomain = getBaseDomain().split(":")[0]; // Strip the port
  if (baseDomain === "localhost" || baseDomain.startsWith("127.0.0.1")) {
    return undefined; // Let browser handle localhost
  }
  // Ensure we prefix with a dot to make it available to all subdomains
  return `.${baseDomain}`;
};


export const handleRoleRedirect = (
  user: any,
  fallbackRedirect: string,
  navigate: (path: string, options?: any) => void
) => {
  const accountType = user?.account_type;
  const currentSubdomain = getSubdomain();
  const baseDomain = getBaseDomain();
  const subdomainsDisabled = areSubdomainsDisabled();
  
  // Add any existing redirect param if we are using the fallback array
  const existingRedirect = new URLSearchParams(window.location.search).get("redirect");
  
  const searchParams = new URLSearchParams();
  if (existingRedirect && existingRedirect !== "/") {
    searchParams.set("redirect", existingRedirect);
  }
  
  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : "";

  if (accountType === "vendor") {
    if (currentSubdomain === "vendor") {
      navigate(existingRedirect || "/", { replace: true });
    } else {
      if (subdomainsDisabled) {
        navigate(`/vendor${queryString}`, { replace: true });
      } else {
        window.location.href = `${window.location.protocol}//vendor.${baseDomain}/${queryString}`;
      }
    }
  } else if (accountType === "admin") {
    if (currentSubdomain === "admin") {
      navigate(existingRedirect || "/", { replace: true });
    } else {
      if (subdomainsDisabled) {
        navigate(`/admin${queryString}`, { replace: true });
      } else {
        window.location.href = `${window.location.protocol}//admin.${baseDomain}/${queryString}`;
      }
    }
  } else {
    navigate(fallbackRedirect || "/", { replace: true });
  }
};

/**
 * Resolves a given route path into an application-aware path.
 * If subdomains are disabled (e.g., localhost), it prefixes dashboard paths
 * with the appropriate context (/vendor or /admin).
 */
export const getAppPath = (path: string): string => {
  // If subdomains are enabled, or path is not absolute, return as-is
  if (!areSubdomainsDisabled() || !path.startsWith("/")) return path;

  // For localhost routing, we check the current "effective" subdomain (from path)
  const subdomain = getSubdomain();

  // If we're not in a dashboard context, return as-is
  if (subdomain !== "vendor" && subdomain !== "admin") return path;

  // Avoid double-prefixing if the path already has it
  if (path.startsWith("/vendor") || path.startsWith("/admin")) return path;

  // Prefix with the current context
  return `/${subdomain}${path === "/" ? "" : path}`;
};

/**
 * Resolves a given route path into a public website path.
 * On live domains, this ensures the link points to the base domain (easystore.com).
 * On localhost, it ensures the path is root-level (no /vendor or /admin prefix).
 */
export const getWebsitePath = (path: string): string | undefined => {
  if (!path) return undefined;
  
  const subdomainsDisabled = areSubdomainsDisabled();
  const baseDomain = getBaseDomain();
  
  // On localhost, we just return the path as-is (root level)
  if (subdomainsDisabled) {
    return path;
  }
  
  // On live domains, we specify the base domain to escape any subdomain context
  return `${window.location.protocol}//${baseDomain}${path}`;
};
