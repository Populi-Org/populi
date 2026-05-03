import { FileText, Landmark, MessagesSquare, UsersRound } from "lucide-react";

interface ProfileStatsProps {
  debateRank: number;
  initiatives: number;
  allies: number;
  committees: number;
}

export default function ProfileStats({
  debateRank,
  initiatives,
  allies,
  committees,
}: ProfileStatsProps) {
  const stats = [
    {
      icon: <MessagesSquare className="w-8 h-8 text-primary-container" />,
      label: "INTERVENÇÕES",
      value: debateRank.toString(),
    },
    {
      icon: <FileText className="w-8 h-8 text-primary-container" />,
      label: "INICIATIVAS",
      value: initiatives.toString(),
    },
    {
      icon: <UsersRound className="w-8 h-8 text-primary-container" />,
      label: "ALIADOS",
      value: allies.toString(),
    },
    {
      icon: <Landmark className="w-8 h-8 text-primary-container" />,
      label: "COMISSÕES",
      value: committees.toString(),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-[2px] h-full">
      {stats.map((stat, index) => (
        <div
          key={`${index}${stat.label}`}
          className="bg-surface p-4 border-2 border-[#2F2F2F] tile-bevel crazing-overlay flex flex-col items-center justify-center text-center gap-2 h-full"
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
