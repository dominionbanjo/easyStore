import { User, Store } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import SmartLink from "./SmartLink";
import { getBaseDomain } from "@/utils/subdomain";
import { useState } from "react";

interface TemplateProfileDropdownProps {
  buttonClassName?: string;
  iconClassName?: string;
}

export function TemplateProfileDropdown({
  buttonClassName,
  iconClassName,
}: TemplateProfileDropdownProps) {
  const { isAuthenticated, currentUser } = useSelector(
    (state: RootState) => state.user,
  );
  const [open, setOpen] = useState(false);

  // If unauthenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <SmartLink
        to={`/auth/login?redirect=${encodeURIComponent(
          window.location.pathname + window.location.search,
        )}`}
      >
        <button className={buttonClassName}>
          <User className={iconClassName || "w-5 h-5"} />
        </button>
      </SmartLink>
    );
  }

  const handleGoToEazystore = () => {
    window.location.href = `${window.location.protocol}//${getBaseDomain()}/`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className={buttonClassName}>
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.first_name || "Profile"}
              className="h-full w-full rounded-sm object-cover aspect-square max-h-6 max-w-6"
            />
          ) : (
            <User className={iconClassName || "w-5 h-5"} />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-56 p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800  rounded-sm"
      >
        <div className="flex flex-col space-y-1">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-2 px-2">
            <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              {currentUser?.first_name} {currentUser?.last_name}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {currentUser?.email}
            </p>
          </div>
          <SmartLink
            to="/account/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-sm transition-colors text-zinc-700 dark:text-zinc-300"
          >
            <User className="h-4 w-4" />
            My Profile
          </SmartLink>
          <button
            onClick={handleGoToEazystore}
            className="flex items-center gap-3 px-2 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-sm transition-colors text-zinc-700 dark:text-zinc-300 w-full text-left"
          >
            <Store className="h-4 w-4" />
            Go to Eazystore
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
