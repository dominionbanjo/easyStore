import { Button } from "@/components/ui/button";

type PaginationProps = {
  page: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
  maxVisible?: number;
};

const getVisiblePages = (
  current: number,
  total: number,
  maxVisible: number
) => {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const start = Math.max(1, current - Math.floor(maxVisible / 2));
  const end = Math.min(total, start + maxVisible - 1);

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export function Pagination({
  page,
  pages,
  hasNext,
  hasPrev,
  onPageChange,
  maxVisible = 4,
}: PaginationProps) {
  if (pages <= 1) return null;

  const visiblePages = getVisiblePages(page, pages, maxVisible);

  return (
    <div className="flex items-center justify-center gap-2 pt-6 flex-wrap">
      {/* Prev */}
      <Button
        size="sm"
        variant="outline"
        disabled={!hasPrev}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </Button>

      {/* Page numbers */}
      {visiblePages.map((p) => (
        <Button
          key={p}
          size="sm"
          variant={p === page ? "default" : "outline"}
          onClick={() => onPageChange(p)}
        >
          {p}
        </Button>
      ))}

      {/* Ellipsis + last page */}
      {pages > maxVisible && !visiblePages.includes(pages) && (
        <>
          <span className="px-2 text-muted-foreground">…</span>
          <Button
            size="sm"
            variant={page === pages ? "default" : "outline"}
            onClick={() => onPageChange(pages)}
          >
            {pages}
          </Button>
        </>
      )}

      {/* Next */}
      <Button
        size="sm"
        variant="outline"
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
