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
        <nav className={`${className} flex justify-center items-center`}>
            <div 
                className="rounded-lg flex overflow-hidden max-w-xs sm:max-w-sm mx-auto w-full"
                style={{
                    backgroundColor: '#9D86AC',
                    border: '1px solid #FFFFFF',
                    padding: '0',
                    gap: '0',
                }}
            >
                {tabs.map((tab, index) => {
                    const isActive = pathname === tab.href;
                    const isFirst = index === 0;
                    const isLast = index === tabs.length - 1;
                    
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className="transition-all flex-1"
                            style={{
                                fontFamily: 'var(--font-lato), sans-serif',
                                fontSize: '0.875rem',
                                fontWeight: 400,
                                lineHeight: '131%',
                                letterSpacing: '0%',
                                padding: '12px 16px',
                                borderRadius: isFirst ? '8px 0 0 8px' : isLast ? '0 8px 8px 0' : '0',
                                backgroundColor: isActive ? '#FFFFFF' : '#9D86AC',
                                color: isActive ? '#5A0B8E' : '#FFFFFF',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: isActive ? 1 : 0.7,
                                borderRight: !isLast ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                                    e.currentTarget.style.color = '#5A0B8E';
                                    e.currentTarget.style.opacity = '1';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = '#9D86AC';
                                    e.currentTarget.style.color = '#FFFFFF';
                                    e.currentTarget.style.opacity = '0.7';
                                }
                            }}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}