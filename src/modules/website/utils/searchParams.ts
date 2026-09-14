const NUMERIC_PARAMS = ["minPrice", "maxPrice", "rating"];
const SINGLE_VALUE_PARAMS = ["q", "sort", "state"];
const IGNORED_PARAMS = ["_lr", "page", "limit", "loc"];

export interface MappedSearchArgs {
  q: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  state?: string;
  filter?: string;
}

/**
 * Maps URL search params to product search query args.
 * Dynamic (non-standard) params are collected into the unified
 * `filter` string: `Option:Value1,Value2|Option:Value2`.
 */
export function mapSearchParamsToArgs(
  searchParams: URLSearchParams,
): MappedSearchArgs {
  const params: Record<string, string | number | undefined> = {};

  searchParams.forEach((value, key) => {
    if (IGNORED_PARAMS.includes(key)) return;

    if (NUMERIC_PARAMS.includes(key)) {
      const num = Number(value);
      params[key] = isNaN(num) ? undefined : num;
    } else if (SINGLE_VALUE_PARAMS.includes(key)) {
      params[key] = value;
    } else {
      const filterStr = params.filter ? `${params.filter}|` : "";
      params.filter = `${filterStr}${key}:${value}`;
    }
  });

  const q = (params.q as string | undefined) ?? "";
  const sort = params.sort as string | undefined;
  const minPrice = params.minPrice as number | undefined;
  const maxPrice = params.maxPrice as number | undefined;
  const rating = params.rating as number | undefined;
  const state = params.state as string | undefined;
  const filter = params.filter as string | undefined;

  return {
    q,
    sort,
    minPrice,
    maxPrice,
    rating,
    state,
    filter,
  };
}

/** True when any filter (sort/price/rating/state/dynamic) is active. */
export function hasActiveBrowseFilters(searchParams: URLSearchParams): boolean {
  let active = false;
  searchParams.forEach((value, key) => {
    if (IGNORED_PARAMS.includes(key)) return;
    if (SINGLE_VALUE_PARAMS.includes(key)) {
      if (value) active = true;
    } else if (NUMERIC_PARAMS.includes(key)) {
      if (value) active = true;
    } else {
      active = true;
    }
  });
  return active;
}

/** Stable list cache key for the infinite scroll hook (strips noise params). */
export function browseKey(prefix: string, searchParams: URLSearchParams): string {
  const clean = new URLSearchParams(searchParams);
  clean.delete("_lr");
  clean.delete("page");
  clean.delete("limit");
  clean.delete("loc");
  return `${prefix}|${clean.toString()}`;
}
