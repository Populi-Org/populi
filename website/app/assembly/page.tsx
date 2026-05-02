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

export default function AssemblyPage({
  searchParams,
}: {
  searchParams?: AssemblySearchParams;
}) {
  const shouldShowFilters = Boolean(
    searchParams?.filters ||
      searchParams?.party ||
      searchParams?.constituency ||
      searchParams?.theme ||
      searchParams?.since ||
      searchParams?.search,
  );

  return (
    <div className="bg-surface font-body text-on-surface antialiased azulejo-crazing min-h-screen">
      <Header />
      <main className="flex-grow p-6 md:p-8 max-w-7xl mx-auto w-full">
        <AssemblySection
          initialSearch={searchParams?.search || ""}
          initialConstituency={searchParams?.constituency || ""}
          initialParty={searchParams?.party || ""}
          initialTheme={searchParams?.theme || ""}
          initialSince={searchParams?.since || ""}
          initialFiltersVisible={shouldShowFilters}
        />
      </main>
      <Footer />
    </div>
  );
}
