import { Card, CardContent } from "@/components/ui/card";
import { Clock, BookOpen, ExternalLink, Play } from "lucide-react";
import { motion } from "framer-motion";

const tutorials = [
  {
    title: "The Ultimate Vendor Onboarding Guide",
    desc: "Everything you need to set up your store for success in under 10 minutes.",
    type: "Video",
    duration: "8:45",
    color: "emerald",
  },
  {
    title: "Mastering the Product Catalog",
    desc: "In-depth look at SEO-optimizing your listings and managing inventory levels.",
    type: "Guide",
    duration: "15 min read",
    color: "blue",
  },
  {
    title: "Advanced Sales Analytics",
    desc: "How to interpret your store data to make informed business decisions.",
    type: "Video",
    duration: "12:20",
    color: "purple",
  },
];

export function TutorialList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Learning Hub</h2>
          <p className="text-muted-foreground font-medium">
            Level up your selling game
          </p>
        </div>
        <button className="text-emerald-500 font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
          View All Resources <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {tutorials.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="group border-none  bg-card overflow-hidden h-full flex flex-col hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer">
              {/* Thumbnail Placeholder */}
              <div
                className={`relative aspect-video bg-${item.color}-500/10 flex items-center justify-center border-b border-border/50`}
              >
                <div
                  className={`w-16 h-16 rounded-sm bg-${item.color}-500/20 flex items-center justify-center transition-transform group-hover:scale-125 duration-700`}
                >
                  {item.type === "Video" ? (
                    <Play
                      className={`w-8 h-8 text-${item.color}-500 fill current`}
                    />
                  ) : (
                    <BookOpen className={`w-8 h-8 text-${item.color}-500`} />
                  )}
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-sm border border-border/50 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  {item.duration}
                </div>
              </div>

              <CardContent className="p-6 space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-sm bg-${item.color}-500/10 text-${item.color}-500 border border-${item.color}-500/20`}
                  >
                    {item.type}
                  </span>
                </div>
                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  {item.desc}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
