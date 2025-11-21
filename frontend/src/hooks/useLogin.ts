import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { authService } from '@/services/auth.service';
import { useToast } from '@/contexts/ToastContext';

interface LoginFormData {
  usuario: string;
  contraseña: string;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.signIn({
        email: data.usuario,
        password: data.contraseña,
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));
        window.dispatchEvent(new Event('userUpdated'));
      }

      showSuccess('¡Sesión iniciada correctamente!');

      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      
      showError(errorMessage);
      
      if (errorMessage.includes('email') || errorMessage.includes('Email')) {
        setFormError('usuario', { type: 'manual', message: errorMessage });
      }
      if (errorMessage.includes('contraseña') || errorMessage.includes('password') || errorMessage.includes('Credenciales')) {
        setFormError('contraseña', { type: 'manual', message: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isLoading,
    error,
    onSubmit,
  };
};

