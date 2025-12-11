"use client";

import { useTokenRefresh } from "@/hooks/useTokenRefresh";
import { useMultiTabSync } from "@/hooks/useMultiTabSync";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  useTokenRefresh();
  useMultiTabSync();

  return <>{children}</>;
}
