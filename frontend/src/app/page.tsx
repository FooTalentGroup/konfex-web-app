'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ApiTest from '@/components/common/ApiTest';

interface User {
  email?: string;
  name?: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      const id = setTimeout(() => {
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            setUser(userData);
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        }
        setMounted(true);
      }, 0);

      return () => clearTimeout(id);
    }
  }, []);

  const handleMenuClick = () => {
    console.log('Menu clicked');
  };

  const handleUserClick = () => {
    console.log('User clicked');
  };

  if (!mounted) {
    return null;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header
        onMenuClick={handleMenuClick}
        onUserClick={handleUserClick}
      />
      <main className="flex-1 flex flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold text-blue-600">
          Hola Mundo - EOS Frontend
        </h1>
        <p className="mt-4 text-xl text-primary-500">Entorno local configurado correctamente.</p>
        
        <ApiTest />
      </main>
      <Footer />
    </div>
  );
}