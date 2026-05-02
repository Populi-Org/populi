"use client";

import { useState, type ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface DeputyProfileTabsProps {
  tabs: Tab[];
}

export default function DeputyProfileTabs({ tabs }: DeputyProfileTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className="space-y-4">
      <div className="flex border-2 border-stone-900">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 font-label text-xs font-medium uppercase tracking-wider px-6 py-3 transition-colors border-r-2 border-stone-900 last:border-r-0 ${
                isActive
                  ? "bg-primary text-on-primary"
                  : "bg-surface text-on-surface hover:bg-primary-container/50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-[400px]">{activeContent}</div>
    </div>
  );
}
