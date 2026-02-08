import React from "react";

interface PolicySectionProps {
  title: string;
  children: React.ReactNode;
}

export default function PolicySection({ title, children }: PolicySectionProps) {
  return (
    <div className="mb-10 last:mb-0">
      <h2 className="text-xl sm:text-2xl font-black text-foreground mb-4 flex items-center gap-3">
        <span className="w-1.5 h-6 bg-primary dark:bg-emerald-500 rounded-full block"></span>
        {title}
      </h2>
      <div className="text-muted-foreground dark:text-zinc-400 space-y-4 leading-relaxed text-base font-medium">
        {children}
      </div>
    </div>
  );
}
