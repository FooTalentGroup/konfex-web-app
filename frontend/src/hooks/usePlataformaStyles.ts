import { useMemo } from 'react';

export interface PlataformaStyles {
  bg: string;
  borderColor: string;
}

export const usePlataformaStyles = (plataforma: 'telegram'): PlataformaStyles => {
  return useMemo(() => {
    return {
      bg: '#E3F2FD',
      borderColor: '#BBDEFB',
    };
  }, [plataforma]);
};

