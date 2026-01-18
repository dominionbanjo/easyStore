import { FormInput } from "@/components/shared/form/FormInput";
import { FormTextarea } from "@/components/shared/form/FormTextarea";
import { CategorySelect } from "@/components/shared/form/CategorySelect";
import { ColorMultiSelect } from "@/components/shared/form/ColorMultiSelect";

export function BasicInfoSection() {
  return (
    <>
      <FormInput
        name="name"
        label="Product Name"
        placeholder="e.g. Premium Cotton Hoodie for Men"
      />

      <CategorySelect name="category_id" />

      <FormTextarea
        name="description"
        label="Description"
        rows={4}
        placeholder="Describe the product in detail. Include material, comfort, usage, fit, and any special features buyers should know about."
      />

      <ColorMultiSelect name="colors" />
    </>
  );
}
