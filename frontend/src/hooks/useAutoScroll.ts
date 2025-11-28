import { useEffect, useRef, RefObject } from 'react';

export const useAutoScroll = <T,>(dependencies: T[]): RefObject<HTMLDivElement> => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [dependencies]);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
    return scrollRef;
};

