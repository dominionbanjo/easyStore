import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import type { ReactNode } from "react";

interface HomepageLayoutProps {
  children: ReactNode;
}

export default function HomepageLayout({ children }: HomepageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-emerald-50 text-foreground ">
      <Header />
      <main className="flex-1 fade-in-up">{children}</main>
      <Footer />
    </div>
  );
}
