import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Loader2, Store, MapPin, CreditCard, Save } from "lucide-react";
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
import {
  useUpdateStoreMutation,
  useUpdateStoreBankMutation,
} from "@/services/storeApi";
import {
  useGetNigerianBanksQuery,
  useVerifyBankAccountMutation,
} from "@/services/userApi";

interface StoreSettingsCompleteViewProps {
  store: any;
  bannerPreview: string | null;
}

export function StoreSettingsCompleteView({
  store,
}: StoreSettingsCompleteViewProps) {
  const [updateStore, { isLoading: isUpdatingStore }] =
    useUpdateStoreMutation();
  const [updateBank, { isLoading: isUpdatingBank }] =
    useUpdateStoreBankMutation();
  const { data: banksResponse } = useGetNigerianBanksQuery();
  const [verifyBank, { isLoading: isVerifyingBank }] =
    useVerifyBankAccountMutation();

  const methods = useForm({
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

  const [bankData, setBankData] = useState({
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
    } catch (error: any) {
      toast.error(error.data?.message || "Verification failed");
    }
  };

  const handleSaveGeneral = async (data: any) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      await updateStore({ id: store.id, data: formData }).unwrap();
      toast.success("Store details updated successfully");
    } catch (err: any) {
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
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update bank details");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 mt-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Store Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your store's information, contact details, and payout settings.
        </p>
      </div>

      <FormProvider {...methods}>
        {/* General Store Info */}
        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-6 md:p-8">
            <CardTitle className="text-xl text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <Store className="w-5 h-5" /> General Details
            </CardTitle>
            <CardDescription>
              View and edit your store's identity and contact information.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                name="store_name"
                label="Store Name"
                placeholder="Your Store Name"
              />
              <FormInput
                name="email"
                label="Support Email"
                type="email"
                placeholder="support@mystore.com"
              />
              <FormInput
                name="phone_number"
                label="Support Phone"
                placeholder="+234..."
              />
            </div>
            <FormTextarea
              name="description"
              label="About the Store"
              placeholder="Describe your store..."
            />

            <div className="pt-4 border-t flex justify-end">
              <Button
                onClick={methods.handleSubmit(handleSaveGeneral)}
                disabled={isUpdatingStore}
                className="rounded-full px-8 shadow-md hover:shadow-lg transition-all bg-emerald-600 hover:bg-emerald-700"
              >
                {isUpdatingStore ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Location Info */}
        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-6 md:p-8">
            <CardTitle className="text-xl text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Location
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <FormInput
                name="address_street"
                label="Street Address"
                placeholder="123 Store Lane"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput name="address_city" label="City" placeholder="City" />
              <FormInput
                name="address_state"
                label="State"
                placeholder="State"
              />
            </div>
            <div className="pt-4 border-t flex justify-end">
              <Button
                onClick={methods.handleSubmit(handleSaveGeneral)}
                disabled={isUpdatingStore}
                className="rounded-full px-8 shadow-md bg-emerald-600 hover:bg-emerald-700"
              >
                {isUpdatingStore ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Location
              </Button>
            </div>
          </CardContent>
        </Card>
      </FormProvider>

      {/* Payout Settings */}
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-6 md:p-8">
          <CardTitle className="text-xl text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CreditCard className="w-5 h-5" /> Bank & Payout
          </CardTitle>
          <CardDescription>
            Manage where you receive your payments.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          {!canUpdateBank && (
            <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-500 p-4 rounded-xl text-sm border border-amber-200 dark:border-amber-900/50">
              <strong>Notice:</strong> Your bank account was updated recently.
              For security reasons, you can only change your payout details once
              every 3 days.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Bank Code</Label>
              <select
                disabled={!canUpdateBank}
                className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-muted/20 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={bankData.bank_code}
                onChange={(e) =>
                  setBankData({ ...bankData, bank_code: e.target.value })
                }
              >
                <option value="">Select a Bank</option>
                {banksResponse?.data?.map((b: any) => (
                  <option key={b.code} value={b.code}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Account Number</Label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                <Input
                  disabled={!canUpdateBank}
                  value={bankData.account_number}
                  onChange={(e) =>
                    setBankData({ ...bankData, account_number: e.target.value })
                  }
                  className="h-12 rounded-xl bg-muted/20"
                  placeholder="0123456789"
                  maxLength={10}
                />
                <Button
                  variant="secondary"
                  className="h-12 rounded-xl w-full sm:w-auto px-6"
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

            <div className="space-y-2 md:col-span-2">
              <Label>Account Name</Label>
              <Input
                value={bankData.account_name}
                readOnly
                className="h-12 rounded-xl bg-muted/50 border-none font-semibold text-foreground/80"
                placeholder="Account Name will appear here"
              />
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <Button
              onClick={handleSaveBank}
              disabled={
                isUpdatingBank || !bankData.account_name || !canUpdateBank
              }
              className="rounded-full px-8 shadow-md bg-emerald-600 hover:bg-emerald-700"
            >
              {isUpdatingBank ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Update Bank Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
