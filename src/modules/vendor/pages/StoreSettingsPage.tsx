import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Store, Globe, CreditCard } from "lucide-react";
import { toast } from "sonner";

import {
  useUpdateStoreMutation,
  useRegisterStoreBankMutation,
} from "@/services/storeApi";
import {
  useGetNigerianBanksQuery,
  useVerifyBankAccountMutation,
} from "@/services/userApi";

import {
  useGetCloudinarySignatureQuery,
  useDeleteCloudinaryImageMutation,
  type CloudinaryConfig,
} from "@/services/cloudinaryApi";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";

// Sub-components
import { SettingsHeader } from "../components/settings/SettingsHeader";
import { SettingsSidebar } from "../components/settings/SettingsSidebar";
import { StoreIdentityStep } from "../components/settings/StoreIdentityStep";
import { ContactLocationStep } from "../components/settings/ContactLocationStep";
import { PayoutSetupStep } from "../components/settings/PayoutSetupStep";
import { AddressModal } from "../components/settings/AddressModal";
import { useStoreSetup } from "../hooks/useStoreSetup";
import { StoreSettingsCompleteView } from "../components/settings/StoreSettingsCompleteView";

const STEPS = [
  { id: 1, title: "Store Identity", icon: Store },
  { id: 2, title: "Contact Details", icon: Globe },
  { id: 3, title: "Payout Setup", icon: CreditCard },
];

export default function SettingsPage() {
  const {
    store,
    isLoading: isLoadingStore,
    progress,
    isValidated,
  } = useStoreSetup();

  const [updateStore, { isLoading: isUpdatingStore }] =
    useUpdateStoreMutation();
  const [registerBank, { isLoading: isRegisteringBank }] =
    useRegisterStoreBankMutation();
  const { data: banksResponse } = useGetNigerianBanksQuery();
  const [verifyBank, { isLoading: isVerifyingBank }] =
    useVerifyBankAccountMutation();

  /* ───────── CLOUDINARY ───────── */
  const {
    data: signature,
    isLoading: signing,
    isError: signatureError,
    refetch: refetchSignature,
  } = useGetCloudinarySignatureQuery();

  const [deleteCloudinaryImage, { isLoading: isDeletingBanner }] =
    useDeleteCloudinaryImageMutation();

  const [activeStep, setActiveStep] = useState(1);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  // Banner Upload State
  const [bannerUploadProgress, setBannerUploadProgress] = useState<
    number | null
  >(null);
  const [bannerPublicId, setBannerPublicId] = useState<string | null>(null);
  const canUpload =
    Boolean(signature?.signature) && !signing && !signatureError;

  // Form States
  const [storeData, setStoreData] = useState({
    store_name: "",
    description: "",
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
      setBannerPublicId(store.cover_image_public_id);
      setBankData({
        bank_code: store.bank_code || "",
        account_number: store.account_number || "",
        account_name: store.bank_name || "",
      });
    }
  }, [store]);

  const setupStage = store?.setup_stage || 1;
  const isSetupComplete = setupStage >= 4;

  useEffect(() => {
    if (!isSetupComplete) {
      setActiveStep(setupStage);
    }
  }, [setupStage, isSetupComplete]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setStoreData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size cannot exceed 5MB");
      return;
    }

    if (!canUpload) {
      toast.error("Upload service unavailable");
      return;
    }

    try {
      const freshConfig = await refetchSignature().unwrap();
      setBannerUploadProgress(0);

      const uploaded = await uploadToCloudinary(
        file,
        freshConfig as CloudinaryConfig,
        {
          onProgress: (p) => setBannerUploadProgress(p),
        },
      );

      setBannerPreview(uploaded.url);
      setBannerPublicId(uploaded.public_id);
      toast.success("Header image uploaded");
    } catch (err) {
      toast.error("Failed to upload header image");
      console.error(err);
    } finally {
      setBannerUploadProgress(null);
      e.target.value = ""; // Reset input
    }
  };

  const handleRemoveBanner = async () => {
    if (!bannerPublicId) return;

    try {
      await deleteCloudinaryImage({ public_id: bannerPublicId }).unwrap();
      setBannerPreview(null);
      setBannerPublicId(null);
      toast.success("Header image removed");
    } catch (error) {
      console.error("Failed to delete image:", error);
      // Still clear local state if it fails? Maybe user wants to remove it from UI anyway.
      // But better to warn.
      // For now, let's force clear UI for UX, even if cloudinary fail (orphaned image is better than broken UI)
      setBannerPreview(null);
      setBannerPublicId(null);
      toast.error("Image removed from view");
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
      /* 
         Attach Banner Data:
         - If we have a preview & id, send them to update.
         - If we DON'T have them (User deleted), but store HAD them, send empty strings (or null) to clear on backend.
      */
      let nextSetupStage = setupStage;
      if (!isSetupComplete && activeStep < 3) {
        nextSetupStage = setupStage + 1;
        formData.append("setup_stage", String(nextSetupStage));
      }

      if (bannerPreview && bannerPublicId) {
        formData.append("cover_image", bannerPreview);
        formData.append("cover_image_public_id", bannerPublicId);
      } else if (store.cover_image && !bannerPreview) {
        formData.append("cover_image", "");
        formData.append("cover_image_public_id", "");
      }

      await updateStore({ id: store.id, data: formData }).unwrap();
      toast.success("Store details updated successfully!");
      if (!isSetupComplete && activeStep < 3) {
        setActiveStep(nextSetupStage);
      }
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

  // If setup is complete, show the finalized details view
  if (isSetupComplete) {
    return (
      <StoreSettingsCompleteView store={store} bannerPreview={bannerPreview} />
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <SettingsHeader progress={progress} isValidated={isValidated} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <SettingsSidebar steps={STEPS} activeStep={activeStep} />

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
                  onBannerChange={handleBannerUpload}
                  onBannerRemove={handleRemoveBanner}
                  uploadProgress={bannerUploadProgress}
                  isDeletingBanner={isDeletingBanner}
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
