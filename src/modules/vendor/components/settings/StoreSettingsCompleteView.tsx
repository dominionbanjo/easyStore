import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Location, Card as CardIcon, Save2, Shop } from "iconsax-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormInput } from "@/components/shared/form/FormInput";
import { FormTextarea } from "@/components/shared/form/FormTextarea";
import { SearchParamTabs } from "@/components/shared/SearchParamTabs";
import {
  useUpdateStoreMutation,
  useUpdateStoreBankMutation,
} from "@/services/storeApi";
import {
  useVerifyBankAccountMutation,
  useGetNigerianBanksQuery,
} from "@/services/userApi";
import type { IStoreDetails } from "@/types/Store/storeTypes";

interface StoreSettingsCompleteViewProps {
  store: IStoreDetails;
  bannerPreview: string | null;
}

interface GeneralSettingsInput {
  store_name: string;
  description: string;
  email: string;
  phone_number: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_country: string;
}

interface BankDetails {
  bank_code: string;
  account_number: string;
  account_name: string;
}

const TABS = [
  { id: "general", label: "General", icon: Shop },
  { id: "location", label: "Location", icon: Location },
  { id: "payout", label: "Payout", icon: CardIcon },
];

export function StoreSettingsCompleteView({
  store,
}: StoreSettingsCompleteViewProps) {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "general";

  const [updateStore, { isLoading: isUpdatingStore }] =
    useUpdateStoreMutation();
  const [updateBank, { isLoading: isUpdatingBank }] =
    useUpdateStoreBankMutation();
  const { data: banksResponse } = useGetNigerianBanksQuery();
  const [verifyBank, { isLoading: isVerifyingBank }] =
    useVerifyBankAccountMutation();

  const methods = useForm<GeneralSettingsInput>({
    defaultValues: {
      store_name: store?.store_name || "",
      description: store?.description || "",
      email: store?.email || "",
      phone_number: store?.phone_number || "",
      address_street: store?.address_street || "",
      address_city: store?.address_city || "",
      address_state: store?.address_state || "",
      address_country: store?.address_country || "Nigeria",
    },
  });

  const [bankData, setBankData] = useState<BankDetails>({
    bank_code: store?.bank_code || "",
    account_number: store?.account_number || "",
    account_name: store?.bank_name || "",
  });

  // Calculate if bank is updatable (3 day rule)
  const lastBankUpdate = store?.last_bank_update
    ? new Date(store.last_bank_update)
    : null;
  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
  const canUpdateBank =
    !lastBankUpdate || Date.now() - lastBankUpdate.getTime() > THREE_DAYS_MS;

  const handleBankVerify = async () => {
    if (bankData.account_number.length !== 10 || !bankData.bank_code) {
      toast.error(
        "Please provide a valid 10-digit account number and select a bank",
      );
      return;
    }
    try {
      const result = await verifyBank({
        account_number: bankData.account_number,
        bank_code: bankData.bank_code,
      }).unwrap();
      setBankData((prev) => ({ ...prev, account_name: result.account_name }));
      toast.success("Bank account verified!");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Verification failed");
    }
  };

  const handleSaveGeneral = async (data: GeneralSettingsInput) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      await updateStore({ id: store.id, data: formData }).unwrap();
      toast.success("Store details updated successfully");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to update store details");
    }
  };

  const handleSaveBank = async () => {
    if (!store?.id || !bankData.bank_code || !bankData.account_number) return;
    try {
      await updateBank({
        id: store.id,
        bank_code: bankData.bank_code,
        account_number: bankData.account_number,
      }).unwrap();
      toast.success("Bank details updated successfully");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to update bank details");
    }
  };

  return (
    <div className="w-full space-y-6 pb-20 mt-4">
      <div className="px-1 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-bold opacity-70">
            Management & Configuration
          </p>
        </div>
        <SearchParamTabs tabs={TABS} />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "general" && (
          <motion.div
            key="general"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <FormProvider {...methods}>
              <Card className="border-border/40 overflow-hidden bg-card/50 backdrop-blur-sm rounded-sm">
                <CardHeader className="bg-muted/30 p-4 sm:p-6 border-b border-border/40">
                  <CardTitle className="text-lg font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <Shop className="w-5 h-5" variant="Bold" color="currentColor" /> General Details
                  </CardTitle>
                  <CardDescription className="text-[10px] uppercase font-bold text-muted-foreground/60">
                    View and edit your store's identity and basic information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-border/40">
                    <div className="p-4 md:p-5 border-r border-border/40">
                      <FormInput
                        name="store_name"
                        label="Store Name"
                        placeholder="Your Store Name"
                      />
                    </div>
                    <div className="p-4 md:p-5 border-r border-border/40">
                      <FormInput
                        name="email"
                        label="Support Email"
                        type="email"
                        placeholder="support@mystore.com"
                      />
                    </div>
                    <div className="p-4 md:p-5">
                      <FormInput
                        name="phone_number"
                        label="Support Phone"
                        placeholder="+234..."
                      />
                    </div>
                  </div>
                  <div className="p-4 md:p-5">
                    <FormTextarea
                      name="description"
                      label="About the Store"
                      placeholder="Describe your store..."
                    />
                  </div>

                  <div className="p-4 md:p-5 pt-0 flex justify-end">
                    <Button
                      onClick={methods.handleSubmit(handleSaveGeneral)}
                      disabled={isUpdatingStore}
                      className="rounded-sm px-10 h-12 font-black uppercase tracking-widest text-xs bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/10"
                    >
                      {isUpdatingStore ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Save2 className="w-4 h-4 mr-2" variant="Bold" color="currentColor" />
                      )}
                      Save Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </FormProvider>
          </motion.div>
        )}

        {activeTab === "location" && (
          <motion.div
            key="location"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <FormProvider {...methods}>
              <Card className="border-border/40 overflow-hidden bg-card/50 backdrop-blur-sm rounded-sm">
                <CardHeader className="bg-muted/30 p-4 sm:p-6 border-b border-border/40">
                  <CardTitle className="text-lg font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <Location className="w-5 h-5" variant="Bold" color="currentColor" /> Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-4 md:p-5 border-b border-border/40">
                    <FormInput
                      name="address_street"
                      label="Street Address"
                      placeholder="123 Store Lane"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-border/40">
                    <div className="p-4 md:p-5 border-r border-border/40">
                      <FormInput
                        name="address_city"
                        label="City"
                        placeholder="City"
                      />
                    </div>
                    <div className="p-4 md:p-5">
                      <FormInput
                        name="address_state"
                        label="State"
                        placeholder="State"
                      />
                    </div>
                  </div>
                  <div className="p-4 md:p-5 pt-6 flex justify-end">
                    <Button
                      onClick={methods.handleSubmit(handleSaveGeneral)}
                      disabled={isUpdatingStore}
                      className="rounded-sm px-10 h-12 font-black uppercase tracking-widest text-xs bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/10"
                    >
                      {isUpdatingStore ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Save2 className="w-4 h-4 mr-2" variant="Bold" color="currentColor" />
                      )}
                      Save Location
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </FormProvider>
          </motion.div>
        )}

        {activeTab === "payout" && (
          <motion.div
            key="payout"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-border/40 overflow-hidden bg-card/50 backdrop-blur-sm rounded-sm">
              <CardHeader className="bg-muted/30 p-4 sm:p-6 border-b border-border/40">
                <CardTitle className="text-lg font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <CardIcon className="w-5 h-5" variant="Bold" color="currentColor" /> Bank & Payout
                </CardTitle>
                <CardDescription className="text-[10px] uppercase font-bold text-muted-foreground/60">
                  Manage where you receive your payments.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {!canUpdateBank && (
                  <div className="m-4 md:m-5 bg-amber-500/10 text-amber-600 dark:text-amber-400 p-4 rounded-sm text-[11px] font-bold uppercase tracking-wider border border-amber-500/20">
                    <strong>Notice:</strong> Your bank account was updated
                    recently. For security reasons, you can only change your
                    payout details once every 3 days.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-border/40">
                  <div className="p-4 md:p-5 border-r border-border/40 space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground ml-1 font-outfit">
                      Bank Name
                    </Label>
                    <select
                      disabled={!canUpdateBank}
                      className="flex h-12 w-full items-center justify-between rounded-sm border border-border/40 bg-muted/20 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                      value={bankData.bank_code}
                      onChange={(e) =>
                        setBankData({ ...bankData, bank_code: e.target.value })
                      }
                    >
                      <option value="">Select a Bank</option>
                      {banksResponse?.data?.map((b) => (
                        <option key={b.code} value={b.code}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-4 md:p-5 space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground ml-1 font-outfit">
                      Account Number
                    </Label>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                      <Input
                        disabled={!canUpdateBank}
                        value={bankData.account_number}
                        onChange={(e) =>
                          setBankData({
                            ...bankData,
                            account_number: e.target.value,
                          })
                        }
                        className="h-12 rounded-sm bg-muted/20 border-border/40 focus:ring-1"
                        placeholder="0123456789"
                        maxLength={10}
                      />
                      <Button
                        variant="secondary"
                        className="h-12 rounded-sm w-full sm:w-auto px-8 font-black uppercase tracking-widest text-[10px]"
                        onClick={handleBankVerify}
                        disabled={isVerifyingBank || !canUpdateBank}
                      >
                        {isVerifyingBank ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Verify"
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 md:p-5 pt-0 md:col-span-2 space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground ml-1 font-outfit">
                      Verified Account Name
                    </Label>
                    <Input
                      value={bankData.account_name}
                      readOnly
                      className="h-14 rounded-sm bg-muted/30 border-dashed border-border/60 font-black uppercase tracking-tight text-foreground/80 text-lg sm:text-2xl"
                      placeholder="Account Name will appear here"
                    />
                  </div>
                </div>

                <div className="p-4 md:p-5 py-6 flex justify-end">
                  <Button
                    onClick={handleSaveBank}
                    disabled={
                      isUpdatingBank || !bankData.account_name || !canUpdateBank
                    }
                    className="rounded-sm px-10 h-12 font-black uppercase tracking-widest text-xs bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/10"
                  >
                    {isUpdatingBank ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Save2 className="w-4 h-4 mr-2" variant="Bold" color="currentColor" />
                    )}
                    Update Bank Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
