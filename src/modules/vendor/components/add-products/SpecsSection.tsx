import {
  addSpec,
  updateSpec,
  removeSpec,
} from "../../utils/addProduct.helpers";
import SpecificationsSection from "./SpecificationsSection";

export function SpecsSection({ specs, setSpecs }: any) {
  return (
    <SpecificationsSection
      specs={specs}
      onAdd={() => addSpec(setSpecs)}
      onUpdate={(i, f, v) => updateSpec(setSpecs, i, f, v)}
      onRemove={(i) => removeSpec(setSpecs, i)}
    />
  );
}
