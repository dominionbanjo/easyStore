import { addChip, removeChip } from "../../utils/addProduct.helpers";
import ChipSection from "./ChipSection";
import type { ProductExtras } from "./useProductExtras";

type Props = Pick<ProductExtras, "tags" | "setTags">;

export function ChipsSection({ tags, setTags }: Props) {
  return (
    <>
      <ChipSection
        label="Tags"
        values={tags}
        onAdd={(v) => addChip(v, setTags)}
        onRemove={(v) => removeChip(v, setTags)}
        placeholder="e.g. summer, eco-friendly, gift-idea, etc."
      />
    </>
  );
}
