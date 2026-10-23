'use client';

import { useSyncExternalStore } from 'react';
import type { HeroTheme } from './useLiquidSculpture';

const KEY = 'portfolio-hero-theme';
const EVENT = 'portfolio-hero-theme-change';
let memoryChoice: HeroTheme | null = null;
let memoryOnly = false;

function getTheme(): HeroTheme {
  if (memoryOnly && memoryChoice) return memoryChoice;
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch { /* The switch still works when browser storage is unavailable. */ }
  return memoryChoice ?? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
}

function subscribe(callback: () => void) {
  const preference = window.matchMedia('(prefers-color-scheme: light)');
  window.addEventListener('storage', callback);
  window.addEventListener(EVENT, callback);
  preference.addEventListener('change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(EVENT, callback);
    preference.removeEventListener('change', callback);
  };
}

export default function useHeroTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => 'dark' as const);
  const selectTheme = (next: HeroTheme) => {
    memoryChoice = next;
    try { localStorage.setItem(KEY, next); memoryOnly = false; } catch { memoryOnly = true; }
    window.dispatchEvent(new Event(EVENT));
  };
  return { theme, selectTheme };
}
