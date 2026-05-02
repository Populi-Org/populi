export default function CTASection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="border-4 border-stone-900 bg-surface p-12 glossy-finish relative overflow-hidden">
        <div className="pattern-frame absolute inset-0 opacity-10 pointer-events-none" />
        <h3 className="font-headline text-3xl font-semibold text-primary mb-4">
          A Voz do Cidadão
        </h3>
        <p className="font-body text-lg text-on-surface mb-8">
          Contribua com a sua perspetiva para o debate público. Cada comentário
          é validado por uma equipa editorial para garantir o respeito e a
          clareza.
        </p>
        <button
          type="button"
          className="bg-stone-900 text-white font-headline font-bold px-10 py-4 glossy-finish active:scale-95 transition-transform"
        >
          Entrar na Sala de Debate
        </button>
      </div>
      <div className="border-4 border-stone-900 bg-primary p-12 text-white glossy-finish relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <span className="material-symbols-outlined text-[120px]">
            architecture
          </span>
        </div>
        <h3 className="font-headline text-3xl font-semibold mb-4">
          Arquivo de Políticos e Deputados
        </h3>
        <p className="font-body text-lg mb-8 opacity-90">
          Consulte o histórico de atuação, votações e declarações que moldaram o
          mosaico político nacional ao longo das legislaturas.
        </p>
        <button
          type="button"
          className="bg-white text-primary font-headline font-bold px-10 py-4 border-2 border-white glossy-finish active:scale-95 transition-transform"
        >
          Consultar Arquivo
        </button>
      </div>
    </section>
  );
}
