import { FormInput } from "@/components/shared/form/FormInput";
import { FormTextarea } from "@/components/shared/form/FormTextarea";
import { CategorySelect } from "@/components/shared/form/CategorySelect";
import { Type, FolderTree, AlignLeft } from "lucide-react";
import ChipSection from "./ChipSection";
import { addChip, removeChip } from "../../utils/addProduct.helpers";

export function BasicInfoSection({ highlights, setHighlights }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          name="name"
          label="Product Name"
          placeholder="e.g. Premium Cotton Hoodie for Men"
          icon={<Type className="h-4 w-4" />}
        />

        <div className="space-y-1.5">
          <CategorySelect
            name="category_id"
            icon={<FolderTree className="h-4 w-4" />}
          />
        </div>
      </div>

      <FormTextarea
        name="description"
        label="Description (Optional)"
        rows={4}
        placeholder="Describe the product in detail. Include material, comfort, usage, fit, and any special features buyers should know about."
        icon={<AlignLeft className="h-4 w-4 mt-1" />}
      />

      <div className="pt-2">
        <ChipSection
          label="Highlights"
          values={highlights}
          onAdd={(v: string) => addChip(v, setHighlights)}
          onRemove={(v: string) => removeChip(v, setHighlights)}
          placeholder="e.g. 100% Genuine Leather, Water Resistant, etc."
        />
      </div>
    </div>
  );
}
