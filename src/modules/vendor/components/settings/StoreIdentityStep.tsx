import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, Save, Loader2, Trash2 } from "lucide-react";

interface StoreIdentityStepProps {
  storeData: {
    store_name: string;
    description: string;
    category: string;
  };
  bannerPreview: string | null;
  uploadProgress: number | null;
  isDeletingBanner?: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onCategoryChange: (val: string) => void;
  onBannerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBannerRemove?: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export function StoreIdentityStep({
  storeData,
  bannerPreview,
  uploadProgress,
  isDeletingBanner,
  onInputChange,
  onCategoryChange,
  onBannerChange,
  onBannerRemove,
  onSave,
  isSaving,
}: StoreIdentityStepProps) {
  return (
    <Card className="border-none shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent pb-8">
        <CardTitle className="text-xl text-emerald-600 dark:text-emerald-400">
          Store Identity
        </CardTitle>
        <CardDescription>
          Configure how your store appears to customers.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 md:p-8 space-y-6 sm:space-y-8 -mt-4">
        {/* Banner Section */}
        <div className="space-y-4">
          <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Store Banner
          </Label>
          <div
            className={`relative h-48 rounded-3xl overflow-hidden border-2 border-dashed border-border/60 group cursor-pointer hover:border-primary/50 transition-colors ${
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
                    className="rounded-full shadow-2xl"
                  >
                    <Upload className="w-4 h-4 mr-2" /> Change Banner
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full h-9 w-9 shadow-2xl"
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
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Store Name</Label>
            <Input
              name="store_name"
              value={storeData.store_name}
              onChange={onInputChange}
              className="rounded-xl h-11"
              placeholder="e.g. Dominion Gadgets"
            />
          </div>
          <div className="space-y-2">
            <Label>Store Category</Label>
            <Select value={storeData.category} onValueChange={onCategoryChange}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                <SelectItem value="health">Health & Beauty</SelectItem>
                <SelectItem value="home">Home & Kitchen</SelectItem>
                <SelectItem value="groceries">Groceries</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>About the Store</Label>
          <textarea
            name="description"
            value={storeData.description}
            onChange={onInputChange}
            className="w-full min-h-[120px] rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Tell your customers what you sell..."
          />
        </div>

        <div className="pt-4 border-t flex justify-end">
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="rounded-full px-8 h-12 shadow-lg shadow-primary/20"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
