import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { IPagination } from "@/types/product/productTypes";

export interface PaginatedEnvelope<TItem> {
  status?: string;
  message?: string;
  data: {
    items: TItem[];
    pagination: IPagination;
  };
}

export interface SearchEnvelope<TItem> extends PaginatedEnvelope<TItem> {
  data: {
    items: TItem[];
    pagination: IPagination;
    filters: Record<string, string[]>;
  };
}

interface UseInfiniteListConfig {
  limit?: number;
  enabled?: boolean;
  key?: string;
  /** Pixels of runway before the sentinel where the next page prefetches (default 1500). */
  prefetchMargin?: number;
}

interface InfiniteQueryOptions {
  skip?: boolean;
  keepPreviousData?: boolean;
}

export interface InfiniteQueryCallable<TEnvelope> {
  (args: unknown, options?: InfiniteQueryOptions): {
    data?: TEnvelope;
    currentData?: TEnvelope;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    refetch: () => void;
  };
}

export interface UseInfiniteListResult<TItem extends { id: string }> {
  items: TItem[];
  total: number;
  page: number;
  hasMore: boolean;
  hasLoaded: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  isInitialError: boolean;
  pageLoadFailed: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  loadMore: () => void;
}

export const useInfiniteList = <
  TItem extends { id: string },
  Args extends object,
  TEnvelope extends PaginatedEnvelope<TItem> = PaginatedEnvelope<TItem>,
>(
  useQuery: (
    args: never,
    options?: InfiniteQueryOptions,
  ) => {
    data?: TEnvelope;
    currentData?: TEnvelope;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    refetch: () => void;
  },
  buildArgs: (page: number) => Args,
  config: UseInfiniteListConfig = {},
): UseInfiniteListResult<TItem> & { currentData?: TEnvelope } => {
  const { limit = 20, enabled = true, key, prefetchMargin = 1500 } = config;

  const pendingRef = useRef(0);
  const failedPageRef = useRef<number | null>(null);
  const stateRef = useRef<{
    key?: string;
    page: number;
    items: TItem[];
  }>({ key, page: 1, items: [] });

  const [state, setState] = useState<{
    key?: string;
    page: number;
    items: TItem[];
    hasLoaded: boolean;
  }>({ key, page: 1, items: [], hasLoaded: false });

  if (state.key !== key) {
    pendingRef.current = 0;
    failedPageRef.current = null;
    setState({ key, page: 1, items: [], hasLoaded: false });
  }

  stateRef.current = state;

  const args = useMemo(
    () => ({ ...buildArgs(state.page), limit }),
    [buildArgs, state.page, limit],
  );

  const queryCallable = useQuery as InfiniteQueryCallable<TEnvelope>;
  const { data, currentData, isLoading, isFetching, isError, refetch } =
    queryCallable(args, {
      skip: !enabled,
      keepPreviousData: true,
    });

  const fetchingRef = useRef(false);
  fetchingRef.current = isFetching;

  const pagination = (currentData ?? data)?.data?.pagination;
  const hasMore = enabled ? (pagination?.hasNext ?? false) : false;

  const hasMoreRef = useRef(hasMore);
  hasMoreRef.current = hasMore;

  useLayoutEffect(() => {
    const pageItems = currentData?.data?.items;
    if (!pageItems) return;

    const hadPending = pendingRef.current > 0;
    pendingRef.current = 0;
    failedPageRef.current = null;

    setState((prev) => {
      if (prev.key !== key) return prev;
      if (prev.items.length === 0) {
        return { key, page: 1, items: pageItems, hasLoaded: true };
      }
      if (!hadPending) return prev;
      const existingIds = new Set(prev.items.map((item) => item.id));
      const freshItems = pageItems.filter((item) => !existingIds.has(item.id));
      return {
        ...prev,
        hasLoaded: true,
        items:
          freshItems.length > 0
            ? [...prev.items, ...freshItems]
            : prev.items,
      };
    });
  }, [currentData, key]);

  useEffect(() => {
    if (isError) {
      pendingRef.current = 0;
      failedPageRef.current = stateRef.current.page;
    }
  }, [isError]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(() => {
    if (!hasMoreRef.current || fetchingRef.current) return;

    const failedPage = failedPageRef.current;
    if (failedPage !== null) {
      // Retry the exact page that failed instead of skipping past it.
      failedPageRef.current = null;
      pendingRef.current = failedPage;
      refetch();
      return;
    }

    const nextPage = stateRef.current.page + 1;
    if (pendingRef.current >= nextPage) return;
    pendingRef.current = nextPage;
    setState((prev) =>
      prev.key === key ? { ...prev, page: nextPage } : prev,
    );
  }, [key, refetch]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !enabled || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadMore();
        }
      },
      { rootMargin: `${prefetchMargin}px 0px` },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
    // Re-observe after every append so the next page keeps prefetching while
    // the sentinel stays within the prefetch runway (progressive background
    // loading — no wait at the bottom).
  }, [enabled, hasMore, key, loadMore, state.items.length, prefetchMargin]);

  return {
    items: state.items,
    total: pagination?.total ?? 0,
    page: state.page,
    hasMore,
    hasLoaded: state.hasLoaded,
    isLoading: enabled && isLoading,
    isFetching,
    isError,
    isInitialError: isError && !state.hasLoaded,
    pageLoadFailed: isError && state.hasLoaded,
    sentinelRef,
    loadMore,
    currentData,
  };
};
