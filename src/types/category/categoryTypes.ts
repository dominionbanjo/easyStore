/* ───────────────── CHILD CATEGORY ───────────────── */
export interface ICategoryChild {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  products_count: number;
}

/* ───────────────── PARENT CATEGORY ───────────────── */
export interface ICategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  products_count: number;
  children: ICategoryChild[];
}

/* ───────────────── GET ALL CATEGORIES RESPONSE ───────────────── */
export interface IGetCategoriesResponse {
  status: "success" | "error";
  message: string;
  data: ICategory[];
}

/* ───────────────── QUERY ARGS ───────────────── */
export interface GetCategoriesArgs {
  page?: number;
  limit?: number;
}
