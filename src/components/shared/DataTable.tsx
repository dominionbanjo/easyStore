import { useRef, useEffect } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/shared/Pagination";

type PaginationState = {
  page: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
};

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;

  /** Optional pagination (server-side friendly) */
  pagination?: PaginationState;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No data found.",
  className,
  pagination,
}: DataTableProps<TData, TValue>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevPageRef = useRef<number | undefined>(undefined);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // 🖱 Scroll to top on page change (with offset for sticky header)
  useEffect(() => {
    const currentPage = pagination?.page;
    const prevPage = prevPageRef.current;

    // Only scroll if the page actually changed and it's NOT the first time we're seeing a valid page
    if (
      currentPage !== undefined &&
      prevPage !== undefined &&
      currentPage !== prevPage &&
      containerRef.current
    ) {
      const headerOffset = 70; // Height of the sticky dashboard header
      const elementPosition = containerRef.current.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }

    // Always update the ref with the current page
    prevPageRef.current = currentPage;
  }, [pagination?.page]);

  return (
    <div ref={containerRef} className={cn("space-y-4", className)}>
      <div className="rounded-none border-x-0 border-y sm:rounded-xl sm:border border-border/40 bg-background overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "px-2 sm:px-4 h-11 text-xs sm:text-sm",
                      index === 0 && "sticky left-0 z-20 bg-background",
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell
                      key={j}
                      className={cn(
                        j === 0 && "sticky left-0 z-10 bg-background",
                      )}
                    >
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "px-2 sm:px-4 py-3 sm:py-4",
                        index === 0 && "sticky left-0 z-10 bg-background",
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-[400px] text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-3 animate-in fade-in zoom-in duration-300">
                    <div className="p-4 rounded-full bg-muted/50 text-muted-foreground/40">
                      <SearchX className="h-10 w-10" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-foreground">
                        No data to display
                      </p>
                      <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
                        {emptyMessage ||
                          "We couldn't find any results matching your search filters."}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}
