import {
  CTASection,
  ExploreSection,
  Footer,
  Header,
  HeroSection,
  TrendingSection,
} from "@/components";

export default function Home() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased azulejo-crazing min-h-screen">
      <Header />
      <main className="max-w-[1400px] mx-auto p-8 space-y-12">
        <HeroSection />
        <TrendingSection />
        <ExploreSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
