import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

export default function ProfileOverview() {
  return (
    <Card className="p-6 bg-white rounded-xl shadow-sm">
      <CardContent className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/images/user-avatar.jpg" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            className="absolute bottom-0 right-0 rounded-full bg-primary text-white"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-semibold">Amaka Eze</h2>
          <p className="text-sm text-gray-500">amakastyle@example.com</p>
          <p className="text-sm text-gray-400 mt-1">Joined October 2025</p>
        </div>
      </CardContent>
    </Card>
  );
}
