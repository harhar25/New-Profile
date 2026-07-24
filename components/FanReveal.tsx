'use client';

import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';

interface FanRevealProps {
  children: ReactNode;
  index: number;
}

export default function FanReveal({ children, index }: FanRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const fanAngles = [-24, -18, -13, -8, -3, 3, 8, 13, 18, 24];
  const fanOffsets = [-128, -98, -70, -42, -14, 14, 42, 70, 98, 128];
  const fanAngle = fanAngles[index % fanAngles.length];
  const fanOffset = fanOffsets[index % fanOffsets.length];

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
    zIndex: index + 1,
  } as CSSProperties;

  return <div ref={elementRef} style={style} className={`stack-reveal ${isVisible ? 'is-visible' : ''}`}>{children}</div>;
}
