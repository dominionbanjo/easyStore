import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { Building, Map, MapPin, Navigation, Globe, Hash } from "lucide-react";
import { FormInput } from "@/components/shared/form/FormInput";
import { FormSelect } from "@/components/shared/form/FormSelect";
import { NigeriaData } from "@/utils/nigeria-data";
import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

interface AddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddressModal({
  open,
  onOpenChange,
}: AddressModalProps) {
  const { control, setValue, formState: { dirtyFields } } = useFormContext();
  const [countryOptions, setCountryOptions] = useState<{label: string, value: string}[]>([]);
  const [stateOptions, setStateOptions] = useState<{label: string, value: string}[]>([]);

  const countryCode = useWatch({ name: "address_country", control });

  useEffect(() => {
    setCountryOptions(NigeriaData.getCountries().map(c => ({ label: c.name, value: c.isoCode })));
  }, []);

  useEffect(() => {
    if (countryCode) {
      setStateOptions(NigeriaData.getStates().map(s => ({ label: s.name, value: s.isoCode })));
      if (dirtyFields.address_country) {
        setValue("address_state", "");
        setValue("address_city", "");
      }
    }
  }, [countryCode, setValue, dirtyFields.address_country]);

  return (
    <Modal 
      open={open} 
      onOpenChange={onOpenChange}
      className="sm:max-w-[550px]"
      contentClassName="p-0"
      footer={
        <div className="p-5 sm:p-6 flex flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-sm font-black uppercase tracking-widest text-[11px]"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 h-12 rounded-sm font-black uppercase tracking-widest text-[11px] bg-primary  "
            onClick={() => onOpenChange(false)}
          >
            Save
          </Button>
        </div>
      }
    >
      {/* Header Section */}
      <div className="p-6 sm:p-8 bg-muted/30 border-b shrink-0">
        <div className="h-12 w-12 rounded-sm bg-primary/10 flex items-center justify-center mb-4">
          <Building className="text-primary w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight">
          Store Location
        </h2>
        <p className="text-muted-foreground font-medium text-sm mt-1">
          Where is your business located? This helps buyers find you.
        </p>
      </div>

      {/* Form Body */}
      <div className="p-6 sm:p-8 pb-24 sm:pb-8 space-y-6">
        <FormInput
          name="address_street"
          label="Street Address"
          placeholder="e.g. 12 Main St, Ikeja"
          icon={<MapPin className="w-4 h-4 text-primary" />}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormSelect
            name="address_country"
            label="Country"
            options={countryOptions}
            icon={<Globe className="w-4 h-4 text-primary" />}
            placeholder="Select Country"
          />
          <FormSelect
            name="address_state"
            label="State"
            options={stateOptions}
            disabled={!countryCode}
            icon={<Navigation className="w-4 h-4 text-primary" />}
            placeholder={!countryCode ? "Select Country" : "Select State"}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormInput
            name="address_city"
            label="City"
            placeholder="Lagos"
            icon={<Map className="w-4 h-4 text-primary" />}
          />
          <FormInput
            name="address_postal_code"
            label="Postal Code"
            placeholder="100001"
            icon={<Hash className="w-4 h-4 text-primary" />}
          />
        </div>
      </div>
    </Modal>
  );
}
