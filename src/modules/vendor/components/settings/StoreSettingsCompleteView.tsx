import { useForm, FormProvider } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Location, Card as CardIcon, Save2, Shop, TruckFast } from "iconsax-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Landmark } from "lucide-react";
import { Wallet } from "iconsax-react";
import { FormSelect } from "@/components/shared/form/FormSelect";
import type { IStoreDetails } from "@/types/Store/storeTypes";
import { DeliveryLocationsSettings } from "./DeliveryLocationsSettings";
import { EscrowToggle } from "@/modules/vendor/components/dashboard/EscrowToggle";
import { InstallmentsToggle } from "@/modules/vendor/components/dashboard/InstallmentsToggle";

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
  { id: "delivery", label: "Delivery", icon: TruckFast },
  { id: "payments", label: "Payments", icon: Wallet },
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

  const payoutMethods = useForm<BankDetails>({
    defaultValues: {
      bank_code: store?.bank_code || "",
      account_number: store?.account_number || "",
      account_name: store?.bank_name || "",
    },
  });

  const { watch: watchPayout, setValue: setPayoutValue } = payoutMethods;
  const payoutBankCode = watchPayout("bank_code");
  const payoutAccountNumber = watchPayout("account_number");
  const payoutAccountName = watchPayout("account_name");

  // Calculate if bank is updatable (3 day rule)
  const lastBankUpdate = store?.last_bank_update
    ? new Date(store.last_bank_update)
    : null;
  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
  const canUpdateBank =
    !lastBankUpdate || Date.now() - lastBankUpdate.getTime() > THREE_DAYS_MS;

  const handleBankVerify = async () => {
    if (payoutAccountNumber.length !== 10 || !payoutBankCode) {
      toast.error(
        "Please provide a valid 10-digit account number and select a bank",
      );
      return;
    }
    try {
      const result = await verifyBank({
        account_number: payoutAccountNumber,
        bank_code: payoutBankCode,
      }).unwrap();
      setPayoutValue("account_name", result.account_name);
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

  const handleSaveBank = async (data: BankDetails) => {
    if (!store?.id || !data.bank_code || !data.account_number) return;
    try {
      await updateBank({
        id: store.id,
        bank_code: data.bank_code,
        account_number: data.account_number,
      }).unwrap();
      toast.success("Bank details updated successfully");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Failed to update bank details");
    }
  };

  return (
    <div className="w-full space-y-6 pb-24 md:pb-20 mt-4">
      <div className="px-1 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-bold opacity-70">
            Management & Configuration
          </p>
        </div>
        <SearchParamTabs tabs={TABS} />
      </div>

        {activeTab === "general" && (
          <div>
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
          </div>
        )}

        {activeTab === "location" && (
          <div>
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
          </div>
        )}

        {activeTab === "delivery" && (
          <div>
            <DeliveryLocationsSettings storeId={store?.id} />
          </div>
        )}

        {activeTab === "payments" && (
          <div>
            <Card className="border-border/40 overflow-hidden bg-card/50 backdrop-blur-sm rounded-sm">
              <CardHeader className="bg-muted/30 p-4 sm:p-6 border-b border-border/40">
                <CardTitle className="text-lg font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <Wallet className="w-5 h-5" variant="Bold" color="currentColor" /> Payment Preferences
                </CardTitle>
                <CardDescription className="text-[10px] uppercase font-bold text-muted-foreground/60">
                  Choose how buyers pay you.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-5">
                <EscrowToggle
                  storeId={store?.id}
                  escrowEnabled={store?.escrow_enabled ?? false}
                />
                <InstallmentsToggle
                  storeId={store?.id}
                  installmentsEnabled={store?.installments_enabled ?? false}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "payout" && (
          <div>
            <FormProvider {...payoutMethods}>
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
                    <div className="p-4 md:p-5 border-r border-border/40">
                      <FormSelect
                        name="bank_code"
                        label="Bank Name"
                        placeholder="Select a Bank"
                        disabled={!canUpdateBank}
                        isSearchable
                        options={banksResponse?.data?.map((b) => ({
                          label: b.name,
                          value: b.code,
                        })) || []}
                        icon={<Landmark className="w-4 h-4 ml-1" />}
                        className="[&>label]:text-[10px] [&>label]:font-black [&>label]:uppercase [&>label]:text-muted-foreground [&>label]:ml-1 [&>label]:font-outfit"
                      />
                    </div>

                    <div className="p-4 md:p-5">
                      <div className="flex flex-col sm:flex-row items-end gap-3 sm:gap-2">
                        <div className="flex-1 w-full">
                          <FormInput
                            name="account_number"
                            label="Account Number"
                            placeholder="0123456789"
                            disabled={!canUpdateBank}
                            maxLength={10}
                            icon={<CardIcon className="h-4 w-4" />}
                            className="[&>label]:text-[10px] [&>label]:font-black [&>label]:uppercase [&>label]:text-muted-foreground [&>label]:ml-1 [&>label]:font-outfit"
                          />
                        </div>
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

                    <div className="p-4 md:p-5 pt-0 md:col-span-2">
                      <FormInput
                        name="account_name"
                        label="Verified Account Name"
                        placeholder="Account Name will appear here"
                        readOnly
                        className="[&>label]:text-[10px] [&>label]:font-black [&>label]:uppercase [&>label]:text-muted-foreground [&>label]:ml-1 [&>label]:font-outfit"
                        inputClassName="h-14 rounded-sm bg-muted/30 border-dashed border-border/60 font-black uppercase tracking-tight text-foreground/80 text-lg sm:text-2xl"
                      />
                    </div>
                  </div>

                  <div className="p-4 md:p-5 py-6 flex justify-end">
                    <Button
                      onClick={payoutMethods.handleSubmit(handleSaveBank)}
                      disabled={
                        isUpdatingBank || !payoutAccountName || !canUpdateBank
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
            </FormProvider>
          </div>
        )}
    </div>
  );
}
