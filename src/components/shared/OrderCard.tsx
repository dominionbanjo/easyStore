import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { buildRoute } from "@/routes";

interface OrderCardProps {
  id: number;
  productId: number;
  name: string;
  image: string;
  price: string;
  date: string;
  status: "Pending" | "Shipped" | "Delivered";
}

export default function OrderCard({
  id,
  productId,
  name,
  image,
  price,
  date,
  status,
}: OrderCardProps) {
  const statusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "Shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <Card className="overflow-hidden hover: transition-all rounded-sm bg-white">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-center line-clamp-2">
          {name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">
            Ordered on {date}
          </span>
          <Badge className={`${statusColor(status)}`}>{status}</Badge>
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <span className="font-medium text-lg">{price}</span>
        </div>

        <div className="flex justify-between gap-2 pt-2">
          <Link to={buildRoute.orderDetails(id.toString())} className="flex-1">
            <Button
              size="sm"
              variant="outline"
              className="w-full rounded-sm border-border hover:bg-muted/60"
            >
              View Order
            </Button>
          </Link>
          <Link to={`/product/${productId}`} className="flex-1">
            <Button
              size="sm"
              className="w-full rounded-sm bg-primary text-primary-foreground hover:bg-primary/90"
            >
              View Product
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
