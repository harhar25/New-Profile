'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
}

export default function ScrollReveal({ children, className = '' }: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const lastScrollPosition = useRef(0);
  const isScrollingUp = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [enteringFromTop, setEnteringFromTop] = useState(false);

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
      { threshold: 0.18 }
    );

    const element = elementRef.current;
    window.addEventListener('scroll', updateScrollPosition, { passive: true });
    if (element) observer.observe(element);

    return () => {
      window.removeEventListener('scroll', updateScrollPosition);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal ${isVisible ? 'is-visible' : ''} ${enteringFromTop ? 'from-top' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
