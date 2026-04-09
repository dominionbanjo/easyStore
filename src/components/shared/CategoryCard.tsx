// import { Card, CardHeader } from "@/components/ui/card";

// interface CategoryCardProps {
//   name: string;
//   image: string;
// }

// export default function CategoryCard({ name, image }: CategoryCardProps) {
//   return (
//     <Card className="bg-card rounded-sm overflow-hidden  hover: transition-transform duration-300 hover:-translate-y-1 cursor-pointer">
//       <img src={image} alt={name} className="w-full h-48 object-cover" />
//       <CardHeader className="text-lg font-semibold text-primary pt-4">
//         {name}
//       </CardHeader>
//     </Card>
//   );
// }

import React from "react";
import { cn } from "@/lib/utils";

type CardComponent = React.FC<{ children: React.ReactNode }> & {
  Header: React.FC<{ children: React.ReactNode }>;
  Body: React.FC<{ children: React.ReactNode }>;
  Footer: React.FC<{ children: React.ReactNode }>;
};

// ─────────────── Base Card Component (Compositional Pattern) ───────────────
const Card: CardComponent = ({ children }) => (
  <div
    className={cn(
      "group relative flex flex-col overflow-hidden rounded-sm border border-border/30 bg-gradient-to-b from-background to-muted/20  transition-all duration-300 hover: hover:-translate-y-1"
    )}
  >
    {children}
  </div>
);

Card.Header = ({ children }) => (
  <div className="relative overflow-hidden rounded-t-2xl">{children}</div>
);

Card.Body = ({ children }) => (
  <div className="p-5 text-left space-y-3">{children}</div>
);

Card.Footer = ({ children }) => (
  <div className="flex items-center justify-between border-t border-border/20 px-5 py-3 text-sm">
    {children}
  </div>
);

export default Card;
