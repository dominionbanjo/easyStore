import { useState } from "react";
import { Store, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateStoreModal } from "@/modules/vendor/components/modals/CreateStoreModal";

export function NoStoreBanner() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <div className="px-6 py-8 border-b border-border/40 bg-gradient-to-r from-primary/5 via-primary/5 to-transparent">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-sm bg-primary/10 text-primary">
            <Store className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black uppercase tracking-tight">
              You don&apos;t have a store yet
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Create your first store to start selling products, manage orders,
              and grow your business online.
            </p>
          </div>
          <Button
            size="lg"
            className="gap-2 font-bold"
            onClick={() => setShowCreateModal(true)}
          >
            <Rocket className="h-4 w-4" />
            Create Your First Store
          </Button>
        </div>
      </div>

      <CreateStoreModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </>
  );
}