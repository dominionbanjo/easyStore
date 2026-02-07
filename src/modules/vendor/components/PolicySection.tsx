import React from "react";

interface PolicySectionProps {
  title: string;
  children: React.ReactNode;
}

export default function PolicySection({ title, children }: PolicySectionProps) {
  return (
    <div className="mb-10 last:mb-0">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-purple-600 rounded-full block"></span>
        {title}
      </h2>
      <div className="text-gray-600 space-y-4 leading-relaxed text-base">
        {children}
      </div>
    </div>
  );
}
