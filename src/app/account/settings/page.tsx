import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  User,
  Lock,
  CreditCard,
  Bell,
  Settings,
  AlertTriangle,
} from "lucide-react";

import ProfileOverview from "@/modules/website/settings/components/ProfileOverview";
import PersonalInfoForm from "@/modules/website/settings/components/PersonalInfoForm";
import AccountPreferences from "@/modules/website/settings/components/AccountPreferences";
import SecuritySettings from "@/modules/website/settings/components/SecuritySettings";
import PaymentSettings from "@/modules/website/settings/components/PaymentSettings";
import NotificationSettings from "@/modules/website/settings/components/NotificationSettings";
import DangerZone from "@/modules/website/settings/components/DangerZone";

export default function SettingsPage() {
  const [tab, setTab] = useState("profile");

  return (
    <section className="min-h-screen bg-emerald-50/40 py-14 px-4">
      <div className="mx-auto space-y-10">
        {/* 🧭 Header */}
        <div className="space-y-4 ">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Settings className="h-7 w-7 text-primary" />
            Account Settings
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage your personal information, security, and preferences.
          </p>
        </div>

        {/* 🔖 Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="space-y-10">
          {/* Tab Header */}
          <div className="w-full flex justify-center">
            <TabsList
              className="
                flex flex-wrap justify-center items-center gap-3
                bg-transparent 
                rounded-sm px-0 py-0
              "
            >
              {[
                { key: "profile", icon: User, label: "Profile" },
                { key: "preferences", icon: Settings, label: "Preferences" },
                { key: "security", icon: Lock, label: "Security" },
                { key: "payment", icon: CreditCard, label: "Payment" },
                { key: "notifications", icon: Bell, label: "Notifications" },
                {
                  key: "danger",
                  icon: AlertTriangle,
                  label: "Danger Zone",
                  danger: true,
                },
              ].map(({ key, icon: Icon, label, danger }) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className={`
                    flex items-center justify-center gap-2 
                    rounded-sm text-sm font-medium transition-all
                    px-6 py-3 md:px-8 md:py-3.5
                    ${
                      danger
                        ? "text-red-600 data-[state=active]:bg-red-600 data-[state=active]:text-white"
                        : "text-gray-800 bg-gray-100 data-[state=active]:bg-neutral-900 data-[state=active]:text-white"
                    }
                    hover:bg-gray-200
                    data-[state=active]:
                    focus-visible:outline-none
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* 🧩 Tab Content */}
          <TabsContent value="profile">
            <div
              className="space-y-6"
            >
              <ProfileOverview />
              <PersonalInfoForm />
            </div>
          </TabsContent>

          <TabsContent value="preferences">
            <AccountPreferences />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="payment">
            <PaymentSettings />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="danger">
            <DangerZone />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
