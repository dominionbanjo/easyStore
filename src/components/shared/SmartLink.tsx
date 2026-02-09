import PreloadLink from "./PreloadLink";
import { getPreloadForPath } from "@/routes/preloadRegistry";
import type { LinkProps } from "react-router-dom";

/**
 * 🧠 SmartLink Component
 * Automatically detects the destination and applies the correct
 * preload strategy from the registry.
 */
export default function SmartLink({ to, ...props }: LinkProps) {
  const path = typeof to === "string" ? to : to.pathname || "";
  const preload = getPreloadForPath(path);

  return <PreloadLink to={to} preload={preload || undefined} {...props} />;
}
