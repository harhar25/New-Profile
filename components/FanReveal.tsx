'use client';

import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';

interface FanRevealProps {
  children: ReactNode;
  index: number;
}

const rotations = [-9, 7, -5, 8, -7, 5, -8, 6, -4, 7];
const offsets = [-56, 44, -30, 54, -46, 34, -52, 40, -28, 46];

export default function FanReveal({ children, index }: FanRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const lastScrollPosition = useRef(0);
  const isScrollingUp = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [enteringFromTop, setEnteringFromTop] = useState(false);
  const rotation = rotations[index % rotations.length];
  const offset = offsets[index % offsets.length];

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
      { threshold: 0.12 }
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
    '--fan-rotation': `${rotation}deg`,
    '--fan-reverse-rotation': `${-rotation}deg`,
    '--fan-offset': `${offset}px`,
  } as CSSProperties;

  return <div ref={elementRef} style={style} className={`fan-reveal ${isVisible ? 'is-visible' : ''} ${enteringFromTop ? 'from-top' : ''}`}>{children}</div>;
}
