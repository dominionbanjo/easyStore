import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Store, Globe, CreditCard } from "lucide-react";
import { toast } from "sonner";

import {
  useGetMyStoreQuery,
  useUpdateStoreMutation,
  useRegisterStoreBankMutation,
} from "@/services/storeApi";
import {
  useGetNigerianBanksQuery,
  useVerifyBankAccountMutation,
} from "@/services/userApi";

// Sub-components
import { SettingsHeader } from "../components/settings/SettingsHeader";
import { SettingsSidebar } from "../components/settings/SettingsSidebar";
import { StoreIdentityStep } from "../components/settings/StoreIdentityStep";
import { ContactLocationStep } from "../components/settings/ContactLocationStep";
import { PayoutSetupStep } from "../components/settings/PayoutSetupStep";
import { AddressModal } from "../components/settings/AddressModal";
import { useStoreSetup } from "../hooks/useStoreSetup";

const STEPS = [
  { id: 1, title: "Store Identity", icon: Store },
  { id: 2, title: "Contact Details", icon: Globe },
  { id: 3, title: "Payout Setup", icon: CreditCard },
];

export default function SettingsPage() {
  const { data: store, isLoading: isLoadingStore } = useGetMyStoreQuery();
  const [updateStore, { isLoading: isUpdatingStore }] =
    useUpdateStoreMutation();
  const [registerBank, { isLoading: isRegisteringBank }] =
    useRegisterStoreBankMutation();
  const { data: banksResponse } = useGetNigerianBanksQuery();
  const [verifyBank, { isLoading: isVerifyingBank }] =
    useVerifyBankAccountMutation();

  const [activeStep, setActiveStep] = useState(1);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  // Form States
  const [storeData, setStoreData] = useState({
    store_name: "",
    description: "",
    category: "",
    email: "",
    phone_number: "",
    address_street: "",
    address_city: "",
    address_state: "",
    address_country: "Nigeria",
    address_postal_code: "",
    social_links: {} as Record<string, string>,
  });

  const [bankData, setBankData] = useState({
    bank_code: "",
    account_number: "",
    account_name: "",
  });

  useEffect(() => {
    if (store) {
      setStoreData({
        store_name: store.store_name || "",
        description: store.description || "",
        category: store.category || "",
        email: store.email || "",
        phone_number: store.phone_number || "",
        address_street: store.address_street || "",
        address_city: store.address_city || "",
        address_state: store.address_state || "",
        address_country: store.address_country || "Nigeria",
        address_postal_code: store.address_postal_code || "",
        social_links: store.social_links || {},
      });
      setBannerPreview(store.cover_image);
      setBankData({
        bank_code: store.bank_code || "",
        account_number: store.account_number || "",
        account_name: store.bank_name || "",
      });
    }
  }, [store]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setStoreData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setBannerPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateSocials = (social_links: Record<string, string>) => {
    setStoreData((prev) => ({ ...prev, social_links }));
  };

  const saveStoreDetails = async () => {
    if (!store?.id) return;
    try {
      const formData = new FormData();
      Object.entries(storeData).forEach(([key, value]) => {
        if (key === "social_links") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      });
      if (bannerFile) {
        formData.append("cover_image", bannerFile);
      }

      await updateStore({ id: store.id, data: formData }).unwrap();
      toast.success("Store details updated successfully!");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to update store details");
    }
  };

  const handleVerifyBank = async () => {
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

  const handleRegisterBank = async () => {
    if (!store?.id || !bankData.bank_code || !bankData.account_number) return;
    try {
      await registerBank({
        id: store.id,
        bank_code: bankData.bank_code,
        account_number: bankData.account_number,
      }).unwrap();
      toast.success("Bank account registered successfully!");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to register bank account");
    }
  };

  if (isLoadingStore) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { progress, isValidated } = useStoreSetup();

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <SettingsHeader progress={progress} isValidated={isValidated} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <SettingsSidebar
          steps={STEPS}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        />

        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {activeStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <StoreIdentityStep
                  storeData={storeData}
                  bannerPreview={bannerPreview}
                  onInputChange={handleInputChange}
                  onCategoryChange={(val) =>
                    setStoreData((p) => ({ ...p, category: val }))
                  }
                  onBannerChange={handleBannerChange}
                  onSave={saveStoreDetails}
                  isSaving={isUpdatingStore}
                />
              </motion.div>
            )}

            {activeStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ContactLocationStep
                  storeData={storeData}
                  onInputChange={handleInputChange}
                  onUpdateSocials={handleUpdateSocials}
                  onOpenAddressModal={() => setShowAddressModal(true)}
                  onSave={saveStoreDetails}
                  isSaving={isUpdatingStore}
                />
              </motion.div>
            )}

            {activeStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <PayoutSetupStep
                  bankData={bankData}
                  banks={banksResponse?.data || []}
                  isVerifying={isVerifyingBank}
                  isRegistering={isRegisteringBank}
                  isValidated={isValidated}
                  onBankChange={(val) =>
                    setBankData((p) => ({ ...p, bank_code: val }))
                  }
                  onAccountNumberChange={(val) =>
                    setBankData((p) => ({ ...p, account_number: val }))
                  }
                  onVerify={handleVerifyBank}
                  onRegister={handleRegisterBank}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AddressModal
        open={showAddressModal}
        onOpenChange={setShowAddressModal}
        addressData={storeData}
        onChange={handleInputChange}
      />
    </div>
  );
}
