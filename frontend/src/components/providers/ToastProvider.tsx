'use client';

import { ToastProvider as ToastProviderComponent } from '@/contexts/ToastContext';

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  return <ToastProviderComponent>{children}</ToastProviderComponent>;
}

