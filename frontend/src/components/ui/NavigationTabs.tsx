"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


const TABS = [
    { label: "Inbox", href: "/inbox" },       // Izquierda
    { label: "Calculadora", href: "/calculator" }, // Centro
    { label: "Pedidos", href: "/pedidos" },   // Derecha
];

interface Props {
    
    tabs?: { label: string; href: string }[];
    className?: string;
}

export default function NavigationTabs({ className = "" }: Props) {
    const pathname = usePathname();

    return (
        <nav className={`${className} flex justify-center items-center p-2 bg-transparent`}>
            <div className="rounded-lg py-[5px] px-2.5 border border-white/20 flex gap-1">
                {TABS.map((tab) => {
                    
                    const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
                    
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`px-4 py-2 transition-all rounded-md text-sm ${isActive
                                    ? "bg-white text-primary-500 font-bold shadow-sm"
                                    : "text-white/70 hover:text-white hover:bg-white/10"
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