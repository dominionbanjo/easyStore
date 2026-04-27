import { 
  Bell, 
  MessageSquare, 
  Clock, 
  Settings, 
  Trash2, 
  Play, 
  Pause, 
  MoreVertical,
  Edit,
  Users
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { IAutomatedNotification, IBroadcast } from "@/services/adminApi";

// --- 1. Automated Notification Card ---
interface AutomatedCardProps {
  notification: IAutomatedNotification;
  onEdit: (n: IAutomatedNotification) => void;
  onToggle: (n: IAutomatedNotification) => void;
  onDelete: (id: string) => void;
  onMarkRead: (id: string) => void;
  isToggling?: boolean;
}

export const AutomatedAlertCard = ({
  notification,
  onEdit,
  onToggle,
  onDelete,
  onMarkRead: _onMarkRead,
  isToggling
}: AutomatedCardProps) => {
  const isPaused = !notification.is_active;

  return (
    <Card className={cn(
      "border-border/30 overflow-hidden group flex flex-col h-full rounded-sm relative",
      isPaused && "bg-muted/30"
    )}>
      <div className="flex flex-1 items-start p-5 gap-4">
        <div className="p-3 bg-primary/5 rounded-sm shrink-0">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-tight truncate">
                {notification.title}
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase mt-0.5 flex items-center gap-1.5">
                <span className="text-primary">{notification.type}</span>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-muted-foreground">
                  {format(new Date(notification.created_at), "MMM d, yyyy")}
                </span>
              </CardDescription>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEdit(notification)}>
                  <Edit className="h-4 w-4 mr-2" /> Edit Template
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(notification.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {notification.message}
          </p>
        </div>
      </div>

      <div className="px-5 pb-5 mt-auto flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 h-9 rounded-sm text-[11px] font-bold uppercase gap-2"
          onClick={() => onEdit(notification)}
        >
          <Settings className="h-3.5 w-3.5" /> Configure
        </Button>

        <Button 
          variant={isPaused ? "default" : "outline"}
          size="sm"
          className={cn(
            "flex-1 h-9 rounded-sm text-[11px] font-bold uppercase gap-2",
            !isPaused && "text-amber-600 border-amber-500/30 hover:bg-amber-50 hover:text-amber-700"
          )}
          onClick={() => onToggle(notification)}
          disabled={isToggling}
        >
          {isPaused ? (
            <>
              <Play className="h-3.5 w-3.5" /> Resume
            </>
          ) : (
            <>
              <Pause className="h-3.5 w-3.5" /> Pause
            </>
          )}
        </Button>
      </div>

      {isPaused && (
        <div className="absolute top-2 right-10">
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[9px] font-black uppercase px-1.5 h-4">
            PAUSED
          </Badge>
        </div>
      )}
    </Card>
  );
};

// --- 2. Manual Broadcast Card ---
interface BroadcastCardProps {
  broadcast: IBroadcast;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const ManualBroadcastCard = ({
  broadcast,
  onDelete,
  isLoading: _isLoading,
}: BroadcastCardProps) => {
  return (
    <Card className="border-border/30 overflow-hidden flex flex-col h-full rounded-sm">
      <div className="flex flex-1 items-start p-5 gap-4">
        <div className="p-3 bg-primary/5 rounded-sm shrink-0">
          <MessageSquare className="h-5 w-5 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-tight truncate">
                {broadcast.subject}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                 <Badge variant="outline" className="text-[9px] font-black uppercase h-4 px-1.5">
                    {broadcast.status}
                 </Badge>
                 <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                    <Users className="h-3 w-3" /> {broadcast.target}
                 </span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete(broadcast.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {broadcast.body}
          </p>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-border/20 bg-muted/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
           <div className="flex flex-col">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Created</span>
              <span className="text-[10px] font-black">{format(new Date(broadcast.created_at), "MMM d")}</span>
           </div>
           
           {(broadcast.scheduled_at || broadcast.is_recurring) && (
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-primary uppercase">
                   {broadcast.is_recurring ? "Recurrence" : "Scheduled"}
                </span>
                <span className="text-[10px] font-black text-primary uppercase">
                   {broadcast.is_recurring ? broadcast.recurrence_type : format(new Date(broadcast.scheduled_at!), "HH:mm")}
                </span>
              </div>
           )}
        </div>

        {broadcast.sent_at && (
           <div className="flex items-center gap-1.5 text-emerald-600">
              <Clock className="h-3 w-3" />
              <span className="text-[10px] font-black uppercase">Sent {format(new Date(broadcast.sent_at), "HH:mm")}</span>
           </div>
        )}
      </div>
    </Card>
  );
};
