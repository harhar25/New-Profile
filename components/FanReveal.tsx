'use client';

import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';

interface FanRevealProps {
  children: ReactNode;
  index: number;
}

export default function FanReveal({ children, index }: FanRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.16 }
    );
    const element = elementRef.current;
    if (element) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style = {
    '--stack-top': `${92 + index * 9}px`,
    zIndex: index + 1,
  } as CSSProperties;

  return <div ref={elementRef} style={style} className={`stack-reveal ${isVisible ? 'is-visible' : ''}`}>{children}</div>;
}
