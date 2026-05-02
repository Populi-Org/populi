import { MessagesSquare } from "lucide-react";

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
      icon: <MessagesSquare className="w-8 h-8 text-primary-container" />,
      label: "RANKING DE DEBATE",
      value: `#${debateRank}`,
    },
    {
      icon: <span className="text-primary-container text-3xl">★</span>,
      label: "INTEGRIDADE",
      value: `${integrity}%`,
    },
    {
      icon: <span className="text-primary-container text-3xl">♥</span>,
      label: "ALIADOS",
      value: allies.toString(),
    },
    {
      icon: <span className="text-primary-container text-3xl">▲</span>,
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
          {stat.icon}
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
