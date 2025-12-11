import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/auth.types";
import { authService } from "@/services/auth.service";
import { isAuthenticated, clearTokens } from "@/utils/token.utils";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const loadUser = () => {
    if (typeof window !== "undefined") {
      // Primero verificar si hay un token válido
      if (!isAuthenticated()) {
        // Si no hay token válido, limpiar todo
        setUser(null);
        clearTokens();
        return;
      }

      // Si hay token válido, cargar el usuario
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
        } catch (error) {
          console.error("Error parsing user data:", error);
          setUser(null);
          clearTokens();
        }
      } else {
        setUser(null);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = setTimeout(() => {
        loadUser();
        setMounted(true);
      }, 0);

      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "user") {
          loadUser();
        }
      };

      const handleUserUpdate = () => {
        setTimeout(() => {
          loadUser();
        }, 100);
      };

      window.addEventListener("storage", handleStorageChange);
      window.addEventListener("userUpdated", handleUserUpdate);

      return () => {
        clearTimeout(id);
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener("userUpdated", handleUserUpdate);
      };
    }
  }, []);

  const logout = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error("Error durante logout:", error);
    } finally {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("userUpdated"));
        router.push("/");
      }
    }
  };

  return {
    user,
    mounted,
    logout,
    userName: user?.name || user?.email || "",
  };
};
