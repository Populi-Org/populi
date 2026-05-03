import { Suspense } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ProposalsSection from "@/components/proposals/ProposalsSection";

export const dynamic = "force-dynamic";

export default function ProposalsPage() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased azulejo-crazing min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow p-6 md:p-8 max-w-7xl mx-auto w-full">
        <h1 className="font-headline text-3xl md:text-4xl font-bold mb-6">
          Iniciativas
        </h1>
        <Suspense fallback={null}>
          <ProposalsSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
