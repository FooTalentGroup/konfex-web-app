"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearTokens, isAuthenticated } from "@/utils/token.utils";

export const useMultiTabSync = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" && !e.newValue) {
        clearTokens();
        window.dispatchEvent(new Event("userUpdated"));
        router.push("/");
      }

      if (e.key === "token" && e.newValue) {
        window.dispatchEvent(new Event("userUpdated"));
        if (window.location.pathname === "/") {
          router.push("/inbox");
        }
      }

      if (e.key === "user" && e.newValue) {
        window.dispatchEvent(new Event("userUpdated"));
      }
    };

    const handleLogoutEvent = () => {
      if (!isAuthenticated()) {
        router.push("/");
      }
    };

    const checkSessionValidity = setInterval(() => {
      const currentPath = window.location.pathname;

      if (currentPath !== "/" && !isAuthenticated()) {
        clearTokens();
        window.dispatchEvent(new Event("userUpdated"));
        router.push("/");
      }
    }, 30 * 1000);

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("logout", handleLogoutEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("logout", handleLogoutEvent);
      clearInterval(checkSessionValidity);
    };
  }, [router]);
};
