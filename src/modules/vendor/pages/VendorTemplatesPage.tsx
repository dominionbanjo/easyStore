import { useState } from "react";
import { motion } from "framer-motion";
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
                  <motion.div
                    key={tpl.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className={`group relative flex flex-col h-full bg-card rounded-2xl overflow-hidden border transition-all duration-500 ${
                      isActive 
                        ? "border-primary shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)] ring-1 ring-primary/50" 
                        : "border-border hover:border-primary/40 shadow-sm"
                    }`}
                  >
                    {/* Preview Image */}
                    <div className="aspect-[16/10] relative w-full overflow-hidden bg-muted">
                      {tpl.preview_url ? (
                        <img
                          src={tpl.preview_url}
                          alt={tpl.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-neutral-900 dark:to-neutral-800">
                          <LayoutTemplate className="w-12 h-12 text-muted-foreground/20" />
                          <span className="absolute font-black text-4xl opacity-[0.03] italic uppercase tracking-[0.2em] pointer-events-none">
                            {tpl.name}
                          </span>
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-white/80 text-[10px] font-medium tracking-widest uppercase">
                          Full screen preview available
                        </span>
                      </div>

                      {isActive && (
                        <div className="absolute top-4 right-4 z-10">
                          <div className="bg-primary text-primary-foreground px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl ring-2 ring-background backdrop-blur-md animate-in zoom-in-50 duration-500">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Active Layout
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-black text-xl tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                            {tpl.name}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2 min-h-[40px]">
                          {tpl.description || "Transform your store with our specialized marketplace layout."}
                        </p>
                      </div>

                      <div className="mt-auto space-y-3">
                        {/* Secondary Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setActiveTab("customize")}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-secondary/50 dark:bg-neutral-800/50 hover:bg-secondary dark:hover:bg-neutral-800 text-foreground font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all border border-border/50"
                          >
                            <Settings2 className="w-4 h-4 text-muted-foreground" />
                            Setup
                          </button>
                          <a
                            href={`/stores/${storeSlug}?preview_template=${tpl.name}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:scale-[1.02] active:scale-[0.98] font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg"
                          >
                            <Eye className="w-4 h-4" />
                            Preview
                          </a>
                        </div>

                        {/* Primary Action */}
                        {!isActive ? (
                          <button
                            onClick={() => handleSelectTemplate(tpl.id)}
                            disabled={isUpdating}
                            className="w-full py-3.5 bg-primary text-primary-foreground hover:opacity-95 active:scale-[0.99] font-black text-xs uppercase tracking-[0.1em] rounded-xl transition-all disabled:opacity-50 flex justify-center items-center shadow-xl shadow-primary/20"
                          >
                            {updatingTemplateId === tpl.id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Applying...
                              </>
                            ) : (
                              "Activate Template"
                            )}
                          </button>
                        ) : (
                          <div className="w-full py-3.5 border-2 border-primary/20 bg-primary/5 text-primary text-center font-black text-xs uppercase tracking-[0.1em] rounded-xl cursor-default">
                             Current Selection
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
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
