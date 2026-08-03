import { useState } from "react";
import {
  Globe,
  Trash2,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { SOCIAL_PLATFORMS } from "./socialPlatforms";

interface SocialLinksSectionProps {
  socialLinks: Record<string, string>;
  onUpdate: (links: Record<string, string>) => void;
}

export function SocialLinksSection({
  socialLinks,
  onUpdate,
}: SocialLinksSectionProps) {
  const [newPlatform, setNewPlatform] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleAdd = () => {
    if (!newPlatform || !newUrl) {
      toast.error("Please select a platform and provide a URL");
      return;
    }
    onUpdate({
      ...socialLinks,
      [newPlatform]: newUrl,
    });
    setNewPlatform("");
    setNewUrl("");
  };

  const handleRemove = (platform: string) => {
    const updated = { ...socialLinks };
    delete updated[platform];
    onUpdate(updated);
  };

  return (
    <div className="space-y-6 border-t pt-8 mt-8">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-black">Social Profiles</Label>
          <p className="text-xs text-muted-foreground italic">
            Add links to your social media platforms.
          </p>
        </div>
        <Badge variant="secondary" className="rounded-sm px-3">
          {Object.keys(socialLinks).length} Linked
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(socialLinks).map(([platform, url]) => {
            const config = SOCIAL_PLATFORMS.find((p) => p.id === platform);
            const Icon = config?.icon || Globe;
            return (
              <div
                key={platform}
                className="flex items-center gap-3 p-3 rounded-sm border border-border/40 group hover:border-primary/40 transition-all bg-muted/5"
              >
                <div
                  className={cn(
                    "h-9 w-9 rounded-sm bg-muted flex items-center justify-center shrink-0",
                    config?.color,
                  )}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {config?.label || platform}
                  </p>
                  <p className="text-[11px] font-medium truncate text-foreground/70">
                    {url}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemove(platform)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            );
          })}
      </div>

      <div className="pt-6 border-t border-dashed">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-4 space-y-1.5">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Select Platform</Label>
            <Select value={newPlatform} onValueChange={setNewPlatform}>
              <SelectTrigger className="h-11 rounded-sm bg-muted/20 border-border/40 focus:ring-1">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                {SOCIAL_PLATFORMS.filter((p) => !socialLinks[p.id]).map(
                  (platform) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      <div className="flex items-center gap-2">
                        <platform.icon
                          className={cn("w-4 h-4", platform.color)}
                        />
                        <span>{platform.label}</span>
                      </div>
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-6 space-y-1.5">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Profile URL / Handle</Label>
            <Input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="e.g. dominion_gadgets"
              className="h-11 rounded-sm bg-muted/20 border-border/40 focus:ring-1"
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              className="w-full h-11 rounded-sm  "
              onClick={handleAdd}
              disabled={!newPlatform || !newUrl}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
