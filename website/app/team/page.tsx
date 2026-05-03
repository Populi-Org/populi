import Image from "next/image";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  html_url: string;
  blog: string | null;
  twitter_username: string | null;
}

const teamMembers = [
  { username: "Process-ing", displayName: "Bruno Oliveira" },
  { username: "clarapbsousa", displayName: "Clara Sousa" },
  { username: "HenriqueSFernandes", displayName: "Henrique Fernandes" },
  { username: "jose-carlos-sousa", displayName: "José Sousa" },
];

async function fetchGitHubUser(username: string): Promise<GitHubUser | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function TeamPage() {
  const users = await Promise.all(
    teamMembers.map(async (member) => {
      const data = await fetchGitHubUser(member.username);
      return {
        ...member,
        github: data,
      };
    }),
  );

  return (
    <div className="bg-surface font-body text-on-surface antialiased azulejo-crazing min-h-screen">
      <Header />
      <main className="max-w-[1200px] mx-auto p-4 sm:p-6 md:p-10 space-y-10">
        <section className="bg-surface-container border-4 border-stone-900 glossy-finish relative overflow-hidden">
          <div className="absolute inset-0 pattern-frame opacity-20 pointer-events-none" />
          <div className="relative z-10 p-6 sm:p-8 md:p-12">
            <span className="font-label text-primary tracking-[0.2em] mb-4 block text-xs font-medium uppercase">
              Quem somos
            </span>
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Equipa
            </h1>
            <p className="text-on-surface-variant text-base sm:text-lg max-w-3xl leading-relaxed mb-4">
              A Populi é uma plataforma dedicada à transparência política em
              Portugal. O nosso objetivo é informar os cidadãos e ajudá-los a
              tomar decisões informadas sobre em quem votam e quem os
              representa.
            </p>
            <p className="text-on-surface-variant text-base sm:text-lg max-w-3xl leading-relaxed">
              Acreditamos que o acesso a dados políticos claros e verificáveis é
              essencial para uma democracia saudável. Cada decisão, cada voto e
              cada voz importa.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {users.map((user) => (
            <article
              key={user.username}
              className="bg-white border-4 border-stone-900 glossy-finish solid-shadow hover:-translate-y-1 transition-transform duration-200 p-4 sm:p-6 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 border-2 border-stone-900 overflow-hidden mb-4 relative glossy-finish">
                {user.github?.avatar_url ? (
                  <Image
                    alt={`Avatar de ${user.displayName}`}
                    className="object-cover"
                    src={user.github.avatar_url}
                    fill
                    sizes="112px"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant">
                      person
                    </span>
                  </div>
                )}
              </div>

              <h2 className="font-headline text-xl sm:text-2xl font-bold mb-1">
                {user.displayName}
              </h2>
              <p className="font-label text-xs font-medium uppercase tracking-wider text-primary mb-3">
                Developer
              </p>

              {user.github?.bio && (
                <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                  {user.github.bio}
                </p>
              )}

              <div className="flex flex-wrap justify-center gap-2">
                <a
                  href={
                    user.github?.html_url ||
                    `https://github.com/${user.username}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 border-2 border-stone-900 bg-surface px-3 py-1.5 font-label text-xs font-medium uppercase tracking-wider glossy-finish hover:bg-primary-container hover:text-on-primary transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  GitHub
                </a>
                {user.github?.blog && (
                  <a
                    href={
                      user.github.blog.startsWith("http")
                        ? user.github.blog
                        : `https://${user.github.blog}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 border-2 border-stone-900 bg-surface px-3 py-1.5 font-label text-xs font-medium uppercase tracking-wider glossy-finish hover:bg-primary-container hover:text-on-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">
                      link
                    </span>
                    Website
                  </a>
                )}
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
