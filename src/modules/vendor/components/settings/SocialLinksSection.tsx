import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
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

export const SOCIAL_PLATFORMS = [
  {
    id: "instagram",
    label: "Instagram",
    icon: Instagram,
    color: "text-pink-500",
  },
  { id: "facebook", label: "Facebook", icon: Facebook, color: "text-blue-600" },
  { id: "twitter", label: "Twitter / X", icon: Twitter, color: "text-sky-500" },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-blue-700" },
  { id: "youtube", label: "YouTube", icon: Youtube, color: "text-red-600" },
  { id: "website", label: "Website", icon: Globe, color: "text-emerald-500" },
];

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
        <Badge variant="secondary" className="rounded-full px-3">
          {Object.keys(socialLinks).length} Linked
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence>
          {Object.entries(socialLinks).map(([platform, url]) => {
            const config = SOCIAL_PLATFORMS.find((p) => p.id === platform);
            const Icon = config?.icon || Globe;
            return (
              <motion.div
                key={platform}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border/50 group hover:border-primary/30 transition-all shadow-sm"
              >
                <div
                  className={cn(
                    "h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0",
                    config?.color,
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {config?.label || platform}
                  </p>
                  <p className="text-xs font-semibold truncate text-foreground/80">
                    {url}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemove(platform)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="p-5 rounded-3xl bg-muted/30 border border-dashed border-border/60 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4">
            <Select value={newPlatform} onValueChange={setNewPlatform}>
              <SelectTrigger className="h-11 rounded-xl bg-background border-none shadow-sm">
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
          <div className="sm:col-span-6">
            <Input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Paste profile link or @username"
              className="h-11 rounded-xl border-none shadow-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              className="w-full h-11 rounded-xl shadow-lg shadow-primary/10"
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
