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
        <nav className={`${className} flex justify-center items-center p-2 bg-transparent`}>
            <div className="rounded-lg py-[5px] px-2.5 border">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`${className} px-4 py-2 transition-all ${isActive
                                    ? "bg-white text-primary-500 font-semibold"
                                    : "border-white/40 text-white/70 hover:text-white hover:border-white"
                                }`}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}