import { Checkbox } from "@radix-ui/react-checkbox";

export function FilterLocation() {
  const locations = ["Lagos", "Abuja", "Port Harcourt", "Ibadan"];

  return (
    <div>
      <h4 className="font-medium mb-3">Location</h4>
      <div className="space-y-2">
        {locations.map((loc) => (
          <label key={loc} className="flex items-center gap-2 text-sm">
            <Checkbox />
            {loc}
          </label>
        ))}
      </div>
    </div>
  );
}
