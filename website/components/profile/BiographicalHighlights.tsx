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
  const events = statusHistory.filter((s) => s.description);

  return (
    <ProfileSection variant="secondary" className="p-6 md:p-8">
      <h2 className="font-headline text-xl font-semibold text-on-surface mb-6 uppercase tracking-wider">
        Destaques Biográficos
      </h2>

      {events.length === 0 ? (
        <p className="font-body text-on-surface/70">
          Nenhum destaque biográfico disponível.
        </p>
      ) : (
        <div className="relative border-l-2 border-stone-900 ml-3 space-y-6">
          {events.map((event, index) => (
            <div key={index} className="pl-6 relative">
              <span className="absolute -left-[9px] top-1.5 w-4 h-4 bg-stone-900 border-2 border-secondary" />
              <p className="font-body text-on-surface text-sm leading-relaxed">
                {event.description}
              </p>
              {event.startDate && (
                <p className="font-label text-xs text-on-surface/60 mt-1">
                  {new Date(event.startDate).toLocaleDateString("pt-PT")}
                  {event.endDate
                    ? ` – ${new Date(event.endDate).toLocaleDateString("pt-PT")}`
                    : " – Presente"}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </ProfileSection>
  );
}
