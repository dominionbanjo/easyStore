import { Slider } from "@/components/ui/slider";

export function FilterPrice() {
  return (
    <div>
      <h4 className="font-medium mb-3">Price</h4>
      <Slider defaultValue={[0, 500000]} max={1000000} step={1000} />
      <div className="flex justify-between text-sm text-muted-foreground mt-2">
        <span>₦0</span>
        <span>₦1,000,000+</span>
      </div>
    </div>
  );
}
