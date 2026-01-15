import { Checkbox } from "@radix-ui/react-checkbox";

export function FilterStock() {
  return (
    <div>
      <h4 className="font-medium mb-3">Availability</h4>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox />
        In Stock Only
      </label>
    </div>
  );
}
