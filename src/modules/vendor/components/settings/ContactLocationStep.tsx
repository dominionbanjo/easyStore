import { useFormContext } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Save, Loader2 } from "lucide-react";
import { SocialLinksSection } from "./SocialLinksSection";
import { FormInput } from "@/components/shared/form/FormInput";

interface ContactLocationStepProps {
  onUpdateSocials: (links: Record<string, string>) => void;
  onOpenAddressModal: () => void;
  onSave: () => void;
  isSaving: boolean;
  isValidated?: boolean;
}

export function ContactLocationStep({
  onUpdateSocials,
  onOpenAddressModal,
  onSave,
  isSaving,
  isValidated,
}: ContactLocationStepProps) {
  const { watch } = useFormContext();
  const address_street = watch("address_street");
  const address_city = watch("address_city");
  const social_links = watch("social_links");

  return (
    <Card className="border-none  overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent px-0 py-6">
        <CardTitle className="text-xl text-emerald-600 dark:text-emerald-400">
          Contact & Location
        </CardTitle>
        <CardDescription>
          Setup your business contact information and physical address.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 py-6 space-y-6 sm:space-y-8 -mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <FormInput
            name="email"
            label="Support Email"
            placeholder="support@mystore.com"
            icon={<Mail className="w-4 h-4" />}
          />
          <FormInput
            name="phone_number"
            label="Support Hot-line"
            placeholder="+234..."
            icon={<Phone className="w-4 h-4" />}
          />
        </div>

        <SocialLinksSection
          socialLinks={social_links}
          onUpdate={onUpdateSocials}
        />

        <div className="pt-6 border-t flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-sm bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="text-primary w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Store Address</h4>
              <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                {address_street
                  ? `${address_street}, ${address_city}`
                  : "Physical address not yet provided."}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="rounded-sm h-11 px-6 border-primary/20 hover:border-primary/50 text-xs font-bold uppercase transition-colors"
            onClick={onOpenAddressModal}
          >
            <MapPin className="w-3.5 h-3.5 mr-2" />
            {address_street ? "Update Address" : "Set Address"}
          </Button>
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
