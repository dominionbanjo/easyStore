/**
 * Utility functions for handling domains and subdomains
 */

export const getSubdomain = (): string | null => {
  const hostname = window.location.hostname;
  
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

  if (accountType === "vendor") {
    if (currentSubdomain === "vendor") {
      navigate("/", { replace: true });
    } else {
      window.location.href = `${window.location.protocol}//vendor.${getBaseDomain()}/`;
    }
  } else if (accountType === "admin") {
    if (currentSubdomain === "admin") {
      navigate("/", { replace: true });
    } else {
      window.location.href = `${window.location.protocol}//admin.${getBaseDomain()}/`;
    }
  } else {
    navigate(fallbackRedirect || "/", { replace: true });
  }
};
