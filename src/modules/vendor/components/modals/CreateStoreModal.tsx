import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/form/FormInput";
import { FormSelect } from "@/components/shared/form/FormSelect";
import { useCreateStoreMutation, useLazyCheckStoreNameQuery } from "@/services/storeApi";
import { getCookieDomain } from "@/utils/subdomain";
import { useAppSelector } from "@/hooks";
import { selectCurrentUser } from "@/features/userSlice";

interface CreateStoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CreateStoreForm {
  store_name: string;
  description: string;
  current_sales_channel: string;
}

const SALES_CHANNELS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "other", label: "Other" },
];

export function CreateStoreModal({ open, onOpenChange }: CreateStoreModalProps) {
  const [createStore, { isLoading }] = useCreateStoreMutation();
  const [checkStoreName] = useLazyCheckStoreNameQuery();
  const [storeNameStatus, setStoreNameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const user = useAppSelector(selectCurrentUser);
  const methods = useForm<CreateStoreForm>({
    defaultValues: {
      store_name: "",
      description: "",
      current_sales_channel: "",
    },
  });

  const storeName = methods.watch("store_name");

  useEffect(() => {
    if (!storeName || storeName.trim().length < 3) {
      setStoreNameStatus("idle");
      return;
    }

    setStoreNameStatus("checking");

    const timer = setTimeout(async () => {
      try {
        await checkStoreName({ name: storeName.trim() }).unwrap();
        setStoreNameStatus("available");
      } catch {
        setStoreNameStatus("taken");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [storeName, checkStoreName]);

  const onSubmit = async (data: CreateStoreForm) => {
    if (!user) return;

    try {
      const result = await createStore({
        ...data,
        user_id: user.id,
        email: user.email,
      }).unwrap();

      toast.success("Store created successfully!");

      const responseData = result as any;
      if (responseData?.access_token) {
        Cookies.set("token", responseData.access_token, {
          expires: 7,
          secure: window.location.protocol === "https:",
          sameSite: "lax",
          domain: getCookieDomain(),
        });
      }

      onOpenChange(false);
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create store");
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Create a New Store"
      description="Expand your business with another store"
      footer={
        <div className="flex justify-end gap-3 p-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={methods.handleSubmit(onSubmit)}
            disabled={isLoading || storeNameStatus === "checking" || storeNameStatus === "taken"}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Store"
            )}
          </Button>
        </div>
      }
    >
      <FormProvider {...methods}>
        <div className="p-6 space-y-4">
          <div className="relative">
            <FormInput
              name="store_name"
              label="Store Name"
              placeholder="My New Store"
              rules={{ required: "Store name is required" }}
            />
            {storeNameStatus !== "idle" && (
              <div className="absolute right-3 top-[38px] text-xs">
                {storeNameStatus === "checking" && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <span className="h-3 w-3 animate-spin rounded-sm border-2 border-primary/20 border-t-primary" />
                    Checking...
                  </span>
                )}
                {storeNameStatus === "available" && (
                  <span className="text-green-600 font-bold">Available</span>
                )}
                {storeNameStatus === "taken" && (
                  <span className="text-destructive font-bold">Taken</span>
                )}
              </div>
            )}
          </div>
          <FormInput
            name="description"
            label="Description"
            placeholder="Tell customers what you sell..."
          />
          <FormSelect
            name="current_sales_channel"
            label="Where do you currently sell?"
            options={SALES_CHANNELS}
            placeholder="Select a sales channel"
          />
        </div>
      </FormProvider>
    </Modal>
  );
}