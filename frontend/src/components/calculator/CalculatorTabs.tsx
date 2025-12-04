import React from "react";

interface CalculatorTabsProps {
  activeTab: "details" | "materials" | "extras";
  onTabChange: (tab: "details" | "materials" | "extras") => void;
}

export default function CalculatorTabs({
  activeTab,
  onTabChange,
}: CalculatorTabsProps) {
  const tabs = [
    { id: "details", label: "Info" },
    { id: "materials", label: "Detalle" },
    { id: "extras", label: "Adicional" },
  ];

  return (
    <div className="flex bg-white rounded-t-3xl border-b border-gray-100 overflow-hidden">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() =>
            onTabChange(tab.id as "details" | "materials" | "extras")
          }
          className={`flex-1 py-3 text-sm font-bold transition-colors relative ${
            activeTab === tab.id
              ? "text-[#8B709D]"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {tab.label}

          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#8B709D] rounded-t-full" />
          )}
        </button>
      ))}
    </div>
  );
}
