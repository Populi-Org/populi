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
    {
      icon: "&#9830;",
      label: "RANKING DE DEBATE",
      value: `#${debateRank}`,
    },
    {
      icon: "&#9733;",
      label: "INTEGRIDADE",
      value: `${integrity}%`,
    },
    {
      icon: "&#9829;",
      label: "ALIADOS",
      value: allies.toString(),
    },
    {
      icon: "&#9650;",
      label: "VISUALIZAÇÕES",
      value: muralViews >= 1000 ? `${(muralViews / 1000).toFixed(1)}k` : muralViews.toString(),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-[2px]">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-surface p-4 border-2 border-[#2F2F2F] tile-bevel crazing-overlay flex flex-col items-center justify-center text-center gap-2"
        >
          <span className="text-primary-container text-3xl">{stat.icon}</span>
          <span className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant">
            {stat.label}
          </span>
          <span className="font-headline font-bold text-2xl text-primary-container">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
