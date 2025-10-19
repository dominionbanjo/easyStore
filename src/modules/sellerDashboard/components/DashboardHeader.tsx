"use client";

import { Button } from "@/components/ui/button";
import { Bell, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardHeader() {
  return (
    <header className="h-16 border-b border-border bg-white px-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold">Seller Dashboard</h1>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/images/avatar.jpg" alt="Seller" />
            <AvatarFallback>HS</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">Host Seller</span>
        </div>

        <Button variant="outline" size="sm" className="ml-4">
          <LogOut className="h-4 w-4 mr-1" /> Logout
        </Button>
      </div>
    </header>
  );
}
