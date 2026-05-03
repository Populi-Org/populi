import ExploreSection from "@/components/home/ExploreSection";
import HeroSection from "@/components/home/HeroSection";
import TrendingSection from "@/components/home/TrendingSection";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased azulejo-crazing min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow max-w-[1400px] mx-auto p-8 space-y-12">
        <HeroSection />
        <TrendingSection />
        <ExploreSection />
      </main>
      <Footer />
    </div>
  );
}
