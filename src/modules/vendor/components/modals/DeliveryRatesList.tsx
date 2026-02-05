import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Country, State } from "country-state-city";

/* ───────────────── TYPES ───────────────── */

export type DeliveryRate = {
  id?: string;
  country: string; // ISO code (NG)
  state?: string | null; // ISO code (BA)
  city?: string | null;
  price: number;
  estimated_days?: number | null;
};

/* ───────────────── HELPERS ───────────────── */

function getCountryName(code: string) {
  return Country.getCountryByCode(code)?.name ?? code;
}

function getStateName(countryCode: string, stateCode?: string | null) {
  if (!stateCode) return null;

  return (
    State.getStateByCodeAndCountry(stateCode, countryCode)?.name ?? stateCode
  );
}

/* ───────────────── COMPONENT ───────────────── */

export function DeliveryRatesList({
  rates,
  onDelete,
  onEdit,
}: {
  rates: DeliveryRate[];
  onDelete?: (indexOrId: string | number) => void;
  onEdit?: (rate: DeliveryRate, index: number) => void;
}) {
  if (!rates?.length) {
    return (
      <p className="text-sm text-muted-foreground">No delivery rates set yet</p>
    );
  }

  return (
    <div className="space-y-3">
      {rates.map((rate, index) => {
        const countryName = getCountryName(rate.country);
        const stateName = getStateName(rate.country, rate.state);

        return (
          <Card
            key={rate.id ?? index}
            className="flex items-center justify-between p-3"
          >
            <div>
              <p className="text-sm font-medium">
                {countryName}
                {stateName && ` • ${stateName}`}
                {rate.city && ` • ${rate.city}`}
              </p>

              {rate.estimated_days && (
                <p className="text-xs text-muted-foreground">
                  {rate.estimated_days} day(s)
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Badge>₦{rate.price.toLocaleString()}</Badge>

              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(rate, index)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Edit
                </button>
              )}

              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(rate.id ?? index)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
