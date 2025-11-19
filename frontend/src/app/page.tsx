import React from 'react';
import ApiTest from '@/components/common/ApiTest'; 

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">
        Hola Mundo - EOS Frontend
      </h1>
      <p className="mt-4 text-xl text-primary-500">Entorno local configurado correctamente.</p>
      
      <ApiTest />
    </main>
  );
}