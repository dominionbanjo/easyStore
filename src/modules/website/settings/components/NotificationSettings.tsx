import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function NotificationSettings() {
  return (
    <Card className="p-6 bg-white rounded-sm ">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          {
            label: "Order Updates",
            desc: "Get notified about order progress.",
          },
          {
            label: "Promotions",
            desc: "Receive special offers and discounts.",
          },
          {
            label: "Wishlist Alerts",
            desc: "Be alerted when wishlist items are on sale.",
          },
        ].map((n) => (
          <div
            key={n.label}
            className="flex items-center justify-between border-b py-3"
          >
            <div>
              <Label className="font-medium">{n.label}</Label>
              <p className="text-sm text-gray-500">{n.desc}</p>
            </div>
            <Switch />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
