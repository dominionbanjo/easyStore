import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Save, Loader2 } from "lucide-react";
import { SocialLinksSection } from "./SocialLinksSection";

interface ContactLocationStepProps {
  storeData: {
    email: string;
    phone_number: string;
    address_street: string;
    address_city: string;
    social_links: Record<string, string>;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdateSocials: (links: Record<string, string>) => void;
  onOpenAddressModal: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export function ContactLocationStep({
  storeData,
  onInputChange,
  onUpdateSocials,
  onOpenAddressModal,
  onSave,
  isSaving,
}: ContactLocationStepProps) {
  return (
    <Card className="border-none shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent pb-8">
        <CardTitle className="text-xl text-emerald-600 dark:text-emerald-400">
          Contact & Location
        </CardTitle>
        <CardDescription>
          Setup your business contact information and physical address.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 md:p-8 space-y-6 sm:space-y-8 -mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Support Email
            </Label>
            <Input
              name="email"
              value={storeData.email}
              onChange={onInputChange}
              className="h-11 rounded-xl"
              placeholder="support@mystore.com"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" /> Support Hot-line
            </Label>
            <Input
              name="phone_number"
              value={storeData.phone_number}
              onChange={onInputChange}
              className="h-11 rounded-xl"
              placeholder="+234..."
            />
          </div>
        </div>

        <SocialLinksSection
          socialLinks={storeData.social_links}
          onUpdate={onUpdateSocials}
        />

        <div className="p-6 rounded-3xl bg-muted/40 border border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white dark:bg-card flex items-center justify-center shadow-sm">
              <MapPin className="text-primary w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold">Store Address</h4>
              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                {storeData.address_street
                  ? `${storeData.address_street}, ${storeData.address_city}`
                  : "Not set"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="rounded-full h-11 border-dashed px-6"
            onClick={onOpenAddressModal}
          >
            <MapPin className="w-4 h-4 mr-2" />
            {storeData.address_street ? "Edit Address" : "Add Address"}
          </Button>
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
