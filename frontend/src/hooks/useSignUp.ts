import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { authService } from '@/services/auth.service';
import { useToast } from '@/contexts/ToastContext';

interface SignUpFormData {
  usuario: string;
  contraseña: string;
  confirmarContraseña: string;
  nombre?: string;
}

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError: setFormError,
    watch,
  } = useForm<SignUpFormData>({
    mode: 'onChange'
  });

  const password = watch('contraseña');

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Registrar usuario
      await authService.signUp({
        email: data.usuario,
        password: data.contraseña,
        name: data.nombre || null,
        role: 'USER',
      });

      // Después del registro exitoso, hacer login automáticamente
      const loginResponse = await authService.signIn({
        email: data.usuario,
        password: data.contraseña,
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', loginResponse.token);
        localStorage.setItem('refreshToken', loginResponse.refreshToken);
        localStorage.setItem('user', JSON.stringify(loginResponse.user));
        window.dispatchEvent(new Event('userUpdated'));
      }

      showSuccess('¡Usuario registrado e iniciado sesión correctamente!');

      setTimeout(() => {
        router.push('/inbox');
      }, 500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar usuario';
      setError(errorMessage);

      showError(errorMessage);

      if (errorMessage.includes('email') || errorMessage.includes('Email') || errorMessage.includes('usuario') || errorMessage.includes('Usuario')) {
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
    isValid,
    isLoading,
    error,
    onSubmit,
    password,
  };
};

