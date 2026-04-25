import { motion } from "framer-motion";
import { Plus, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { useNavigate } from "react-router-dom";
import { clearProductDraft } from "@/features/productDraftSlice";

import { useGetMyStoreQuery } from "@/services/storeApi";
import { getAppPath } from "@/utils/subdomain";
import { RecordOfflineSaleModal } from "./RecordOfflineSaleModal";
import { useState } from "react";
import { StoreShareAction } from "./StoreShareAction";

export function DashboardOverviewHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { data: store } = useGetMyStoreQuery();
  const [offlineModalOpen, setOfflineModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-muted-foreground font-medium">
          Welcome back, {currentUser?.first_name || "Merchant"} 🪄. Here's what's happening today.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
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
          variant="outline"
          size="sm"
          className="flex gap-2 border-border/60"
          onClick={() => setOfflineModalOpen(true)}
        >
          <span className="hidden sm:inline">Record Offline Sale</span>
          <span className="sm:hidden">Record Sale</span>
        </Button>
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
      </motion.div>

      <RecordOfflineSaleModal
        open={offlineModalOpen}
        onOpenChange={setOfflineModalOpen}
      />
    </div>
  );
}
