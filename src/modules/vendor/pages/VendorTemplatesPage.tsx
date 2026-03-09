import { useState } from "react";
import {
  useGetTemplatesQuery,
  useGetMyStoreQuery,
  useGetStoreThemeQuery,
  useUpdateStoreThemeMutation,
} from "@/services/storeApi";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Paintbrush,
  LayoutTemplate,
  Settings2,
  CheckCircle2,
  Loader2,
  Eye,
} from "lucide-react";
import type { ITemplate } from "@/types/Store/storeTypes";

export default function VendorTemplatesPage() {
  const [activeTab, setActiveTab] = useState<"gallery" | "customize">(
    "gallery",
  );
  const [updatingTemplateId, setUpdatingTemplateId] = useState<string | null>(
    null,
  );

  const { data: storeData, isLoading: storeLoading } = useGetMyStoreQuery();
  const storeId = storeData?.id;
  const storeSlug = storeData?.slug;

  const { data: templatesResp, isLoading: templatesLoading } =
    useGetTemplatesQuery();
  const templates = templatesResp || [];

  const {
    data: themeResp,
    isLoading: themeLoading,
    refetch: refetchTheme,
  } = useGetStoreThemeQuery(storeSlug || "", {
    skip: !storeSlug,
  });

  const currentTheme = themeResp;
  const currentTemplateId = currentTheme?.template?.id;

  const [updateTheme, { isLoading: isUpdating }] =
    useUpdateStoreThemeMutation();

  const handleSelectTemplate = async (templateId: string) => {
    if (!storeId) return;
    try {
      setUpdatingTemplateId(templateId);
      await updateTheme({
        id: storeId, // using id as param naming
        template_id: templateId,
      }).unwrap();
      toast.success("Template applied successfully!");
      refetchTheme();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to apply template.");
    } finally {
      setUpdatingTemplateId(null);
    }
  };

  const isLoading = storeLoading || templatesLoading || themeLoading;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Storefront Templates
        </h1>
        <p className="text-muted-foreground mt-1">
          Choose a design that perfectly matches your brand identity.
        </p>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${activeTab === "gallery" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:bg-muted/50"}`}
          >
            <LayoutTemplate className="w-5 h-5" /> Template Gallery
          </button>
          <button
            onClick={() => setActiveTab("customize")}
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${activeTab === "customize" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:bg-muted/50"}`}
          >
            <Paintbrush className="w-5 h-5" /> Customization
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="w-full h-64 rounded-xl" />
              ))}
            </div>
          ) : activeTab === "gallery" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((tpl: ITemplate) => {
                const isActive =
                  tpl.id === currentTemplateId ||
                  (!currentTemplateId && tpl.name === "Default");
                return (
                  <div
                    key={tpl.id}
                    className={`border rounded-xl overflow-hidden transition-all duration-300 group flex flex-col h-full ${isActive ? "border-primary ring-1 ring-primary shadow-lg" : "border-border hover:border-primary/50 shadow-sm hover:shadow-md"}`}
                  >
                    <div className="aspect-[16/10] bg-muted w-full relative overflow-hidden">
                      {tpl.preview_url ? (
                        <img
                          src={tpl.preview_url}
                          alt={tpl.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-zinc-100 dark:from-neutral-900 dark:to-neutral-800">
                          <span className="font-serif text-3xl opacity-10 italic uppercase tracking-widest">
                            {tpl.name}
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                      {isActive && (
                        <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xl ring-2 ring-background">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-1 bg-card">
                      <div className="mb-4">
                        <h3 className="font-bold text-xl tracking-tight">
                          {tpl.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                          {tpl.description ||
                            "Experience a unique brand-tailored marketplace layout."}
                        </p>
                      </div>

                      <div className="mt-auto space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setActiveTab("customize")}
                            className="flex items-center justify-center gap-2 py-2.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs font-bold rounded-lg transition-all uppercase tracking-tight"
                          >
                            <Paintbrush className="w-3.5 h-3.5" /> Configure
                          </button>
                          <a
                            href={`/stores/${storeSlug}?preview_template=${tpl.name}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 text-xs font-bold rounded-lg transition-all uppercase tracking-tight"
                          >
                            <Eye className="w-3.5 h-3.5" /> Preview
                          </a>
                        </div>

                        {!isActive && (
                          <button
                            onClick={() => handleSelectTemplate(tpl.id)}
                            disabled={isUpdating}
                            className="w-full py-3 bg-[var(--theme-primary)] text-white hover:opacity-90 text-xs font-black rounded-lg transition-all disabled:opacity-50 flex justify-center items-center uppercase tracking-widest shadow-lg shadow-primary/10"
                          >
                            {updatingTemplateId === tpl.id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Installing...
                              </>
                            ) : (
                              "Activate Template"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Settings2 className="w-16 h-16 text-muted-foreground mb-6" />
              <h2 className="text-2xl font-semibold mb-2">
                Advanced Customization
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Fine-tune colors and settings specifically for the{" "}
                {currentTheme?.template?.name || "Default"} template.
              </p>
              {isUpdating && (
                <div className="text-sm text-primary mb-4 animate-pulse">
                  Saving changes...
                </div>
              )}
              <div className="w-full max-w-2xl bg-card border border-border rounded-xl p-8 text-left space-y-8 shadow-sm">
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Primary Accent Color
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={
                        currentTheme?.custom_config?.primary_color ||
                        currentTheme?.template?.default_config?.primary_color ||
                        "#0f172a"
                      }
                      onChange={(e) => {
                        if (!storeId || !currentTemplateId) return;
                        const newConfig = {
                          ...currentTheme?.custom_config,
                          primary_color: e.target.value,
                        };
                        updateTheme({
                          id: storeId,
                          template_id: currentTemplateId,
                          custom_config: newConfig,
                        }).then(() => refetchTheme());
                      }}
                      className="w-12 h-12 cursor-pointer border-0 p-0 rounded-md bg-transparent"
                    />
                    <span className="text-sm text-muted-foreground">
                      Select a hex color to override the default theme accent
                      color.
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Dark Mode Default
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        currentTheme?.custom_config?.dark_mode_default ??
                        currentTheme?.template?.default_config
                          ?.dark_mode_default ??
                        false
                      }
                      onChange={(e) => {
                        if (!storeId || !currentTemplateId) return;
                        const newConfig = {
                          ...currentTheme?.custom_config,
                          dark_mode_default: e.target.checked,
                        };
                        updateTheme({
                          id: storeId,
                          template_id: currentTemplateId,
                          custom_config: newConfig,
                        }).then(() => refetchTheme());
                      }}
                      className="w-5 h-5 rounded border-muted-foreground text-primary focus:ring-primary"
                    />
                    <span className="text-sm">
                      Force dark mode styling for all visitors to your
                      storefront
                    </span>
                  </label>
                </div>

                <p className="text-xs text-muted-foreground mt-8 border-t border-border pt-6">
                  Changes map instantly to your live storefront. Visit `
                  <a
                    href={`/stores/${storeSlug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    /stores/{storeSlug}
                  </a>
                  ` to preview.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
