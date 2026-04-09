import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CreditCard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSettings() {
  return (
    <Card className="p-6 bg-white rounded-sm ">
      <CardHeader>
        <CardTitle>Payment & Billing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 border rounded-sm bg-gray-50">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-gray-500" />
            <p className="font-medium text-gray-800">•••• •••• •••• 3948</p>
          </div>
          <span className="text-sm text-gray-500">Expires 10/26</span>
        </div>

        <Button variant="outline" className="rounded-sm">
          <Plus className="h-4 w-4 mr-2" /> Add New Card
        </Button>
      </CardContent>
    </Card>
  );
}
