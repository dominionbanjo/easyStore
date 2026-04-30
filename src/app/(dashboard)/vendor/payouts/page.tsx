"use client";

import PayoutsView from "@/modules/vendor/components/dashboard/PayoutsView";

export default function PayoutsPage() {
  return (
    <section className="pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight">Payouts</h1>
        <p className="text-muted-foreground text-sm">
          Track your earnings and payout history.
        </p>
      </div>
      <PayoutsView />
    </section>
  );
}
