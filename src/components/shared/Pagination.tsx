import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
  maxVisible?: number;
};

export function Pagination({
  page: propPage,
  pages,
  hasNext,
  hasPrev,
  onPageChange,
  maxVisible = 5,
}: PaginationProps) {
  // 🚀 Optimistic State: Change immediately when clicked
  const [activePage, setActivePage] = useState(propPage);
  const [isMobile, setIsMobile] = useState(false);

  // Sync with prop when data arrives or parent overrides
  useEffect(() => {
    setActivePage(propPage);
  }, [propPage]);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 480);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (pages <= 1) return null;

  const handlePageChange = (newPage: number) => {
    if (newPage === activePage || newPage < 1 || newPage > pages) return;
    setActivePage(newPage);
    onPageChange(newPage);
  };

  const renderPageButtons = () => {
    const buttons = [];
    const currentMaxVisible = isMobile ? 3 : maxVisible;
    const halfVisible = Math.floor(currentMaxVisible / 2);

    let start = Math.max(1, activePage - halfVisible);
    let end = Math.min(pages, start + currentMaxVisible - 1);

    if (end - start + 1 < currentMaxVisible) {
      start = Math.max(1, end - currentMaxVisible + 1);
    }

    // First page and potential ellipsis
    if (start > 1) {
      buttons.push(
        <Button
          key={1}
          variant="outline"
          size="icon"
          className="h-9 w-9 text-sm font-medium rounded-xl border-border/40 hover:bg-muted/50"
          onClick={() => handlePageChange(1)}
        >
          1
        </Button>,
      );
      if (start > 2) {
        buttons.push(
          <div
            key="ellipsis-start"
            className="flex items-center justify-center w-8 h-9 text-muted-foreground/40"
          >
            <MoreHorizontal className="h-4 w-4" />
          </div>,
        );
      }
    }

    // Middle pages
    for (let i = start; i <= end; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === activePage ? "default" : "outline"}
          size="icon"
          className={cn(
            "h-9 w-9 text-sm font-medium rounded-xl transition-all duration-200",
            i === activePage
              ? "shadow-lg shadow-primary/20 scale-105 z-10"
              : "border-border/40 hover:bg-muted/50 text-muted-foreground hover:text-foreground",
          )}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>,
      );
    }

    // Last page and potential ellipsis
    if (end < pages) {
      if (end < pages - 1) {
        buttons.push(
          <div
            key="ellipsis-end"
            className="flex items-center justify-center w-8 h-9 text-muted-foreground/40"
          >
            <MoreHorizontal className="h-4 w-4" />
          </div>,
        );
      }
      buttons.push(
        <Button
          key={pages}
          variant="outline"
          size="icon"
          className="h-9 w-9 text-sm font-medium rounded-xl border-border/40 hover:bg-muted/50"
          onClick={() => handlePageChange(pages)}
        >
          {pages}
        </Button>,
      );
    }

    return buttons;
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-1.5 p-1.5 bg-background border border-border/40 rounded-2xl shadow-sm max-w-full overflow-hidden">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-xl border-border/40 text-muted-foreground hover:bg-muted/50 disabled:opacity-30"
          disabled={!hasPrev && activePage <= 1}
          onClick={() => handlePageChange(activePage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1 sm:gap-1.5 mx-0.5 sm:mx-1">
          {renderPageButtons()}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-xl border-border/40 text-muted-foreground hover:bg-muted/50 disabled:opacity-30"
          disabled={!hasNext && activePage >= pages}
          onClick={() => handlePageChange(activePage + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
