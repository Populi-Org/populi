import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function DeputyLoading() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased azulejo-crazing min-h-screen">
      <Header />
      <main className="flex-grow px-4 py-4 md:py-20 max-w-7xl mx-auto w-full space-y-4">
        {/* Hero skeleton */}
        <div className="border-2 border-stone-900 bg-surface glossy-finish p-6 md:p-8 animate-pulse">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-32 h-40 bg-stone-300 border-2 border-stone-900" />
            <div className="flex-1 space-y-3 w-full">
              <div className="h-8 bg-stone-300 w-2/3" />
              <div className="h-5 bg-stone-300 w-1/2" />
              <div className="h-4 bg-stone-300 w-1/3" />
              <div className="h-4 bg-stone-300 w-1/4" />
            </div>
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="border-2 border-stone-900 bg-surface glossy-finish">
          <div className="flex border-b-2 border-stone-900">
            <div className="px-6 py-3 bg-stone-300 w-24 h-12" />
            <div className="px-6 py-3 bg-stone-200 w-24 h-12" />
            <div className="px-6 py-3 bg-stone-200 w-24 h-12" />
          </div>
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-12 gap-[2px]">
              <div className="col-span-12 lg:col-span-4 space-y-4">
                <div className="h-6 bg-stone-300 w-1/2" />
                <div className="h-4 bg-stone-200 w-full" />
                <div className="h-4 bg-stone-200 w-full" />
                <div className="h-4 bg-stone-200 w-3/4" />
              </div>
              <div className="col-span-12 lg:col-span-8 space-y-4">
                <div className="h-6 bg-stone-300 w-1/3" />
                <div className="h-20 bg-stone-200 w-full border-2 border-stone-900" />
                <div className="h-20 bg-stone-200 w-full border-2 border-stone-900" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
