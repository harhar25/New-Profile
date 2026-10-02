'use client';

import Image from 'next/image';
import { ArrowUpRight, Mail, Pause, Play, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import styles from './ContactDialog.module.css';

const formUrl = 'https://form.jotform.com/haroldjeymadjos/start-a-conversation';

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
  email: string;
  fullName: string;
}

function ContactContent({ email, fullName }: Pick<ContactDialogProps, 'email' | 'fullName'>) {
  const portrait = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [loaded, setLoaded] = useState(false);

  function tiltPortrait(event: PointerEvent<HTMLDivElement>) {
    if (paused || event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    portrait.current?.style.setProperty('--avatar-turn', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 14}deg`);
    portrait.current?.style.setProperty('--avatar-nod', `${((event.clientY - bounds.top) / bounds.height - 0.5) * -10}deg`);
  }

  function resetTilt() {
    portrait.current?.style.setProperty('--avatar-turn', '0deg');
    portrait.current?.style.setProperty('--avatar-nod', '0deg');
  }

  return (
    <div className={styles.layout}>
      <aside className={`${styles.introduction} ${paused ? styles.paused : ''}`}>
        <p className={styles.eyebrow}><span /> A conversation, a possibility</p>
        <h2 id="contact-dialog-title" className={styles.title}>Good things<br />start with <em>hello.</em></h2>
        <div className={styles.avatarStage} onPointerMove={tiltPortrait} onPointerLeave={resetTilt}>
          <div className={styles.orbit} aria-hidden="true" />
          <div className={styles.avatarFloat}>
            <div className={styles.avatarTilt} ref={portrait}>
              <Image src="/uploads/contact-avatar.png" alt={`Illustrated portrait of ${fullName}`} width={440} height={440} sizes="(max-width: 700px) 140px, 290px" loading="eager" className={styles.portrait} />
            </div>
          </div>
          <span className={styles.sparkle} aria-hidden="true"><Sparkles size={23} strokeWidth={1.1} /></span>
          <span className={styles.hello}>Hey, I&apos;m Harold <span className={styles.wave} aria-hidden="true">✦</span></span>
        </div>
        <p className={styles.description}>A new idea, a tricky workflow, or a better way to work. Tell me what you have in mind.</p>
        <div className={styles.introFooter}>
          <a href={`mailto:${email}`}><Mail size={14} strokeWidth={1.4} /><span>{email}</span></a>
          <button type="button" className={styles.motionButton} aria-label={paused ? 'Play contact avatar animation' : 'Pause contact avatar animation'} aria-pressed={paused} onClick={() => { resetTilt(); setPaused((value) => !value); }}>
            {paused ? <Play size={12} /> : <Pause size={12} />}
            <span>{paused ? 'Play avatar' : 'Pause avatar'}</span>
          </button>
        </div>
      </aside>

      <section className={styles.formPane} aria-label="Project enquiry form">
        <div className={styles.formHeading}>
          <p className={styles.eyebrow}>Let&apos;s make something work</p>
          <p>A few details. A clearer next step.</p>
        </div>
        <div className={styles.frameWrap} aria-busy={!loaded}>
          {!loaded && <div className={styles.loading} role="status"><span />Opening your conversation…</div>}
          <iframe
            title="Start a conversation with Harold"
            src={formUrl}
            className={styles.formFrame}
            onLoad={() => setLoaded(true)}
            allow="clipboard-write"
          />
        </div>
        <div className={styles.formFooter}>
          <span>Prefer a separate window?</span>
          <a href={formUrl} target="_blank" rel="noopener noreferrer">Open form <ArrowUpRight size={13} /></a>
        </div>
      </section>
    </div>
  );
}

export default function ContactDialog({ open, onClose, email, fullName }: ContactDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const backdropPress = useRef(false);

  useEffect(() => {
    const element = dialog.current;
    if (!element || !open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    element.showModal();
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    closeButton.current?.focus({ preventScroll: true });
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby="contact-dialog-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onPointerDown={(event) => { backdropPress.current = event.target === event.currentTarget; }}
      onClick={(event) => {
        if (backdropPress.current && event.target === event.currentTarget) onClose();
        backdropPress.current = false;
      }}
    >
      <button ref={closeButton} type="button" className={styles.close} onClick={onClose} aria-label="Close contact form"><X size={19} strokeWidth={1.5} /></button>
      {open && <ContactContent email={email} fullName={fullName} />}
    </dialog>
  );
}
