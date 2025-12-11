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
    <div className="relative flex bg-[#F4E7FD] rounded-t-[20px] overflow-hidden pb-0">
      <div className="absolute bottom-[2px] left-[9%] right-[6%] h-px bg-[#8B709D] z-0" />
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() =>
            onTabChange(tab.id as "details" | "materials" | "extras")
          }
          className={`cursor-pointer flex-1 py-3 transition-colors relative ${
            activeTab === tab.id
              ? "text-[#B65CF2] font-bold text-[14px]"
              : "text-[#8B709D] font-normal text-[13px]"
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <span
              className="pointer-events-none absolute bottom-[1px] left-[12%] right-[12%] h-[4px] bg-[#B65CF2] rounded-full z-20"
              aria-hidden
            />
          )}
        </button>
      ))}
    </div>
  );
}
