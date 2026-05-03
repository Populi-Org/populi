import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function DeputyNotFound() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased azulejo-crazing min-h-screen">
      <Header />
      <main className="flex-grow px-4 py-12 md:py-24 max-w-7xl mx-auto w-full flex flex-col items-center justify-center text-center">
        <div className="border-2 border-stone-900 bg-surface glossy-finish p-8 md:p-12 max-w-lg w-full">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
            404
          </h1>
          <h2 className="font-headline text-xl font-semibold text-on-surface mb-4">
            Deputado não encontrado
          </h2>
          <p className="font-body text-on-surface-variant mb-8">
            O perfil que procura não existe ou foi removido. Verifique o
            identificador ou volte à lista de deputados.
          </p>
          <Link
            href="/assembly"
            className="inline-block font-label text-sm uppercase tracking-wider bg-primary text-on-primary px-6 py-3 border-2 border-stone-900 hover:bg-primary-container hover:text-on-primary-container transition-colors"
          >
            Ver deputados
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
