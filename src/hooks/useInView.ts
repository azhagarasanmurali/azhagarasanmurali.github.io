import { useEffect, useRef, useState } from 'react';

export const useInView = (options?: { threshold?: number; rootMargin?: string }) => {
  const threshold = options?.threshold ?? 0.1;
  const rootMargin = options?.rootMargin ?? '0px 0px -5% 0px';

  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold, rootMargin },
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isInView] as const;
};
