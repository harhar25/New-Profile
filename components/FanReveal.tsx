'use client';

import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';

interface FanRevealProps {
  children: ReactNode;
  index: number;
}

const fanAngles = [-42, -32, -22, -12, -4, 4, 12, 22, 32, 42];
const fanOffsets = [-150, -115, -78, -38, -10, 10, 38, 78, 115, 150];

export default function FanReveal({ children, index }: FanRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const lastScrollPosition = useRef(0);
  const isScrollingUp = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [enteringFromTop, setEnteringFromTop] = useState(false);
  const angle = fanAngles[index % fanAngles.length];
  const offset = fanOffsets[index % fanOffsets.length];

  useEffect(() => {
    const updateScrollPosition = () => {
      isScrollingUp.current = window.scrollY < lastScrollPosition.current;
      lastScrollPosition.current = window.scrollY;
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        setEnteringFromTop(isScrollingUp.current);
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    const element = elementRef.current;
    window.addEventListener('scroll', updateScrollPosition, { passive: true });
    if (element) observer.observe(element);
    return () => {
      window.removeEventListener('scroll', updateScrollPosition);
      observer.disconnect();
    };
  }, []);

  const style = {
    '--fan-angle': `${angle}deg`,
    '--fan-overshoot': `${angle * 1.18}deg`,
    '--fan-offset': `${offset}px`,
    '--fan-start-offset': `${offset * 2.2}px`,
    '--fan-settle': `${angle * 0.9}deg`,
    '--fan-spin': enteringFromTop ? '-360deg' : '360deg',
    '--fan-delay': `${index * 72}ms`,
    zIndex: index + 1,
  } as CSSProperties;

  return <div ref={elementRef} style={style} className={`fan-reveal ${isVisible ? 'is-visible' : ''}`}>{children}</div>;
}
