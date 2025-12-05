import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/auth.types';
import { authService } from '@/services/auth.service';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const loadUser = () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = setTimeout(() => {
        loadUser();
        setMounted(true);
      }, 0);

      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'user') {
          loadUser();
        }
      };

      const handleUserUpdate = () => {
        setTimeout(() => {
          loadUser();
        }, 100);
      };

      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('userUpdated', handleUserUpdate);

      return () => {
        clearTimeout(id);
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('userUpdated', handleUserUpdate);
      };
    }
  }, []);

  const logout = async () => {
    try {
      // Llamar al endpoint de logout en el backend
      await authService.signOut();
    } catch (error) {
      console.error('Error durante logout:', error);
      // Continuar con el logout local aunque falle el servidor
    } finally {
      // Siempre limpiar el localStorage y redirigir
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('userUpdated'));
        router.push('/');
      }
    }
  };

  useEffect(() => {
    if (mounted && !user) {
      // Solo redirigir si no estamos ya en la página principal (login)
      const currentPath = window.location.pathname;
      if (currentPath !== '/') {
        router.push('/');
      }
    }
  }, [mounted, user, router]);

  return {
    user,
    mounted,
    logout,
    userName: user?.name || user?.email || '',
  };
};

