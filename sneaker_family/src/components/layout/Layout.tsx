import { ReactNode } from "react";
import { Navbar } from "./Navbar"; // On réactive l'import
import { Footer } from "./Footer"; // On réactive l'import

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAF9]">
      {}
      <Navbar />

      <main className="flex-1 w-full">
        {children}
      </main>

      {}
      <Footer />
    </div>
  );
}