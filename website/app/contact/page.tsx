import ContactForm from "@/components/contact/ContactForm";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

const contactOptions = [
  {
    title: "Correções e fontes",
    description:
      "Encontrou informação desatualizada? Envie a fonte e o detalhe da correção para revisão.",
  },
  {
    title: "Sugestões de melhoria",
    description:
      "Partilhe ideias para novas funcionalidades ou melhorias de visualização.",
  },
  {
    title: "Parcerias e imprensa",
    description:
      "Se representa uma entidade pública, jornalística ou académica, fale connosco.",
  },
  {
    title: "Questões de privacidade",
    description:
      "Para pedidos relacionados com dados pessoais, descreva a sua solicitação.",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased azulejo-crazing min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow max-w-[1200px] mx-auto p-4 sm:p-6 md:p-10 space-y-10">
        <section className="bg-surface-container border-4 border-stone-900 glossy-finish relative overflow-hidden">
          <div className="absolute inset-0 pattern-frame opacity-20 pointer-events-none" />
          <div className="relative z-10 p-6 sm:p-8 md:p-12">
            <span className="font-label text-primary tracking-[0.2em] mb-4 block text-xs font-medium uppercase">
              Vamos conversar
            </span>
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Contacto
            </h1>
            <p className="text-on-surface-variant text-base sm:text-lg max-w-3xl leading-relaxed">
              A Populi cresce com contributos da comunidade. Use os canais
              abaixo para partilhar perguntas, correções ou sugestões.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {contactOptions.map((option) => (
            <article
              key={option.title}
              className="bg-white border-4 border-stone-900 glossy-finish p-4 sm:p-6 md:p-8"
            >
              <h2 className="font-headline text-xl sm:text-2xl font-bold mb-3">
                {option.title}
              </h2>
              <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
                {option.description}
              </p>
            </article>
          ))}
        </section>

        <section className="bg-primary-container border-4 border-stone-900 glossy-finish p-4 sm:p-6 md:p-8 text-white">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            <div className="flex-1">
              <h2 className="font-headline text-xl sm:text-2xl font-bold mb-3">
                Envie-nos uma mensagem
              </h2>
              <p className="leading-relaxed opacity-90 mb-6 text-sm sm:text-base">
                Preencha os campos e clique em enviar para nos enviar a sua
                mensagem.
              </p>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
