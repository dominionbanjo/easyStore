import { Plus, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { useNavigate } from "react-router-dom";
import { clearProductDraft } from "@/features/productDraftSlice";

import { useGetMyStoreQuery } from "@/services/storeApi";
import { getAppPath } from "@/utils/subdomain";
import { StoreShareAction } from "./StoreShareAction";

export function DashboardOverviewHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { data: store } = useGetMyStoreQuery();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <p className="text-muted-foreground font-medium">
          Welcome back, {currentUser?.first_name || "Merchant"} 🪄. Here's what's happening today.
        </p>
      </div>

      <div
        className="flex items-center gap-3"
      >
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex gap-2 border-border/60"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex gap-2 border-border/60"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        <StoreShareAction store={store} />
        <Button
          size="sm"
          className="gap-2  "
          onClick={() => {
            dispatch(clearProductDraft());
            navigate(getAppPath("/products/new"));
          }}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden xs:inline">Add Product</span>
          <span className="xs:hidden">Add</span>
        </Button>
      </div>
    </div>
  );
}
