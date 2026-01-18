import { Button } from "@/components/ui/button";

export function ActionsSection({ creating, onCreate }: any) {
  return (
    <div className="flex gap-4">
      <Button type="submit" variant="outline" className="flex-1">
        Preview Product
      </Button>

      <Button
        type="button"
        className="flex-1"
        onClick={onCreate}
        disabled={creating}
      >
        {creating ? "Creating…" : "Create Product"}
      </Button>
    </div>
  );
}
