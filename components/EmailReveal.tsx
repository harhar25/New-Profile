'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Mail, Sparkles } from 'lucide-react';
import styles from './PortfolioFooter.module.css';

export default function EmailReveal({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLSpanElement>(null);
  const popupId = useId();

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  return (
    <span
      ref={container}
      className={styles.emailReveal}
      onPointerEnter={event => { if (event.pointerType !== 'touch') setOpen(true); }}
      onPointerLeave={() => { if (!container.current?.contains(document.activeElement)) setOpen(false); }}
      onFocus={() => setOpen(true)}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    >
      <button
        type="button"
        className={styles.socialLink}
        aria-label="Show email address"
        aria-expanded={open}
        aria-controls={open ? popupId : undefined}
        aria-describedby={open ? popupId : undefined}
        onClick={() => setOpen(true)}
      >
        <Mail size={14} aria-hidden="true" /> Email
      </button>
      {open && <span id={popupId} role="tooltip" className={styles.emailPopup}>
        <span className={styles.emailGreeting}><Sparkles size={15} aria-hidden="true" /> Say hello!</span>
        <span className={styles.emailAddress}>{email}</span>
      </span>}
    </span>
  );
}
