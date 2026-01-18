import { addChip, removeChip } from "../../utils/addProduct.helpers";
import ChipSection from "./ChipSection";

export function ChipsSection({
  tags,
  highlights,
  sizes,
  setTags,
  setHighlights,
  setSizes,
}: any) {
  return (
    <>
      <ChipSection
        label="Tags"
        values={tags}
        onAdd={(v) => addChip(v, setTags)}
        onRemove={(v) => removeChip(v, setTags)}
      />

      <ChipSection
        label="Highlights"
        values={highlights}
        onAdd={(v) => addChip(v, setHighlights)}
        onRemove={(v) => removeChip(v, setHighlights)}
      />

      <ChipSection
        label="Sizes"
        values={sizes}
        onAdd={(v) => addChip(v, setSizes)}
        onRemove={(v) => removeChip(v, setSizes)}
      />
    </>
  );
}
