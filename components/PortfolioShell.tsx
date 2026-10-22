'use client';

import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, LogIn, X } from 'lucide-react';
import { defaultProfileData, type ProfileData } from '@/lib/profileData';
import { profileStorage } from '@/lib/storage';
import PortfolioFooter from './PortfolioFooter';
import PortfolioNavbar from './PortfolioNavbar';
import styles from './PortfolioShell.module.css';

const ContactDialog = dynamic(() => import('@/components/ContactDialog'), { ssr: false });

function subscribeHash(callback: () => void) {
  window.addEventListener('hashchange', callback);
  window.addEventListener('popstate', callback);
  return () => { window.removeEventListener('hashchange', callback); window.removeEventListener('popstate', callback); };
}

const PortfolioContext = createContext<{ profile: ProfileData; openContact: () => void; contactOpen: boolean; menuOpen: boolean } | null>(null);

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('Portfolio content must be rendered inside PortfolioShell.');
  return context;
}

const menuLinks = [
  ['01', 'Home', '/#about'],
  ['02', 'The introduction', '/#chapter-one'],
  ['↗', 'English proficiency', '/#english-proficiency'],
  ['03', 'The approach', '/#approach'],
  ['04', 'Projects', '/projects'],
  ['05', 'Skills', '/skills'],
  ['↗', 'Automation lab', '/automation'],
  ['06', 'Meet Orbit', '/#playground'],
  ['07', 'Experience', '/#experience'],
  ['08', 'In motion', '/#story'],
  ['09', 'Credentials', '/#credentials'],
];

export default function PortfolioShell({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'dark' }) {
  const [profile, setProfile] = useState<ProfileData>(defaultProfileData);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const contactTrigger = useRef<HTMLButtonElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const navigation = useRef<HTMLElement>(null);
  const menuPanel = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash, () => '');
  const currentUrl = pathname === '/' ? `/${hash || '#about'}` : pathname;

  function openContact() {
    if (menuOpen) contactTrigger.current?.focus({ preventScroll: true });
    setMenuOpen(false);
    setContactOpen(true);
  }

  function closeMenu() {
    setMenuOpen(false);
    if (menuOpen) menuTrigger.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    const updateProfile = () => setProfile(profileStorage.getProfile());
    const timer = window.setTimeout(updateProfile, 0);
    window.addEventListener('storage', updateProfile);
    return () => { window.clearTimeout(timer); window.removeEventListener('storage', updateProfile); };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key.toLowerCase() === 'h') setShowAdmin((visible) => !visible);
      if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuTrigger.current?.focus({ preventScroll: true }); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    menuPanel.current?.querySelector<HTMLAnchorElement>('a[href]')?.focus({ preventScroll: true });
    const keepFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const controls = [
        ...navigation.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
        ...menuPanel.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
      ].filter((element) => element.getClientRects().length > 0);
      const first = controls[0];
      const last = controls.at(-1);
      if (!first || !last) return;
      const current = document.activeElement;
      if (!controls.includes(current as HTMLElement) || (event.shiftKey && current === first) || (!event.shiftKey && current === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus({ preventScroll: true });
      }
    };
    document.addEventListener('keydown', keepFocus);
    return () => {
      document.removeEventListener('keydown', keepFocus);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, [menuOpen]);

  return (
    <PortfolioContext value={{ profile, openContact, contactOpen, menuOpen }}>
      <main className={`luxury-site min-h-screen ${styles.shell}`} data-tone={tone}>
        <PortfolioNavbar
          fullName={profile.personalInfo.fullName}
          menuOpen={menuOpen}
          contactOpen={contactOpen}
          onMenuToggle={() => setMenuOpen(open => !open)}
          onCloseMenu={closeMenu}
          onContact={openContact}
          navigationRef={navigation}
          menuTriggerRef={menuTrigger}
          contactTriggerRef={contactTrigger}
        />
        <div id="site-menu" ref={menuPanel} className={styles.menu} data-open={menuOpen} role="region" aria-labelledby="site-menu-title" aria-hidden={!menuOpen} inert={!menuOpen} onClick={event => { if (event.target === event.currentTarget) closeMenu(); }}>
          <div className={styles.menuPanel}>
            <div className={styles.menuHeading}>
              <div><p>{profile.personalInfo.fullName}</p><h2 id="site-menu-title">Explore the portfolio.</h2></div>
              <button type="button" onClick={closeMenu} className={styles.closeMenu} aria-label="Close navigation"><X size={19} strokeWidth={1.5} /></button>
            </div>
            <ul className={styles.menuGrid}>{menuLinks.map(([number, label, href]) => (
              <li key={href}><Link href={href} onNavigate={closeMenu} aria-current={href === currentUrl ? 'page' : undefined} className={styles.menuLink}><span>{number}</span><span>{label}</span><ArrowUpRight size={16} strokeWidth={1.4} aria-hidden="true" /></Link></li>
            ))}</ul>
            <div className={styles.menuFooter}>
              <p>Independent automation &amp; AI specialist<br /><span>{profile.personalInfo.location}</span></p>
              <button type="button" onClick={openContact} aria-haspopup="dialog" className={styles.menuContact}>Let&apos;s talk <ArrowUpRight size={15} aria-hidden="true" /></button>
            </div>
          </div>
        </div>
        <div inert={menuOpen} aria-hidden={menuOpen ? true : undefined}>
          {children}
          <PortfolioFooter />
        </div>
        {contactOpen && <ContactDialog open onClose={() => setContactOpen(false)} email={profile.personalInfo.email} fullName={profile.personalInfo.fullName} />}
        {showAdmin && <Link href="/admin" className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-xl"><LogIn size={14} /> Edit profile</Link>}
      </main>
    </PortfolioContext>
  );
}
