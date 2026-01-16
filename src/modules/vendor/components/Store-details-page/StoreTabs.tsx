import { Button } from "@/components/ui/button";

type Props = {
  activeTab: "products" | "categories";
  onChange: (tab: "products" | "categories") => void;
};

export function StoreTabs({ activeTab, onChange }: Props) {
  return (
    <div className="flex justify-center gap-3 mt-8">
      <Button
        variant={activeTab === "products" ? "default" : "outline"}
        onClick={() => onChange("products")}
      >
        All Products
      </Button>

      <Button
        variant={activeTab === "categories" ? "default" : "outline"}
        onClick={() => onChange("categories")}
      >
        Categories
      </Button>
    </div>
  );
}
