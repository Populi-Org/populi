import { AssemblySection, Footer, Header } from "@/components";

export default function AssemblyPage() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased azulejo-crazing min-h-screen">
      <Header />
      <main className="flex-grow p-6 md:p-8 max-w-7xl mx-auto w-full">
        <AssemblySection />
      </main>
      <Footer />
    </div>
  );
}
