'use client';

import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';

interface FanRevealProps {
  children: ReactNode;
  index: number;
  total: number;
}

export default function FanReveal({ children, index, total }: FanRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const normalizedPosition = total > 1 ? index / (total - 1) : 0.5;
  const centeredPosition = normalizedPosition - 0.5;
  const fanAngle = centeredPosition * 22;
  const fanOffset = centeredPosition * 150;
  const centerIndex = (total - 1) / 2;

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
    '--fan-angle': `${fanAngle}deg`,
    '--fan-overshoot': `${fanAngle * 1.2}deg`,
    '--fan-offset': `${fanOffset}px`,
    '--fan-start-offset': `${fanOffset * 1.85}px`,
    '--fan-delay': `${index * 70}ms`,
    zIndex: Math.round(total - Math.abs(index - centerIndex)),
  } as CSSProperties;

  return <div ref={elementRef} style={style} className={`stack-reveal ${isVisible ? 'is-visible' : ''}`}>{children}</div>;
}
