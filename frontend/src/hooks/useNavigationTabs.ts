import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export interface Tab {
  label: string;
  href: string;
}

export interface TabStyle {
  borderRadius: string;
  backgroundColor: string;
  color: string;
  borderBottom?: string;
  boxShadow?: string;
}

const DEFAULT_TABS: Tab[] = [
  { label: 'Inbox', href: '/inbox' },
  { label: 'Calculadora', href: '/calculator' },
];

const CONTAINER_STYLES = {
  backgroundColor: '#9D86AC',
  padding: '0',
  borderRadius: '10px',
  border: '1px solid #F3F0F5',
  width: '390px',
  maxWidth: '390px',
  height: '45px',
};

const BASE_TAB_STYLES = {
  fontFamily: 'var(--font-lato), sans-serif',
  fontSize: '14px',
  fontWeight: 400,
  fontStyle: 'normal',
  lineHeight: '131%',
  letterSpacing: '0%',
  height: '100%',
  padding: '12px',
  margin: '0',
};

const ACTIVE_TAB_STYLES = {
  backgroundColor: '#F3F0F5',
  color: '#5A0B8E',
  borderBottom: '2px solid transparent',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
};

const INACTIVE_TAB_STYLES = {
  backgroundColor: 'transparent',
  color: '#FFFFFF',
};

export function useNavigationTabs(customTabs?: Tab[]) {
  const pathname = usePathname();
  const tabs = customTabs || DEFAULT_TABS;

  const getBorderRadius = (isActive: boolean, isFirst: boolean, isLast: boolean): string => {
    if (isFirst) return '10px 0 0 10px';
    if (isLast) return '0 10px 10px 0';
    return '0';
  };

  const getTabStyles = useCallback(
    (tab: Tab, index: number) => {
    const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
    const isFirst = index === 0;
    const isLast = index === tabs.length - 1;
    const borderRadius = getBorderRadius(isActive, isFirst, isLast);

    return {
      ...BASE_TAB_STYLES,
      borderRadius,
      ...(isActive ? ACTIVE_TAB_STYLES : INACTIVE_TAB_STYLES),
    };
    },
    [pathname, tabs.length]
  );

  const tabsWithStyles = useMemo(
    () =>
      tabs.map((tab, index) => ({
        ...tab,
        isActive: pathname === tab.href || pathname.startsWith(`${tab.href}/`),
        styles: getTabStyles(tab, index),
      })),
    [tabs, pathname, getTabStyles]
  );

  return {
    tabs: tabsWithStyles,
    containerStyles: CONTAINER_STYLES,
  };
}

