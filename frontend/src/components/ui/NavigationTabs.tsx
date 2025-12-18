'use client';

import Link from 'next/link';
import { useNavigationTabs } from '@/hooks/useNavigationTabs';
import { Tab } from '@/hooks/useNavigationTabs';

interface Props {
  tabs?: Tab[];
  className?: string;
}

export default function NavigationTabs({ className = '', tabs }: Props) {
  const { tabs: tabsWithStyles, containerStyles } = useNavigationTabs(tabs);

  return (
    <nav className={`${className} flex justify-center items-center p-2 bg-transparent`}>
      <div
        className="max-w-xs sm:max-w-sm mx-auto w-full flex gap-0 overflow-hidden"
        style={containerStyles}
      >
        {tabsWithStyles.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex-1 transition-all flex items-center justify-center font-lato"
            style={tab.styles}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
