import ProfileSection from "./ProfileSection";

interface ProfileStatsProps {
  debateRank: number;
  integrity: number;
  allies: number;
  muralViews: number;
}

export default function ProfileStats({
  debateRank,
  integrity,
  allies,
  muralViews,
}: ProfileStatsProps) {
  const stats = [
    { label: "Ranking de Debate", value: debateRank },
    { label: "Integridade", value: `${integrity}%` },
    { label: "Aliados", value: allies },
    {
      label: "Visualizações",
      value: muralViews >= 1000 ? `${(muralViews / 1000).toFixed(1)}k` : muralViews,
    },
  ];

  return (
    <ProfileSection variant="primary" className="p-6 md:p-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-4 md:p-6 text-center ${
              index < stats.length - 1 ? "border-r-2 border-stone-900" : ""
            } ${index < 2 ? "border-b-2 md:border-b-0 border-stone-900" : ""}`}
          >
            <p className="font-headline text-2xl md:text-3xl font-bold text-on-primary-container mb-1">
              {stat.value}
            </p>
            <p className="font-label text-[10px] uppercase tracking-wider text-on-primary-container/70">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </ProfileSection>
  );
}
