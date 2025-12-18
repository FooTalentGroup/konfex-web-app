import { useEffect, useRef, RefObject } from "react";

export const useAutoScroll = <T>(
  dependencies: T[]
): RefObject<HTMLDivElement | null> => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [dependencies]);

  return scrollRef;
};
