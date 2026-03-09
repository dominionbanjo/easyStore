import {
  addSpec,
  updateSpec,
  removeSpec,
} from "../../utils/addProduct.helpers";
import SpecificationsSection from "./SpecificationsSection";
import type { ProductExtras } from "./useProductExtras";

type Props = Pick<ProductExtras, "specs" | "setSpecs">;

export function SpecsSection({ specs, setSpecs }: Props) {
  return (
    <SpecificationsSection
      specs={specs}
      onAdd={() => addSpec(setSpecs)}
      onUpdate={(i, f, v) => updateSpec(setSpecs, i, f, v)}
      onRemove={(i) => removeSpec(setSpecs, i)}
    />
  );
}
