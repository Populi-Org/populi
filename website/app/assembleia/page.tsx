import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import CompositionSvg from "./CompositionSvg";

const parties = [
  {
    name: "Partido Social Democrata",
    sigla: "PSD",
    seats: 89,
    percentage: 39,
    color: "rgb(255, 153, 0)",
    href: "/party/psd",
  },
  {
    name: "Chega",
    sigla: "CH",
    seats: 60,
    percentage: 26,
    color: "rgb(32, 32, 86)",
    href: "/party/ch",
  },
  {
    name: "Partido Socialista",
    sigla: "PS",
    seats: 58,
    percentage: 25,
    color: "rgb(255, 102, 204)",
    href: "/party/ps",
  },
  {
    name: "Iniciativa Liberal",
    sigla: "IL",
    seats: 9,
    percentage: 4,
    color: "rgb(0, 170, 255)",
    href: "/party/il",
  },
  {
    name: "Livre",
    sigla: "L",
    seats: 6,
    percentage: 3,
    color: "rgb(0, 170, 0)",
    href: "/party/livre",
  },
  {
    name: "Partido Comunista Português",
    sigla: "PCP",
    seats: 3,
    percentage: 1,
    color: "rgb(204, 0, 0)",
    href: "/party/pcp",
  },
  {
    name: "Centro Democrático Social",
    sigla: "CDS",
    seats: 2,
    percentage: 1,
    color: "rgb(0, 71, 171)",
    href: "/party/cds",
  },
  {
    name: "Bloco de Esquerda",
    sigla: "BE",
    seats: 1,
    percentage: 0,
    color: "rgb(153, 0, 0)",
    href: "/party/be",
  },
  {
    name: "Pessoas-Animais-Natureza",
    sigla: "PAN",
    seats: 1,
    percentage: 0,
    color: "rgb(0, 204, 102)",
    href: "/party/pan",
  },
  {
    name: "Juntos Pelo Povo",
    sigla: "JPP",
    seats: 1,
    percentage: 0,
    color: "rgb(58, 224, 172)",
    href: "/party/jpp",
  },
];

const totalSeats = 230;

export default function AssembleiaPage() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased azulejo-crazing min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-10">
        <section className="bg-surface-container border-4 border-stone-900 glossy-finish relative overflow-hidden">
          <div className="absolute inset-0 pattern-frame opacity-20 pointer-events-none" />
          <div className="relative z-10 p-8 md:p-12">
            <span className="font-label text-primary tracking-[0.2em] mb-4 block text-xs font-medium uppercase">
              Panorama parlamentar
            </span>
            <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">
              Assembleia
            </h1>
            <p className="text-on-surface-variant text-lg max-w-3xl leading-relaxed">
              Uma leitura visual da composição atual, com destaque para os
              partidos e a sua representatividade no Parlamento.
            </p>
          </div>
        </section>

        <section className="bg-white border-4 border-stone-900 glossy-finish p-6 md:p-8">
          <section className="mb-12">
            <h2 className="font-headline text-2xl md:text-3xl font-bold mb-6 text-primary">
              Partidos Políticos ({parties.length})
            </h2>
            <div className="bg-surface-container border-2 border-stone-900 glossy-finish p-4 md:p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <h3 className="font-headline text-lg md:text-xl font-semibold text-on-surface">
                  Composição do Parlamento
                </h3>
                <span className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
                  {totalSeats} deputados
                </span>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-[500px]">
                  <CompositionSvg />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {parties.map((party) => {
                const barWidth = (party.seats / totalSeats) * 100;
                const seatLabel = party.seats === 1 ? "deputado" : "deputados";

                return (
                  <article
                    key={party.sigla}
                    className="border-2 border-stone-900 bg-white glossy-finish solid-shadow hover:-translate-y-1 transition-transform duration-200 h-full"
                  >
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div
                          className="w-12 h-12 flex items-center justify-center text-white font-bold text-sm border-2 border-stone-900"
                          style={{ backgroundColor: party.color }}
                        >
                          {party.sigla}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-semibold text-sm"
                            title={party.name}
                          >
                            {party.name}
                          </h3>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="inline-flex items-center  border-2 border-stone-900 px-2.5 py-0.5 font-semibold text-on-surface text-xs">
                          {party.seats} {seatLabel}
                        </div>
                        <div className="text-xs text-on-surface-variant">
                          {party.percentage}%
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-surface-variant  h-2 border border-stone-900/20">
                          <div
                            className="h-2  transition-all duration-300"
                            style={{
                              backgroundColor: party.color,
                              width: `${barWidth.toFixed(4)}%`,
                              opacity: 0.85,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
}
