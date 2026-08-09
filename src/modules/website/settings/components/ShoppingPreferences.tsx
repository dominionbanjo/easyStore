import { useEffect, useState } from "react";
import { HeartHandshake, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useGetCategoriesQuery } from "@/services/productDetailsApi";
import {
  useGetUserPreferencesQuery,
  useSaveUserPreferencesMutation,
} from "@/services/recommendationApi";
import { extractErrorMessage } from "@/utils/errorHandler";

export default function ShoppingPreferences() {
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery({ page: 1, limit: 100 });
  const { data: prefsData, isLoading: isPrefsLoading } =
    useGetUserPreferencesQuery();

  const [savePreferences, { isLoading: isSaving }] =
    useSaveUserPreferencesMutation();

  const categories = categoriesData?.data ?? [];

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (prefsData?.data?.category_ids) {
      setSelectedIds(prefsData.data.category_ids);
    }
  }, [prefsData]);

  const toggleCategory = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleSave = async () => {
    try {
      await savePreferences({ category_ids: selectedIds }).unwrap();
      toast.success("Shopping preferences saved");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const isLoading = isCategoriesLoading || isPrefsLoading;

  return (
    <Card className="p-6 bg-white rounded-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HeartHandshake className="h-5 w-5 text-primary" />
          Shopping Preferences
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Pick the categories you love. EasyStore uses these (plus your
          purchase history, wishlist and cart) to recommend products for you
          on the homepage.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-11 rounded-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => {
              const isSelected = selectedIds.includes(category.id);
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className={cn(
                    "flex items-center justify-between gap-2 px-4 py-3 rounded-sm border text-sm font-medium transition-all text-left",
                    isSelected
                      ? "bg-primary/10 border-primary/40 text-primary"
                      : "bg-muted/30 border-border/60 text-foreground hover:border-primary/30",
                  )}
                >
                  <span className="line-clamp-1">{category.name}</span>
                  {isSelected && <Check className="h-4 w-4 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isLoading}
            isLoading={isSaving}
            loadingText="Saving..."
            className="rounded-sm bg-primary text-white"
          >
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
