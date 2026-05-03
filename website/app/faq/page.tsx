import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

const faqs = [
  {
    question: "O que é a Populi?",
    answer:
      "A Populi é uma plataforma que organiza informação pública sobre a atividade política em Portugal, incluindo votações, posições, mandatos e acontecimentos relevantes, de forma clara e verificável.",
  },
  {
    question: "De onde vem o nome Populi?",
    answer:
      "O nome inspira-se na expressão latina “Vox Populi, Vox Dei” e reflete a missão de dar visibilidade à voz pública através de dados políticos verificáveis.",
  },
  {
    question: "De onde vêm os dados?",
    answer:
      "Utilizamos fontes públicas oficiais, registos parlamentares, bases de dados públicas, comunicados divulgados por entidades oficiais, imprensa e newsletters. Sempre que possível, indicamos as fontes e datas de atualização.",
  },
  {
    question: "A Populi cria opiniões ou classificações?",
    answer:
      "Não. A Populi organiza informação pública de forma neutra e transparente para que cada pessoa possa tirar as suas próprias conclusões.",
  },
  {
    question: "Como são tratados os dados pessoais?",
    answer:
      "A plataforma não recolhe dados pessoais para perfis de utilizador. Apenas utilizamos dados técnicos mínimos para funcionamento do site e dados fornecidos voluntariamente quando nos contacta.",
  },
  {
    question: "Posso pedir correções?",
    answer:
      "Sim. Se encontrar informação pública desatualizada ou incorreta, pode contactar-nos para revisão. O objetivo é manter um registo fiel e verificável.",
  },
  {
    question: "A Populi vende ou partilha dados?",
    answer:
      "Não vendemos dados pessoais. Dados técnicos agregados podem ser partilhados com fornecedores de infraestrutura e segurança, sempre com obrigações de confidencialidade.",
  },
  {
    question: "Com que frequência os dados são atualizados?",
    answer:
      "Atualizamos os dados à medida que novas fontes públicas são disponibilizadas. Algumas áreas podem ser atualizadas em tempo real, outras de forma periódica.",
  },
  {
    question: "Posso reutilizar os dados?",
    answer:
      "A reutilização depende das licenças das fontes originais. Recomendamos verificar a licença da entidade pública responsável e citar corretamente a origem.",
  },
  {
    question: "Como posso entrar em contacto?",
    answer:
      "Pode usar a página de Contacto para enviar questões, sugestões ou pedidos de correção.",
  },
];

export default function FaqPage() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased azulejo-crazing min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow max-w-[1200px] mx-auto p-4 sm:p-6 md:p-10 space-y-10">
        <section className="bg-surface-container border-4 border-stone-900 glossy-finish relative overflow-hidden">
          <div className="absolute inset-0 pattern-frame opacity-20 pointer-events-none" />
          <div className="relative z-10 p-6 sm:p-8 md:p-12">
            <span className="font-label text-primary tracking-[0.2em] mb-4 block text-xs font-medium uppercase">
              Informação clara
            </span>
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              FAQ
            </h1>
            <p className="text-on-surface-variant text-base sm:text-lg max-w-3xl leading-relaxed">
              Respostas rápidas para perguntas frequentes sobre o projeto,
              fontes e funcionamento da Populi.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {faqs.map((item) => (
            <article
              key={item.question}
              className="bg-white border-4 border-stone-900 glossy-finish p-4 sm:p-6 md:p-8"
            >
              <h2 className="font-headline text-xl sm:text-2xl font-bold mb-3">
                {item.question}
              </h2>
              <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
                {item.answer}
              </p>
            </article>
          ))}
        </section>

        <section className="bg-primary-container border-4 border-stone-900 glossy-finish p-4 sm:p-6 md:p-8 text-white">
          <h2 className="font-headline text-xl sm:text-2xl font-bold mb-3">
            Ainda tem dúvidas?
          </h2>
          <p className="leading-relaxed opacity-90 text-sm sm:text-base">
            Visite a página de Contacto e partilhe a sua questão. Respondemos
            com a maior brevidade possível.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
