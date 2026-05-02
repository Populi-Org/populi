export default function Header() {
  return (
    <header className="bg-[#F9F6F0] font-headline text-lg tracking-tight sticky top-0 w-full z-50 border-b-4 border-stone-900 glossy-finish flex justify-between items-center px-8 py-4">
      <div className="font-headline font-black uppercase tracking-tighter text-stone-900 text-xl">
        POPULI
      </div>
      <nav className="hidden md:flex items-center gap-6">
        <a
          className="text-primary border-b-2 border-primary pb-1 font-bold hover:bg-primary/5 transition-all duration-200 active:scale-[0.97] cursor-pointer"
          href="/"
        >
          Mural
        </a>
        <a
          className="text-stone-700 font-medium hover:text-primary hover:bg-primary/5 transition-all duration-200 active:scale-[0.97] px-2 py-1 cursor-pointer"
          href="/assembly"
        >
          Assembleia
        </a>
        <a
          className="text-stone-700 font-medium hover:text-primary hover:bg-primary/5 transition-all duration-200 active:scale-[0.97] px-2 py-1 cursor-pointer"
          href="/debate"
        >
          Debate
        </a>
        <a
          className="text-stone-700 font-medium hover:text-primary hover:bg-primary/5 transition-all duration-200 active:scale-[0.97] px-2 py-1 cursor-pointer"
          href="/archive"
        >
          Arquivo
        </a>
      </nav>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="text-primary hover:bg-primary/5 transition-all duration-200 active:scale-[0.97] p-2 flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-2xl">
            account_circle
          </span>
        </button>
      </div>
    </header>
  );
}
