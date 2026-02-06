import { motion } from "framer-motion";
import { Plus, Download, Filter, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { toast } from "sonner";

export function DashboardOverviewHeader() {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const handleShareStore = () => {
    // Ideally we'd use store slug here. Fallback to ID for now.
    const baseUrl = window.location.origin;
    const storeUrl = `${baseUrl}/stores/${currentUser?.id}`;

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
          className="hidden sm:flex gap-2 border-border/60"
          onClick={handleShareStore}
        >
          <Share2 className="h-4 w-4" />
          Share Store
        </Button>
        <Link to="/vendor/products/new">
          <Button size="sm" className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
