import { addChip, removeChip } from "../../utils/addProduct.helpers";
import ChipSection from "./ChipSection";

export function ChipsSection({
  tags,
  highlights,
  setTags,
  setHighlights,
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
    </>
  );
}
