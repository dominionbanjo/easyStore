import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Save, Loader2, Trash2, Store, Info, Globe, Check, X, AlertCircle } from "lucide-react";
import { FormInput } from "@/components/shared/form/FormInput";
import { FormTextarea } from "@/components/shared/form/FormTextarea";
import { useLazyCheckSubdomainQuery } from "@/services/storeApi";

interface StoreIdentityStepProps {
  bannerPreview: string | null;
  uploadProgress: number | null;
  isDeletingBanner?: boolean;
  onBannerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBannerRemove?: () => void;
  onSave: () => void;
  isSaving: boolean;
  isValidated?: boolean;
  storeId?: string;
}

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export function StoreIdentityStep({
  bannerPreview,
  uploadProgress,
  isDeletingBanner,
  onBannerChange,
  onBannerRemove,
  onSave,
  isSaving,
  isValidated,
  storeId,
}: StoreIdentityStepProps) {
  const { watch, setError, clearErrors, setValue, register } = useFormContext();
  const subdomainValue = watch("subdomain");
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [triggerCheckSubdomain] = useLazyCheckSubdomainQuery();

  useEffect(() => {
    if (!subdomainValue) {
      setAvailable(null);
      setValidationError(null);
      clearErrors("subdomain");
      return;
    }

    const cleanSubdomain = subdomainValue.trim().toLowerCase();
    
    const regex = /^[a-z0-9-]+$/;
    if (!regex.test(cleanSubdomain)) {
      setAvailable(false);
      setValidationError("Only lowercase letters, numbers, and dashes are allowed");
      setError("subdomain", { type: "manual", message: "Invalid format" });
      return;
    }

    if (cleanSubdomain.length < 2) {
      setAvailable(false);
      setValidationError("Subdomain must be at least 2 characters long");
      setError("subdomain", { type: "manual", message: "Too short" });
      return;
    }

    setAvailable(null);
    setValidationError(null);
    clearErrors("subdomain");
    setChecking(true);

    const delayDebounce = setTimeout(async () => {
      try {
        const response = await triggerCheckSubdomain({
          subdomain: cleanSubdomain,
          storeId,
        }).unwrap();

        if (response.data?.available) {
          setAvailable(true);
        } else {
          setAvailable(false);
          setValidationError(response.message || "This subdomain is already taken");
          setError("subdomain", { type: "manual", message: "Subdomain taken" });
        }
      } catch (err: any) {
        setAvailable(false);
        setValidationError(err?.data?.message || "Subdomain is already taken or invalid");
        setError("subdomain", { type: "manual", message: "Subdomain invalid" });
      } finally {
        setChecking(false);
      }
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [subdomainValue, storeId, triggerCheckSubdomain, setError, clearErrors]);

  const host = window.location.host;
  const cleanBaseDomain = host.replace(/^(vendor\.|admin\.)/, "");
  return (
    <Card className="border-none  overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent px-0 py-6">
        <CardTitle className="text-xl text-emerald-600 dark:text-emerald-400">
          Store Identity
        </CardTitle>
        <CardDescription>
          Configure how your store appears to customers.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 py-6 space-y-6 sm:space-y-8 -mt-4">
        {/* Banner Section */}
        <div className="space-y-4">
          <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Store Banner
          </Label>
          <div
            className={`relative h-48 rounded-sm overflow-hidden border-2 border-dashed border-border/60 group cursor-pointer hover:border-primary/50 transition-colors ${
              uploadProgress !== null || isDeletingBanner
                ? "pointer-events-none opacity-80"
                : ""
            }`}
            onClick={() => document.getElementById("banner-upload")?.click()}
          >
            {uploadProgress !== null ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-primary bg-muted/20">
                <Loader2 className="w-8 h-8 animate-spin" />
                <div className="text-center">
                  <p className="font-bold uppercase tracking-widest text-xs">
                    Uploading Header...
                  </p>
                  <p className="text-sm font-black mt-1">{uploadProgress}%</p>
                </div>
              </div>
            ) : isDeletingBanner ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-destructive bg-muted/20">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="font-bold uppercase tracking-widest text-xs">
                  Removing...
                </p>
              </div>
            ) : bannerPreview ? (
              <>
                <img
                  src={bannerPreview}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Banner"
                />

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm gap-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-sm "
                  >
                    <Upload className="w-4 h-4 mr-2" /> Change Banner
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-sm h-9 w-9 "
                    onClick={(e) => {
                      e.stopPropagation();
                      onBannerRemove?.();
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                <div className="h-12 w-12 rounded-sm bg-muted flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="font-bold">Upload Header Image</p>
                  <p className="text-xs opacity-60">
                    Recommended 1200 x 400px (Max 5MB)
                  </p>
                </div>
              </div>
            )}
            <input
              id="banner-upload"
              type="file"
              className="hidden"
              accept="image/*"
              disabled={uploadProgress !== null || isDeletingBanner}
              onChange={onBannerChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <FormInput
            name="store_name"
            label="Store Name"
            placeholder="e.g. Dominion Gadgets"
            icon={<Store className="w-4 h-4" />}
          />

          {/* Subdomain Selection Field */}
          <div className="space-y-2 relative">
            <Label className="text-zinc-600 dark:text-zinc-300 font-bold text-sm flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-500" />
              Store Website
            </Label>
            
            <div className="relative flex items-center rounded-sm border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:border-zinc-400 dark:hover:border-zinc-500 transition-all focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
              <div className="pl-3 pr-2 py-3 text-zinc-400 dark:text-zinc-500 flex items-center">
                <Globe className="w-4 h-4" />
              </div>
              
              <input
                {...register("subdomain")}
                type="text"
                placeholder="e.g. dominion-gadgets"
                onChange={(e) => {
                  const val = e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-\s]/g, "") // Keep letters, numbers, spaces, and dashes
                    .replace(/[\s_]+/g, "-")      // Convert space/underscore to single dash
                    .replace(/-+/g, "-");         // Collapse sequential dashes
                  setValue("subdomain", val, { shouldValidate: true, shouldDirty: true });
                }}
                className="flex-1 py-3 bg-transparent text-sm font-medium outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 border-none"
              />
              
              <div className="pr-3 text-sm font-bold text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 py-3 px-3 border-l dark:border-zinc-800 select-none">
                .{cleanBaseDomain}
              </div>

              {/* Live Availability Status Indicator */}
              <div className="absolute right-[140px] flex items-center gap-1.5 pr-2 pointer-events-none">
                {checking && (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                )}
                {!checking && available === true && (
                  <div className="flex items-center text-emerald-600 dark:text-emerald-400 gap-1 text-xs font-bold animate-fade-in bg-emerald-500/10 px-2 py-0.5 rounded-sm">
                    <Check className="w-3.5 h-3.5" /> Available
                  </div>
                )}
                {!checking && available === false && (
                  <div className="flex items-center text-destructive gap-1 text-xs font-bold animate-fade-in bg-destructive/10 px-2 py-0.5 rounded-sm">
                    <X className="w-3.5 h-3.5" /> Taken
                  </div>
                )}
              </div>
            </div>

            {/* Helper or validation error messages */}
            {validationError ? (
              <p className="text-xs font-medium text-destructive mt-1.5 flex items-center gap-1 animate-slide-up">
                <AlertCircle className="w-3.5 h-3.5" />
                {validationError}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Choose a unique web address for your store. If left blank, it will default to 
                <span className="font-bold text-emerald-600 dark:text-emerald-400 ml-1">
                  {useFormContext().watch("store_name") 
                    ? slugify(useFormContext().watch("store_name")) 
                    : "your-store-name"}
                </span>.
              </p>
            )}
          </div>

          <FormTextarea
            name="description"
            label="Store Bio"
            placeholder="Tell your customers what you sell..."
            icon={<Info className="w-4 h-4" />}
            rows={5}
          />
        </div>

        <div className="pt-4 border-t flex justify-end">
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="rounded-sm px-8 h-12   bg-emerald-600 hover:bg-emerald-700"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isValidated ? "Save Changes" : "Save & Continue"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
