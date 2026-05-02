import ProfileSection from "./ProfileSection";

interface Initiative {
  id: string | null;
  title: string | null;
  type: string | null;
  number: string | null;
}

interface LegislativeActivityProps {
  initiatives: Initiative[];
}

export default function LegislativeActivity({
  initiatives,
}: LegislativeActivityProps) {
  return (
    <ProfileSection variant="primary" className="p-6 md:p-8">
      <h2 className="font-headline text-xl font-semibold text-on-primary-container mb-6 uppercase tracking-wider">
        Atividade Legislativa
      </h2>

      {initiatives.length === 0 ? (
        <p className="font-body text-on-primary-container/70">
          Nenhuma iniciativa legislativa registada.
        </p>
      ) : (
        <div className="space-y-4">
          {initiatives.map((initiative, index) => (
            <div
              key={index}
              className="border-2 border-stone-900 bg-surface p-4 glossy-finish"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-body text-on-surface text-sm font-medium leading-snug mb-1">
                    {initiative.title || "Iniciativa sem título"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {initiative.type && (
                      <span className="font-label text-[10px] uppercase tracking-wider bg-primary-container text-on-primary-container px-2 py-0.5 border border-stone-900">
                        {initiative.type}
                      </span>
                    )}
                    {initiative.number && (
                      <span className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant">
                        N.º {initiative.number}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ProfileSection>
  );
}
