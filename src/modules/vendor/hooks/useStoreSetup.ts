import { useMemo } from "react";
import { useGetMyStoreQuery } from "@/services/storeApi";

export type SetupStep = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  impact: number; // contribution to total 100%
};

export function useStoreSetup() {
  const { data: store, isLoading } = useGetMyStoreQuery();

  const setupSteps = useMemo(() => {
    if (!store) return [];

    const steps: SetupStep[] = [
      {
        id: "name",
        title: "Store Name",
        description: "Your store needs a name to be identified by customers.",
        isCompleted: !!store.store_name,
        impact: 30,
      },
      {
        id: "description",
        title: "Store Description",
        description: "Tell your story and what you sell.",
        isCompleted: !!store.description,
        impact: 10,
      },
      {
        id: "cover",
        title: "Cover Image",
        description: "Upload a banner to make your store look professional.",
        isCompleted: !!store.cover_image,
        impact: 10,
      },
      {
        id: "contact",
        title: "Contact Information",
        description: "Provide an email and phone number for support.",
        isCompleted: !!(store.email && store.phone_number),
        impact: 10,
      },
      {
        id: "address",
        title: "Physical Address",
        description: "Where is your business located?",
        isCompleted: !!store.address_street,
        impact: 20,
      },
      {
        id: "payout",
        title: "Payout Details",
        description: "Verify your bank account to receive payments.",
        isCompleted: !!store.payout_verified,
        impact: 20,
      },
    ];

    return steps;
  }, [store]);

  const progress = useMemo(() => {
    return setupSteps.reduce(
      (acc, step) => acc + (step.isCompleted ? step.impact : 0),
      0,
    );
  }, [setupSteps]);

  const isReady = progress === 100;

  const missingSteps = useMemo(() => {
    return setupSteps.filter((s) => !s.isCompleted);
  }, [setupSteps]);

  return {
    store,
    isLoading,
    progress,
    isReady,
    setupSteps,
    missingSteps,
    isValidated: !!store?.payout_verified && !!store?.recipient_code,
  };
}
