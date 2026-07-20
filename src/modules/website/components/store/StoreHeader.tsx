import { useFormContext } from "react-hook-form";
import { Search, MapPin, X, Store } from "lucide-react";
import { NigeriaData } from "@/utils/nigeria-data";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/form/FormInput";
import { FormSelect } from "@/components/shared/form/FormSelect";
import { Badge } from "@/components/ui/badge";

export default function StoreHeader() {
  const { watch, setValue } = useFormContext();
  const selectedState = watch("state");

  return (
    <section className="relative overflow-hidden bg-white dark:bg-neutral-950 border-b border-border/40 dark:border-white/5 transition-colors duration-300 pt-16 md:pt-20">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#6366f1_0.5px,transparent_0.5px)] dark:bg-[radial-gradient(#4f46e5_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
      
      {/* Vibrant Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-sm blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="w-full mx-auto px-6 py-12 md:py-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Title Section */}
          <div
            className="space-y-4"
          >
            <Badge
              variant="secondary"
              className="px-4 py-1.5 rounded-sm text-sm font-medium bg-primary/10 text-primary border-0 mb-2"
            >
              <Store className="w-3.5 h-3.5 mr-2" />
              Verified Merchants
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
              Explore Our <br className="hidden md:block" />
              <span className="text-primary italic relative inline-block">
                Store Directory
                <svg
                  className="absolute w-full h-3 -bottom-1 left-0 text-primary/20"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 50 10 100 5"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Discover verified sellers, unique local brands, and top-rated
              merchants. Shop with confidence from our trusted partners.
            </p>
          </div>

          {/* Filter Bar */}
          <div
            className="p-2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl border border-border/50 dark:border-white/10 rounded-sm  -neutral-200/40 dark: max-w-2xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <FormInput
                  name="search"
                  placeholder="Search stores by name..."
                  className="pl-12 !mt-0 border-0 bg-transparent  focus-visible:ring-0 text-base h-12 rounded-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:bg-white dark:focus:bg-neutral-800 transition-colors"
                />
              </div>

              <div className="md:w-px md:h-8 md:my-auto md:bg-border/60" />

              <div className="w-full md:w-[240px] flex gap-2">
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
                    className="h-12 w-12 shrink-0 rounded-sm bg-destructive/5 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all"
                    onClick={() => setValue("state", "")}
                    title="Clear filter"
                  >
                    <X className="h-5 w-5" />
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
