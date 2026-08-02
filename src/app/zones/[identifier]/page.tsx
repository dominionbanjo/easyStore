import { useParams } from "react-router-dom";
import ZoneMarketplace from "@/modules/website/components/zone/ZoneMarketplace";

export default function ZoneDetailsPage() {
  const { identifier } = useParams<{ identifier: string }>();

  if (!identifier) return null;

  return <ZoneMarketplace identifier={identifier} />;
}
