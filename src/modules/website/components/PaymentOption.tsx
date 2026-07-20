import { Badge } from "@/components/ui/badge";

/* ───────── PAYMENT OPTION COMPONENT ───────── */
export default function PaymentOption({
  active,
  onClick,
  icon,
  title,
  badge,
  description,
  points,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  badge?: string;
  description: string;
  points?: string[];
}) {
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-sm border cursor-pointer transition active:scale-[0.99] ${
        active
          ? "border-primary bg-primary/5"
          : "border-gray-200 hover:bg-gray-50"
      }`}
    >
      <div className="flex gap-3">
        {icon}

        <div className="text-left">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">{title}</h3>

            {badge && (
              <Badge variant="outline" className="text-primary text-xs">
                {badge}
              </Badge>
            )}
          </div>

          <p className="text-xs text-gray-600 mt-1">{description}</p>

          {points && (
            <ul className="mt-2 text-xs text-gray-500 list-disc pl-4 space-y-0.5">
              {points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
