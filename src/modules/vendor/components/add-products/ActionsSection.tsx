import { Button } from "@/components/ui/button";

interface ActionsSectionProps {
  creating: boolean;
  onCreate: () => void;
  onPreview: () => void;
  onSaveDraft?: () => void;
  savingDraft?: boolean;
  submitLabel?: string;
  loadingLabel?: string;
  disabled?: boolean;
}

export function ActionsSection({
  creating,
  onCreate,
  onPreview,
  onSaveDraft,
  savingDraft,
  submitLabel = "Create Product",
  loadingLabel = "Creating…",
  disabled,
}: ActionsSectionProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4">
      {onSaveDraft && (
        <Button
          type="button"
          variant="outline"
          className="w-full md:flex-1"
          onClick={onSaveDraft}
          disabled={creating}
          isLoading={savingDraft}
          loadingText="Saving…"
        >
          Save as Draft
        </Button>
      )}

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
