import { Modal } from "@/components/shared/Modal";
import type { IStoreDetails } from "@/types/Store/storeTypes";
import {
  Call,
  Sms,
  Location,
  Instagram,
  Facebook,
  Youtube,
  Global,
} from "iconsax-react";
import { Star, TwitterIcon } from "lucide-react";

interface StoreContactModalProps {
  store: IStoreDetails;
  open: boolean;
  onClose: () => void;
}

function getSocialIcon(platform: string) {
  const key = platform.toLowerCase();
  if (key.includes("instagram"))
    return (
      <Instagram
        variant="Bold"
        color="currentColor"
        className="w-5 h-5"
      />
    );
  if (key.includes("facebook"))
    return (
      <Facebook
        variant="Bold"
        color="currentColor"
        className="w-5 h-5"
      />
    );
  if (key.includes("twitter") || key.includes("x"))
    return (
      <TwitterIcon
        className="w-5 h-5"
      />
    );
  if (key.includes("youtube"))
    return (
      <Youtube
        variant="Bold"
        color="currentColor"
        className="w-5 h-5"
      />
    );
  return (
    <Global variant="Bold" color="currentColor" className="w-5 h-5" />
  );
}

export function StoreContactModal({
  store,
  open,
  onClose,
}: StoreContactModalProps) {
  const address = [
    store.address_street,
    store.address_city,
    store.address_state,
    store.address_country,
    store.address_postal_code,
  ]
    .filter(Boolean)
    .join(", ");

  const hasSocials =
    store.social_links && Object.keys(store.social_links).length > 0;

  return (
    <Modal
      open={open}
      onOpenChange={(v) => !v && onClose()}
      onClose={onClose}
      title="Store Information"
      className="sm:max-w-md"
    >
      <div className="space-y-6">
        {/* Store Identity */}
        <div className="flex items-center gap-4">
          {store.logo ? (
            <img
              src={store.logo}
              alt={store.store_name}
              className="w-16 h-16 rounded-sm object-cover border border-zinc-200 dark:border-zinc-800 shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-sm bg-[var(--theme-primary)]/10 flex items-center justify-center shrink-0">
              <span className="text-2xl font-black text-[var(--theme-primary)]">
                {store.store_name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white truncate">
              {store.store_name}
            </h3>
            {store.rating_average && (
              <div className="flex items-center gap-1.5 mt-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                  {Number(store.rating_average).toFixed(1)}
                </span>
                <span className="text-xs text-zinc-400">
                  ({store.rating_count || 0} reviews)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {store.description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed border-l-2 border-[var(--theme-primary)]/30 pl-3">
            {store.description}
          </p>
        )}

        {/* Contact Details */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Contact
          </p>

          {store.phone_number && (
            <a
              href={`tel:${store.phone_number}`}
              className="flex items-center gap-3 p-3 rounded-sm bg-zinc-50 dark:bg-zinc-900 hover:bg-[var(--theme-primary)]/5 border border-zinc-200 dark:border-zinc-800 hover:border-[var(--theme-primary)]/40 transition-all group text-[var(--theme-primary)]"
            >
              <Call
                variant="Bold"
                color="currentColor"
                className="w-5 h-5 shrink-0"
              />
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-[var(--theme-primary)] transition-colors">
                {store.phone_number}
              </span>
            </a>
          )}

          {store.email && (
            <a
              href={`mailto:${store.email}`}
              className="flex items-center gap-3 p-3 rounded-sm bg-zinc-50 dark:bg-zinc-900 hover:bg-[var(--theme-primary)]/5 border border-zinc-200 dark:border-zinc-800 hover:border-[var(--theme-primary)]/40 transition-all group text-[var(--theme-primary)]"
            >
              <Sms
                variant="Bold"
                color="currentColor"
                className="w-5 h-5 shrink-0"
              />
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-[var(--theme-primary)] transition-colors truncate">
                {store.email}
              </span>
            </a>
          )}

          {address && (
            <div className="flex items-start gap-3 p-3 rounded-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[var(--theme-primary)]">
              <Location
                variant="Bold"
                color="currentColor"
                className="w-5 h-5 shrink-0 mt-0.5"
              />
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {address}
              </span>
            </div>
          )}
        </div>

        {/* Social Links */}
        {hasSocials && (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Follow Us
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(store.social_links!).map(([platform, link]) => (
                <a
                  key={platform}
                  href={link as string}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-[var(--theme-primary)]/50 hover:bg-[var(--theme-primary)]/5 transition-all group text-[var(--theme-primary)]"
                >
                  {getSocialIcon(platform)}
                  <span className="text-xs font-bold capitalize text-zinc-500 group-hover:text-[var(--theme-primary)] transition-colors">
                    {platform}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
