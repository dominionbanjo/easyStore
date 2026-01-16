import { Checkbox } from "@radix-ui/react-checkbox";

export function FilterRating() {
  return (
    <div>
      <h4 className="font-medium mb-3">Customer Rating</h4>
      <div className="space-y-2 text-sm">
        {[4, 3, 2, 1].map((r) => (
          <label key={r} className="flex items-center gap-2">
            <Checkbox />
            {r}★ & up
          </label>
        ))}
      </div>
    </div>
  );
}
