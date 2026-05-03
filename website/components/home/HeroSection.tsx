import Link from "next/link";

import { getPrismaClient } from "@/lib/prisma";

export default async function HeroSection() {
  const prisma = getPrismaClient();
  const activeDeputies = await prisma.deputy.count({
    where: {
      statusHistory: {
        none: {
          sioDes: { contains: "suplent", mode: "insensitive" },
          sioDtFim: null,
        },
      },
    },
  });

  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
      <div className="md:col-span-8 bg-surface-container border-4 border-stone-900 relative glossy-finish overflow-hidden flex flex-col justify-center min-h-[400px] sm:min-h-[450px] md:min-h-[500px]">
        <div className="absolute inset-0 pattern-frame opacity-30 pointer-events-none" />
        <div className="p-6 sm:p-8 md:p-12 relative z-10">
          <span className="font-label text-primary tracking-[0.2em] mb-4 block text-xs font-medium uppercase">
            Bem-vindo ao Mosaico Cívico
          </span>
          <h1 className="font-headline text-on-surface mb-6 leading-none text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
            Mural da Democracia
          </h1>
          <p className="font-body text-base sm:text-lg max-w-xl text-on-surface-variant mb-8 leading-relaxed">
            Cada decisão, cada voto e cada voz é um azulejo nesta construção
            coletiva. Explore o panorama político português através de uma lente
            artesanal e apartidária.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/deputy"
              className="bg-primary text-white font-headline font-bold px-6 sm:px-8 py-3 sm:py-4 border-2 border-stone-900 glossy-finish active:translate-y-[2px] text-center"
            >
              Explorar o Mosaico
            </Link>
            <Link
              href="/faq"
              className="bg-transparent border-2 border-stone-900 font-headline font-bold px-6 sm:px-8 py-3 sm:py-4 glossy-finish hover:bg-surface-variant text-center"
            >
              Saiba Mais
            </Link>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 w-1/3 h-full opacity-10 geometric-bg pointer-events-none" />
      </div>
      <div className="md:col-span-4 bg-primary-container border-4 border-stone-900 text-white p-8 glossy-finish flex flex-col justify-end">
        <div className="text-6xl font-headline mb-4 font-bold">
          {activeDeputies}
        </div>
        <p className="font-label text-primary-fixed-dim text-xs font-medium uppercase tracking-wider">
          Políticos e Deputados em Atividade
        </p>
        <p className="mt-4 font-body opacity-80 italic">
          Acompanhe em tempo real a composição dos Deputados da República e o
          trabalho dos políticos e deputados que a representam.
        </p>
      </div>
    </section>
  );
}
