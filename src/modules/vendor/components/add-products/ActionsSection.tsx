import { Button } from "@/components/ui/button";

interface ActionsSectionProps {
  creating: boolean;
  onCreate: () => void;
  submitLabel?: string;
  loadingLabel?: string;
  disabled?: boolean;
}

export function ActionsSection({
  creating,
  onCreate,
  submitLabel = "Create Product",
  loadingLabel = "Creating…",
  disabled,
}: ActionsSectionProps) {
  return (
    <div className="flex gap-4">
      <Button type="submit" variant="outline" className="flex-1">
        Preview Product
      </Button>

      <Button
        type="button"
        className="flex-1"
        onClick={onCreate}
        disabled={disabled || creating}
      >
        {creating ? loadingLabel : submitLabel}
      </Button>
    </div>
  );
}
