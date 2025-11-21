"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Tab {
    label: string;
    href: string;
}

interface Props {
    tabs: Tab[];
    className?: string;
}

export default function NavigationTabs({ tabs, className = ""}: Props) {
    const pathname = usePathname();

    return (
        <nav className="flex justify-center items-center gap-4 p-2 bg-transparent">
            {tabs.map((tab) => {
                const isActive = pathname === tab.href;

                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`${className} px-4 py-2 rounded-lg border transition-all ${isActive
                                ? "bg-white text-purple-700 font-semibold"
                                : "border-white/40 text-white/70 hover:text-white hover:border-white"
                            }`}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
}