import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Save, Loader2, Trash2, Store, Info } from "lucide-react";
import { FormInput } from "@/components/shared/form/FormInput";
import { FormTextarea } from "@/components/shared/form/FormTextarea";

interface StoreIdentityStepProps {
  bannerPreview: string | null;
  uploadProgress: number | null;
  isDeletingBanner?: boolean;
  onBannerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBannerRemove?: () => void;
  onSave: () => void;
  isSaving: boolean;
  isValidated?: boolean;
}

export function StoreIdentityStep({
  bannerPreview,
  uploadProgress,
  isDeletingBanner,
  onBannerChange,
  onBannerRemove,
  onSave,
  isSaving,
  isValidated,
}: StoreIdentityStepProps) {
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
