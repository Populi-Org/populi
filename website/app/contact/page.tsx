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
    <div className="bg-surface font-body text-on-surface antialiased azulejo-crazing min-h-screen">
      <Header />
      <main className="max-w-[1200px] mx-auto p-6 md:p-10 space-y-10">
        <section className="bg-surface-container border-4 border-stone-900 glossy-finish relative overflow-hidden">
          <div className="absolute inset-0 pattern-frame opacity-20 pointer-events-none" />
          <div className="relative z-10 p-8 md:p-12">
            <span className="font-label text-primary tracking-[0.2em] mb-4 block text-xs font-medium uppercase">
              Vamos conversar
            </span>
            <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">
              Contacto
            </h1>
            <p className="text-on-surface-variant text-lg max-w-3xl leading-relaxed">
              A Populi cresce com contributos da comunidade. Use os canais
              abaixo para partilhar perguntas, correções ou sugestões.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactOptions.map((option) => (
            <article
              key={option.title}
              className="bg-white border-4 border-stone-900 glossy-finish p-6 md:p-8"
            >
              <h2 className="font-headline text-2xl font-bold mb-3">
                {option.title}
              </h2>
              <p className="text-on-surface-variant leading-relaxed">
                {option.description}
              </p>
            </article>
          ))}
        </section>

        <section className="bg-primary-container border-4 border-stone-900 glossy-finish p-6 md:p-8 text-white">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <h2 className="font-headline text-2xl font-bold mb-3">
                Envie-nos uma mensagem
              </h2>
              <p className="leading-relaxed opacity-90 mb-6">
                Preencha os campos e clique em enviar para abrir o seu email com
                a mensagem pré-preenchida.
              </p>
              <form
                className="space-y-4"
                action="mailto:clara.barros.sousa@gmail.com"
                method="post"
                encType="text/plain"
              >
                <label className="flex flex-col gap-2 text-sm font-medium">
                  Título da mensagem
                  <input
                    name="subject"
                    required
                    className="bg-white text-stone-900 border-2 border-stone-900 px-4 py-3 glossy-finish focus:outline-none focus:ring-2 focus:ring-white/70"
                    placeholder="Ex: Sugestão de melhoria"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium">
                  O seu email
                  <input
                    type="email"
                    name="from"
                    required
                    className="bg-white text-stone-900 border-2 border-stone-900 px-4 py-3 glossy-finish focus:outline-none focus:ring-2 focus:ring-white/70"
                    placeholder="nome@exemplo.com"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium">
                  Mensagem
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="bg-white text-stone-900 border-2 border-stone-900 px-4 py-3 glossy-finish focus:outline-none focus:ring-2 focus:ring-white/70"
                    placeholder="Descreva a sua mensagem"
                  />
                </label>
                <button
                  type="submit"
                  className="bg-white text-primary font-headline font-bold px-6 py-3 border-2 border-stone-900 glossy-finish active:translate-y-[2px]"
                >
                  Enviar email
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}