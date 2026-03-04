import { addChip, removeChip } from "../../utils/addProduct.helpers";
import ChipSection from "./ChipSection";

export function ChipsSection({ tags, setTags }: any) {
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
