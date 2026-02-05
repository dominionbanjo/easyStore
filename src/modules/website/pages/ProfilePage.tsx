import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  ShieldCheck,
} from "lucide-react";
import { format } from "date-fns";
import { useGetUserProfileQuery } from "@/services/userApi";
import { useEffect, useState } from "react";
import { EditProfileModal } from "../components/profile/EditProfileModal";
import { LogoutConfirmModal } from "../components/home/LogoutModal";
import { toast } from "sonner";
import { useLogoutMutation } from "@/services/authApi";
import { Skeleton } from "@/components/ui/skeleton";

/* ───────────────── LAZY CSC IMPORT ───────────────── */
const importCSC = () => import("country-state-city");

/* ───────────────── COMPONENT ───────────────── */

export default function UserProfilePage() {
  const { data, isLoading, isError } = useGetUserProfileQuery();

  const [editOpen, setEditOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutMutation();

  const [countryName, setCountryName] = useState("—");
  const [stateName, setStateName] = useState("—");

  const user = data?.data?.user;

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      window.location.href = "/auth/login";
    } catch {
      toast.error("Logout Failed");
    }
  };

  /* ───────────────── RESOLVE COUNTRY / STATE (ALWAYS CALLED) ───────────────── */
  useEffect(() => {
    let cancelled = false;

    async function resolveLocation() {
      if (!user?.address?.country) {
        setCountryName("—");
        setStateName("—");
        return;
      }

      const { Country, State } = await importCSC();
      if (cancelled) return;

      setCountryName(
        Country.getCountryByCode(user.address.country)?.name ??
          user.address.country,
      );

      if (user.address.state) {
        setStateName(
          State.getStateByCodeAndCountry(
            user.address.state,
            user.address.country,
          )?.name ?? user.address.state,
        );
      } else {
        setStateName("—");
      }
    }

    resolveLocation();

    return () => {
      cancelled = true;
    };
  }, [user?.address?.country, user?.address?.state]);

  /* ───────────────── SAFE EARLY RETURNS ───────────────── */

  if (isLoading) {
    return <UserProfileSkeleton />;
  }

  if (isError) {
    return (
      <section className="py-20 text-center text-destructive">
        Failed to load profile.
      </section>
    );
  }

  if (!user) {
    return <UserProfileSkeleton />;
  }

  /* ───────────────── RENDER ───────────────── */

  return (
    <>
      <section className="py-4 px-4 mt-[30px]">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* ================= PROFILE HEADER ================= */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center gap-6 bg-card p-6 rounded-xl shadow-sm"
          >
            <div className="h-28 w-28 rounded-full overflow-hidden border bg-muted flex items-center justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.first_name ?? ""} ${user.last_name ?? ""}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-muted-foreground" />
              )}
            </div>

            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-2xl font-semibold">
                {user.first_name ?? "—"} {user.last_name ?? ""}
              </h1>

              {user.username && (
                <p className="text-sm text-muted-foreground">
                  @{user.username}
                </p>
              )}

              <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground">
                <Mail size={14} />
                {user.email}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-sm">
                <span className="capitalize px-3 py-1 rounded-full bg-primary/10 text-primary">
                  {user.account_type}
                </span>

                {user.email_verified && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle size={14} />
                    Email verified
                  </span>
                )}

                {user.payout_verified && (
                  <span className="flex items-center gap-1 text-blue-600">
                    <ShieldCheck size={14} />
                    Payout verified
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* ================= ACCOUNT DETAILS ================= */}
          <div className="bg-card p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-medium">Account Details</h2>
            <Separator />

            <div className="grid sm:grid-cols-2 gap-6 text-sm">
              <Detail
                icon={<Phone size={14} />}
                label="Phone"
                value={user.phone_number || "—"}
              />
              <Detail label="Country" value={countryName} />
              <Detail
                label="Joined"
                value={format(new Date(user.created_at), "PPP")}
              />
              {user.updated_at && (
                <Detail
                  label="Last Updated"
                  value={format(new Date(user.updated_at), "PPP p")}
                />
              )}
            </div>
          </div>

          {/* ================= RATINGS ================= */}
          <div className="bg-card p-6 rounded-xl space-y-4">
            <h2 className="text-lg font-medium">Ratings & Reviews</h2>
            <Separator />

            <div className="grid sm:grid-cols-3 gap-6 text-sm">
              <Detail
                icon={<Star size={14} />}
                label="Average Rating"
                value={String(user.rating_average ?? "0.00")}
              />
              <Detail label="Ratings" value={`${user.rating_count ?? 0}`} />
              <Detail label="Reviews" value={`${user.review_count ?? 0}`} />
            </div>
          </div>

          {/* ================= ADDRESS ================= */}
          {user.address && (
            <div className="bg-card p-6 rounded-xl space-y-4">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <MapPin size={18} />
                Address
              </h2>
              <Separator />
              <p className="text-sm font-medium">
                {user.address.city}, {stateName}, {countryName}
              </p>
            </div>
          )}

          {/* ================= ACTIONS ================= */}
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              Edit Profile
            </Button>
            <Button variant="destructive" onClick={() => setLogoutOpen(true)}>
              Logout
            </Button>
          </div>
        </div>
      </section>

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        user={user}
      />

      <LogoutConfirmModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </>
  );
}

/* ================= SHARED DETAIL COMPONENT ================= */

function Detail({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-xs flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

/* ================= SKELETON ================= */

function UserProfileSkeleton() {
  return (
    <section className="py-4 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-center gap-6 bg-card p-6 rounded-xl">
          <Skeleton className="h-28 w-28 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
      </div>
    </section>
  );
}
