import { ScrollText } from "lucide-react";
import ProfileSection from "./ProfileSection";

interface StatusEvent {
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
}

interface BiographicalHighlightsProps {
  statusHistory: StatusEvent[];
}

export default function BiographicalHighlights({
  statusHistory,
}: BiographicalHighlightsProps) {
  const events = statusHistory
    .filter((s) => s.description && s.startDate)
    .map((s) => ({
      year: s.startDate ? new Date(s.startDate).getFullYear().toString() : "",
      description: s.description ?? "",
    }));

  return (
    <ProfileSection
      variant="secondary"
      className="p-6 flex flex-col gap-4 h-[400px] overflow-hidden"
    >
      <div className="flex items-center gap-2 border-b-2 border-primary/30 pb-2">
        <ScrollText className="w-5 h-5 text-primary" />
        <h2 className="font-label text-xs font-bold uppercase tracking-wider text-primary">
          Destaques Biográficos
        </h2>
      </div>

      {events.length === 0 ? (
        <p className="font-body text-on-surface/70">
          Nenhum destaque biográfico disponível.
        </p>
      ) : (
        <ul className="space-y-4 font-body-md overflow-y-auto pr-2">
          {events.map((event, _index) => (
            <li key={event.description} className="flex gap-3">
              <span className="font-bold text-primary">{event.year}</span>
              <span>{event.description}</span>
            </li>
          ))}
        </ul>
      )}
    </ProfileSection>
  );
}
