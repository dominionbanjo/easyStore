import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import type { ReactNode } from "react";

interface HomepageLayoutProps {
  children: ReactNode;
}

export default function HomepageLayout({ children }: HomepageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <main className="flex-1 fade-in-up mt-6 md:mt-8 lg:mt-12 max-w-[1780px] mx-auto w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}


