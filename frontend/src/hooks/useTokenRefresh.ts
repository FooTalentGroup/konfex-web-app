"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import {
  getToken,
  getTokenExpirationTime,
  isAuthenticated,
} from "@/utils/token.utils";

export const useTokenRefresh = () => {
  const router = useRouter();
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const refreshTokenNow = useCallback(async () => {
    try {
      const result = await authService.refreshToken();

      if (result) {
        window.dispatchEvent(new Event("tokenRefreshed"));
      } else {
        console.warn("No se pudo renovar el token, redirigiendo al login");
        router.push("/");
      }
    } catch (error) {
      router.push("/");
    }
  }, [router]);

  const scheduleTokenRefresh = useCallback(async () => {
    if (typeof window === "undefined") return;

    const token = getToken();
    if (!token || !isAuthenticated()) {
      return;
    }

    const expirationTime = getTokenExpirationTime(token);
    if (!expirationTime) return;

    const REFRESH_BUFFER = 5 * 60 * 1000;
    const timeUntilRefresh = expirationTime - REFRESH_BUFFER;

    if (timeUntilRefresh <= 0) {
      await refreshTokenNow();
    } else {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      refreshTimeoutRef.current = setTimeout(async () => {
        await refreshTokenNow();
      }, timeUntilRefresh);
    }
  }, [refreshTokenNow]);

  useEffect(() => {
    scheduleTokenRefresh();

    checkIntervalRef.current = setInterval(() => {
      if (isAuthenticated()) {
        scheduleTokenRefresh();
      }
    }, 60 * 1000);

    const handleUserUpdate = () => {
      scheduleTokenRefresh();
    };

    window.addEventListener("userUpdated", handleUserUpdate);
    window.addEventListener("tokenRefreshed", handleUserUpdate);

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      window.removeEventListener("userUpdated", handleUserUpdate);
      window.removeEventListener("tokenRefreshed", handleUserUpdate);
    };
  }, [scheduleTokenRefresh]);

  return {
    refreshTokenNow,
  };
};
