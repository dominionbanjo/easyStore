import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function DangerZone() {
  return (
    <Card className="p-6 bg-white rounded-sm  border border-red-200">
      <CardHeader>
        <CardTitle className="text-red-600 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm">
          Deleting your account is permanent and cannot be undone. All your
          orders, data, and saved items will be erased.
        </p>
        <Button variant="destructive" className="rounded-sm">
          Delete My Account
        </Button>
      </CardContent>
    </Card>
  );
}
