import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Star,
  ShieldCheck,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  Globe,
  Briefcase,
} from "lucide-react";
import { format } from "date-fns";
import { useGetUserProfileQuery } from "@/services/userApi";
import { useEffect, useState } from "react";
import { EditProfileModal } from "@/modules/website/components/profile/EditProfileModal";
import { LogoutConfirmModal } from "@/modules/website/components/home/LogoutModal";
import { toast } from "sonner";
import { useLogoutMutation } from "@/services/authApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NigeriaData } from "@/utils/nigeria-data";
import { AddressRequiredModal } from "@/modules/website/components/modals/AddressRequiredModal";

/* ───────────────── COMPONENT ───────────────── */

export default function UserProfilePage() {
  const { data, isLoading, isError } = useGetUserProfileQuery();
  const [editOpen, setEditOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
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

  /* ───────────────── RESOLVE COUNTRY / STATE ───────────────── */
  useEffect(() => {
    async function resolveLocation() {
      if (!user?.address?.country) {
        setCountryName("—");
        setStateName("—");
        return;
      }

      if (user.address.country === "NG") {
        setCountryName("Nigeria");
      } else {
        setCountryName(user.address.country);
      }

      if (user.address.state) {
        const s = NigeriaData.getStateByCode(user.address.state);
        setStateName(s?.name ?? user.address.state);
      } else {
        setStateName("—");
      }
    }

    resolveLocation();
  }, [user?.address?.country, user?.address?.state]);

  if (isLoading) return <UserProfileSkeleton />;
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="p-4 rounded-sm bg-destructive/10 text-destructive text-3xl">
          ⚠️
        </div>
        <h2 className="text-xl font-semibold">Failed to load profile</h2>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }
  if (!user) return null;

  return (
    <main className="min-h-screen bg-muted/30 dark:bg-neutral-950 pb-20 transition-colors duration-300">
      {/* ================= BANNER SECTION ================= */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary via-primary/90 to-emerald-600 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.4)_0%,_transparent_50%)]" />
        </div>
        <div
          className="absolute -right-20 -bottom-20 w-96 h-96 bg-white rounded-sm blur-3xl"
        />
      </div>

      <div className="w-full mx-auto px-4 -mt-32 md:-mt-40 relative z-10">
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-5"
        >
          {/* ================= LEFT COLUMN: PERSONAL CARD ================= */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <Card className="rounded-sm border-none  overflow-hidden bg-card/80 dark:bg-neutral-900/80 backdrop-blur-xl">
                <CardContent className="p-5 flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background ">
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                        {user.first_name?.[0]}
                        {user.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    {user.email_verified && (
                      <div className="absolute bottom-2 right-2 p-1.5 bg-background rounded-sm ">
                        <CheckCircle className="h-5 w-5 text-green-500 fill-green-500/10" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                      {user.first_name} {user.last_name}
                    </h1>
                    <p className="text-muted-foreground font-medium">
                      @{user.username || "user"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                    <Badge
                      variant="secondary"
                      className="px-3 py-1 rounded-sm capitalize bg-primary/10 text-primary border-none"
                    >
                      {user.account_type}
                    </Badge>
                    {user.payout_verified && (
                      <Badge
                        variant="outline"
                        className="px-3 py-1 rounded-sm gap-1 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/10"
                      >
                        <ShieldCheck size={12} />
                        Verified Payout
                      </Badge>
                    )}
                  </div>

                  <Separator className="my-8 opacity-50" />

                  <div className="w-full space-y-4">
                    <Button
                      className="w-full rounded-sm h-12 font-semibold   hover: transition-all gap-2"
                      onClick={() => setEditOpen(true)}
                    >
                      <Settings className="h-4 w-4" />
                      Edit Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full rounded-sm h-12 font-semibold hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all gap-2"
                      onClick={() => setLogoutOpen(true)}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* QUICK STATS */}
            <div>
              <Card className="rounded-sm border-none  bg-card/80 dark:bg-neutral-900/80 backdrop-blur-xl">
                <CardContent className="p-6">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
                    Member Overview
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Joined
                      </div>
                      <span className="font-semibold">
                        {user.created_at ? format(new Date(user.created_at), "MMM yyyy") : "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Star className="h-4 w-4 text-orange-400" />
                        Rating
                      </div>
                      <span className="font-semibold flex items-center gap-1">
                        {user.rating_average || "0.0"}
                        <span className="text-xs text-muted-foreground font-normal">
                          ({user.rating_count || 0})
                        </span>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: CONTENT ================= */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <ProfileSection
                  title="Contact Information"
                  icon={<Mail className="text-primary" />}
                >
                  <DetailItem
                    label="Email Address"
                    value={user.email}
                    icon={<Mail size={14} />}
                  />
                  <DetailItem
                    label="Phone Number"
                    value={user.phone_number || "—"}
                    icon={<Phone size={14} />}
                  />
                </ProfileSection>

                {/* Location Information */}
                <ProfileSection
                  title="Location"
                  icon={<Globe className="text-primary" />}
                >
                  <DetailItem
                    label="Country"
                    value={countryName}
                    icon={<Briefcase size={14} />}
                  />
                  <DetailItem
                    label="City & State"
                    value={`${user.address?.city || "—"}, ${stateName}`}
                    icon={<MapPin size={14} />}
                  />
                </ProfileSection>
              </div>
            </div>

            <div>
              <Card className="rounded-sm border-none  overflow-hidden">
                <div className="p-6 border-b bg-muted/30 flex items-center justify-between">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Saved Locations
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setAddressModalOpen(true)} className="text-primary hover:text-primary">
                    + Add New
                  </Button>
                </div>
                <CardContent className="p-6">
                  {user.addresses && user.addresses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {user.addresses.map((addr, i) => (
                        <div key={addr.id || i} className="flex items-start gap-4 text-left p-4 rounded-sm border border-border/40 bg-card">
                          <div className="p-2 rounded-sm bg-primary/10 text-primary shrink-0 mt-0.5">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold leading-tight flex items-center gap-2">
                              {addr.street}
                              {addr.is_default && <Badge variant="secondary" className="text-[9px] px-1.5 h-4 bg-emerald-500/10 text-emerald-600">Default</Badge>}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              {addr.city}, {addr.state} {addr.postal_code}
                            </p>
                            <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest mt-1">
                              {addr.country === "NG" ? "Nigeria" : addr.country}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : user.address ? (
                    <div className="flex items-start gap-4 text-left p-4 rounded-sm border border-border/40 bg-card">
                      <div className="p-2 rounded-sm bg-primary/10 text-primary shrink-0">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold leading-tight">
                          {user.address.street}
                          <Badge variant="secondary" className="ml-2 text-[9px] px-1.5 h-4">Default</Badge>
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {user.address.city}, {stateName} {user.address.postal_code}
                        </p>
                        <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest mt-1">
                          {countryName}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic text-left">
                      No saved locations found. Add one for rapid checkout.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* PERFORMANCE SECTION */}
            {user.account_type === "vendor" && (
              <div>
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-sm p-6 text-white  relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Star size={120} />
                  </div>

                  <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                    <ShieldCheck className="text-primary h-6 w-6" />
                    Performance Metrics
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
                    <StatCard
                      label="Average Rating"
                      value={String(user.rating_average || "0.0")}
                      subtext="From client reviews"
                    />
                    <StatCard
                      label="Total Reviews"
                      value={String(user.review_count || "0")}
                      subtext="Across all products"
                    />
                    <StatCard
                      label="Total Sales"
                      value="—"
                      subtext="In the last 30 days"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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

      <AddressRequiredModal
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        mode="create"
      />
    </main>
  );
}

/* ───────────────── SUB-COMPONENTS ───────────────── */

function ProfileSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-sm border-none  overflow-hidden h-full">
      <div className="px-6 py-4 border-b bg-muted/30 flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
      <CardContent className="p-6 space-y-5">{children}</CardContent>
    </Card>
  );
}

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 text-left">
      <div className="mt-1 p-1.5 rounded-sm bg-muted text-muted-foreground shrink-0">
        {icon}
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
          {label}
        </p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">
        {label}
      </p>
      <p className="text-4xl font-extrabold text-primary">{value}</p>
      <p className="text-slate-400 text-[10px] italic">{subtext}</p>
    </div>
  );
}

/* ───────────────── SKELETON ───────────────── */

function UserProfileSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 pb-20 transition-colors duration-300">
      <div className="h-64 md:h-80 bg-muted animate-pulse" />
      <div className="w-full mx-auto px-4 -mt-32 md:-mt-40 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <Skeleton className="h-[500px] w-full rounded-sm" />
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Skeleton className="h-48 rounded-sm" />
            <Skeleton className="h-48 rounded-sm" />
          </div>
          <Skeleton className="h-64 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
