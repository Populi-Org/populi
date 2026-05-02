import { Landmark } from "lucide-react";
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
    <ProfileSection
      variant="primary"
      className="p-6 flex flex-col gap-4 h-[400px] overflow-hidden"
    >
      <div className="flex items-center justify-between border-b-2 border-primary-container/20 pb-2">
        <div className="flex items-center gap-2">
          <Landmark className="w-5 h-5 text-primary-container" />
          <h2 className="font-label text-xs font-bold uppercase tracking-wider text-primary-container">
            Atividade Legislativa
          </h2>
        </div>
      </div>

      {initiatives.length === 0 ? (
        <p className="font-body text-on-surface/70">
          Nenhuma iniciativa legislativa registada.
        </p>
      ) : (
        <div className="space-y-6 overflow-y-auto pr-2">
          {initiatives.map((initiative, index) => (
            <div
              key={`${initiative.id}-${index}`}
              className="relative pl-6"
              style={{
                borderLeft: `4px solid ${index === 0 ? "var(--primary-container)" : "var(--outline)"}`,
              }}
            >
              <h3 className="font-headline font-bold text-lg leading-tight mb-1 text-on-surface">
                {initiative.title || "Iniciativa sem título"}
              </h3>
              {initiative.type && (
                <p className="text-sm opacity-80 text-on-surface-variant">
                  {initiative.type}
                </p>
              )}
              {initiative.number && (
                <p className="text-xs font-bold text-primary-container mt-1">
                  N.º {initiative.number}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </ProfileSection>
  );
}
