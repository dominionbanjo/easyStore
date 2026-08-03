import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { getWebsitePath } from "@/utils/subdomain";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-neutral-950 px-6 py-24 transition-colors duration-300">
      <div
        className="max-w-xl w-full text-center space-y-12"
      >
        {/* Visual 404 Header */}
        <div className="relative">
          <h1
            className="text-[12rem] md:text-[16rem] font-black leading-none text-zinc-100 dark:text-white/5 select-none"
          >
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                Lost in Space?
              </h2>
              <div className="h-1 w-20 bg-primary mx-auto rounded-sm" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-md mx-auto leading-relaxed">
            The page you're looking for seems to have vanished or never existed.
            Let's get you back to safety.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <a href={getWebsitePath("/")}>
              <Button
                size="lg"
                className="h-14 px-10 rounded-sm bg-primary dark:bg-emerald-500 text-white dark:text-neutral-950 font-black   dark:-emerald-500/20 hover:scale-105 transition-all group"
              >
                <Home className="w-5 h-5 mr-3 group-hover:-translate-y-0.5 transition-transform" />
                Go Home
              </Button>
            </a>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
              className="h-14 px-10 rounded-sm border-2 border-zinc-200 dark:border-white/10 font-bold hover:bg-zinc-50 dark:hover:bg-white/5 transition-all group"
            >
              <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
