import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

const sections = [
  {
    title: "O que é este documento",
    content:
      "Estes Termos de Privacidade explicam como tratamos informação quando utiliza a plataforma Populi. O foco do projeto é reunir, organizar e contextualizar informação pública sobre votações, posições, histórico e acontecimentos relacionados com políticos portugueses.",
  },
  {
    title: "Informação pública e fontes",
    content:
      "A maior parte do conteúdo apresentado resulta de fontes públicas oficiais, registos parlamentares, bases de dados públicas, comunicados divulgados por entidades oficiais, imprensa e newsletters. Sempre que possível, indicamos a origem da informação.",
  },
  {
    title: "Dados pessoais dos utilizadores",
    content:
      "Não recolhemos dados pessoais para criar perfis de utilizador. Apenas tratamos dados fornecidos voluntariamente (por exemplo, quando nos contacta) e dados técnicos mínimos para garantir o funcionamento do serviço.",
  },
  {
    title: "Dados técnicos e métricas",
    content:
      "Os dados técnicos podem incluir endereço IP, tipo de dispositivo, navegador e páginas visitadas. Estes dados são utilizados para segurança, desempenho e melhoria contínua da plataforma.",
  },
  {
    title: "Partilha de dados",
    content:
      "Não vendemos dados pessoais. Podemos partilhar dados técnicos agregados com fornecedores de infraestrutura, análise e segurança, sempre com obrigações de confidencialidade.",
  },
  {
    title: "Conservação",
    content:
      "Conservamos dados apenas pelo tempo necessário às finalidades descritas ou enquanto existir obrigação legal. Quando deixam de ser necessários, são eliminados ou anonimizados.",
  },
  {
    title: "Direitos dos titulares",
    content:
      "Pode solicitar acesso, retificação, apagamento, limitação ou portabilidade dos seus dados, quando aplicável. Também pode opor-se ao tratamento em determinadas circunstâncias.",
  },
  {
    title: "Correções de informação pública",
    content:
      "Se identificar informação pública desatualizada ou incorreta, pode reportar-nos para revisão. O objetivo é manter um registo fiel e verificável.",
  },
  {
    title: "Segurança",
    content:
      "Implementamos medidas técnicas e organizativas para proteger a informação contra acesso não autorizado, alteração ou destruição.",
  },
  {
    title: "Alterações",
    content:
      "Podemos atualizar estes termos periodicamente. Publicaremos a versão mais recente nesta página.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-surface font-body text-on-surface antialiased azulejo-crazing min-h-screen">
      <Header />
      <main className="max-w-[1200px] mx-auto p-6 md:p-10 space-y-10">
        <section className="bg-surface-container border-4 border-stone-900 glossy-finish relative overflow-hidden">
          <div className="absolute inset-0 pattern-frame opacity-20 pointer-events-none" />
          <div className="relative z-10 p-8 md:p-12">
            <span className="font-label text-primary tracking-[0.2em] mb-4 block text-xs font-medium uppercase">
              Transparência e confiança
            </span>
            <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">
              Termos de Privacidade
            </h1>
            <p className="text-on-surface-variant text-lg max-w-3xl leading-relaxed">
              A Populi respeita a sua privacidade e organiza informação pública
              sobre votações, posições e acontecimentos políticos. Esta página
              explica como tratamos dados técnicos mínimos e como trabalhamos
              com fontes públicas.
            </p>
            <p className="mt-4 font-label text-xs uppercase tracking-wider text-primary">
              Última atualização: 2 de maio de 2026
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <article
              key={section.title}
              className="bg-white border-4 border-stone-900 glossy-finish p-6 md:p-8"
            >
              <h2 className="font-headline text-2xl font-bold mb-3">
                {section.title}
              </h2>
              <p className="text-on-surface-variant leading-relaxed">
                {section.content}
              </p>
            </article>
          ))}
        </section>

        <section className="bg-primary-container border-4 border-stone-900 glossy-finish p-6 md:p-8 text-white">
          <h2 className="font-headline text-2xl font-bold mb-3">
            Precisa de ajuda?
          </h2>
          <p className="leading-relaxed opacity-90">
            Se tiver dúvidas sobre privacidade, consulte a página de Contacto ou
            envie-nos uma mensagem com o seu pedido. Responderemos com a maior
            brevidade possível.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}