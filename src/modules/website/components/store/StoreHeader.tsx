import { useFormContext } from "react-hook-form";
import { Search, MapPin, X, Store } from "lucide-react";
import { NigeriaData } from "@/utils/nigeria-data";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/form/FormInput";
import { FormSelect } from "@/components/shared/form/FormSelect";

export default function StoreHeader() {
  const { watch, setValue } = useFormContext();
  const selectedState = watch("state");

  return (
    <section className="bg-white dark:bg-neutral-900 border-b border-border/60 dark:border-white/10 transition-colors duration-300">
      <div className="w-full mx-auto px-6 py-4 md:py-5 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
          {/* Title Section */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              <Store className="w-5 h-5 text-primary flex-shrink-0" />
              Explore Our Store Directory
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Discover verified sellers, unique local brands, and top-rated
              merchants.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="p-2 bg-white dark:bg-neutral-800/80 backdrop-blur-xl border border-border/50 dark:border-white/10 rounded-sm max-w-2xl">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Search className="w-4 h-4" />
                </div>
                <FormInput
                  name="search"
                  placeholder="Search stores by name..."
                  className="pl-10 !mt-0 border-0 bg-transparent focus-visible:ring-0 text-sm h-10 rounded-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:bg-white dark:focus:bg-neutral-800 transition-colors"
                />
              </div>

              <div className="md:w-px md:h-8 md:my-auto md:bg-border/60" />

              <div className="w-full md:w-[220px] flex gap-2">
                <FormSelect
                  name="state"
                  placeholder="Filter by State"
                  icon={<MapPin className="w-4 h-4" />}
                  className="flex-1"
                  options={NigeriaData.getStates().map((s) => ({
                    label: s.name,
                    value: s.name,
                  }))}
                />

                {selectedState && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 shrink-0 rounded-sm bg-destructive/5 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all"
                    onClick={() => setValue("state", "")}
                    title="Clear filter"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
