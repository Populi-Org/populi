import { Suspense } from "react";
import AssemblySection from "@/components/assembly/AssemblySection";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

type AssemblySearchParams = {
  party?: string;
  constituency?: string;
  theme?: string;
  since?: string;
  search?: string;
  filters?: string;
};

export default async function AssemblyPage({
  searchParams,
}: {
  searchParams?: AssemblySearchParams | Promise<AssemblySearchParams>;
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const shouldShowFilters = Boolean(
    resolvedSearchParams?.filters ||
      resolvedSearchParams?.party ||
      resolvedSearchParams?.constituency ||
      resolvedSearchParams?.theme ||
      resolvedSearchParams?.since ||
      resolvedSearchParams?.search,
  );

  return (
    <div className="bg-surface font-body text-on-surface antialiased azulejo-crazing min-h-screen">
      <Header />
      <main className="flex-grow p-6 md:p-8 max-w-7xl mx-auto w-full">
        <Suspense fallback={null}>
          <AssemblySection
            initialSearch={resolvedSearchParams?.search || ""}
            initialConstituency={resolvedSearchParams?.constituency || ""}
            initialParty={resolvedSearchParams?.party || ""}
            initialTheme={resolvedSearchParams?.theme || ""}
            initialFiltersVisible={shouldShowFilters}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
