'use client'; 

import { useEffect, useState } from 'react';

export default function ApiTest() {
  const [data, setData] = useState<string>('Probando conexión al backend...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('/api/v1/health', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          try {
            const json = await response.json();
            setData(`✅ Conexión exitosa al backend\n\nRespuesta:\n${JSON.stringify(json, null, 2)}`);
          } catch {
            setData(`✅ Conexión exitosa al backend\n\nEl servidor está respondiendo correctamente.`);
          }
        } else {
          setData(`⚠️ El backend está respondiendo pero con estado: ${response.status}\n\nEsto puede indicar un problema con el servidor.`);
        }
      } catch (err: any) {
        const errorMessage = err.message || 'Error desconocido';
        
        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
          setData(`⚠️ No se pudo conectar al backend\n\nPosibles causas:\n- El backend no está corriendo en el puerto configurado\n- Verifica que el servidor esté activo\n- Revisa la configuración de NEXT_PUBLIC_API_URL\n\nError: ${errorMessage}`);
        } else {
          setData(`Error conectando al backend:\n${errorMessage}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="mt-10 p-6 border rounded-lg shadow-md bg-white w-full max-w-2xl">
      <h2 className="text-lg font-bold mb-2 text-secondary-500">Test de Conexión Backend (Local)</h2>
      <pre className="text-sm text-gray-700 bg-gray-50 p-3 rounded whitespace-pre-wrap">
        {isLoading ? 'Probando conexión...' : data}
      </pre>
    </div>
  );
}