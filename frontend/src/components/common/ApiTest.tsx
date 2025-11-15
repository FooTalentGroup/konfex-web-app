'use client'; 

import { useEffect, useState } from 'react';

export default function ApiTest() {
  const [data, setData] = useState<string>('Probando conexión al backend...');

  useEffect(() => {
   
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      setData('Error: La variable de entorno NEXT_PUBLIC_API_URL no está configurada.');
      return;
    }

      fetch(`${apiUrl}/docs`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Respuesta del servidor no fue OK (${res.status})`);
        }
        return res.json();
      })
      .then((json) => {

        setData(JSON.stringify(json, null, 2));
      })
      .catch((err) => {

        setData(`Error conectando al backend en ${apiUrl}/docs: \n${err.message}`);
      });
  }, []);

  return (
    <div className="mt-10 p-6 border rounded-lg shadow-md bg-white w-full max-w-2xl">
      <h2 className="text-lg font-semibold mb-2">Test de Conexión Backend (Local)</h2>
      <pre className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
        {data}
      </pre>
    </div>
  );
}