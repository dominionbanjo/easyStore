import { Button } from "@/components/ui/button";

interface ActionsSectionProps {
  creating: boolean;
  onCreate: () => void;
  onPreview: () => void;
  submitLabel?: string;
  loadingLabel?: string;
  disabled?: boolean;
}

export function ActionsSection({
  creating,
  onCreate,
  onPreview,
  submitLabel = "Create Product",
  loadingLabel = "Creating…",
  disabled,
}: ActionsSectionProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4">
      <Button
        type="button"
        variant="outline"
        className="w-full md:flex-1"
        onClick={onPreview}
      >
        Preview Product
      </Button>

      <Button
        type="button"
        className="w-full md:flex-1"
        onClick={onCreate}
        disabled={disabled}
        isLoading={creating}
        loadingText={loadingLabel}
      >
        {submitLabel}
      </Button>
    </div>
  );
}
