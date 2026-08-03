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
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/shared/Pagination";

type PaginationState = {
  page: number;
  pages: number;
  limit?: number;
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

  /** Optional row click handler */
  onRowClick?: (row: TData) => void;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No data found.",
  className,
  pagination,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevPageRef = useRef<number | undefined>(undefined);

  // 🔢 Auto-generated Serial Number Column (Pagination Aware)
  const snColumn: ColumnDef<TData, unknown> = {
    id: "sn",
    header: () => (
      <div className="w-8 text-center font-bold text-muted-foreground">#</div>
    ),
    cell: ({ row }) => {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      return (
        <div className="w-8 text-center font-medium text-muted-foreground/80">
          {(page - 1) * limit + row.index + 1}
        </div>
      );
    },
  };

  const table = useReactTable({
    data,
    columns: [snColumn, ...columns],
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
      <div className="rounded-none border-x-0 border-y sm:rounded-sm sm:border border-border/40 bg-background overflow-hidden">
        <Table containerClassName="custom-scrollbar">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "px-2 sm:px-4 h-11 text-xs sm:text-sm whitespace-nowrap",
                      index === 0 &&
                        "sticky left-0 z-20 bg-background -[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-border/10",
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
                  {[...Array(columns.length + 1)].map((_, j) => (
                    <TableCell
                      key={j}
                      className={cn(
                        j === 0 &&
                          "sticky left-0 z-10 bg-background -[2px_0_5px_-2px_rgba(0,0,0,0.1)]",
                      )}
                    >
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(onRowClick && "cursor-pointer hover:bg-muted/80")}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "px-2 sm:px-4 py-3 sm:py-4",
                        index === 0 &&
                          "sticky left-0 z-10 bg-background -[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-border/10",
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
                  colSpan={columns.length + 1}
                  className="h-[400px] text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-300">
                    <div className="p-5 rounded-full bg-primary/5">
                      <Inbox className="h-12 w-12 text-primary/30" />
                    </div>
                    <p className="text-lg font-bold text-foreground">
                      {emptyMessage || "No data to display"}
                    </p>
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
