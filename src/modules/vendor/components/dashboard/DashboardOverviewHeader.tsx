import { motion } from "framer-motion";
import { Plus, Download, Filter, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { clearProductDraft } from "@/features/productDraftSlice";

import { useGetMyStoreQuery } from "@/services/storeApi";
import { getBaseDomain } from "@/utils/subdomain";

export function DashboardOverviewHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { data: store } = useGetMyStoreQuery();

  const handleShareStore = () => {
    const baseDomain = getBaseDomain();
    const slug = store?.slug; 
    
    let storeUrl = "";
    if (slug) {
      storeUrl = `${window.location.protocol}//${slug}.${baseDomain}`;
    } else {
      const identifier = store?.id || currentUser?.id;
      storeUrl = `${window.location.protocol}//${baseDomain}/stores/${identifier}`;
    }

    navigator.clipboard.writeText(storeUrl);
    toast.success("Store link copied to clipboard! 🚀");
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {currentUser?.first_name || "Merchant"} 🪄
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your store today.
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
        <Button
          variant="outline"
          size="sm"
          className="flex gap-2 border-border/60"
          onClick={handleShareStore}
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share Store</span>
        </Button>
        <Button
          size="sm"
          className="gap-2 shadow-lg shadow-primary/20"
          onClick={() => {
            dispatch(clearProductDraft());
            navigate("/products/new");
          }}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden xs:inline">Add Product</span>
          <span className="xs:hidden">Add</span>
        </Button>
      </motion.div>
    </div>
  );
}
