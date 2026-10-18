'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, LogIn, Menu, X } from 'lucide-react';
import { defaultProfileData, type ProfileData } from '@/lib/profileData';
import { profileStorage } from '@/lib/storage';
import PortfolioFooter from './PortfolioFooter';
import styles from './PortfolioShell.module.css';

const ContactDialog = dynamic(() => import('@/components/ContactDialog'), { ssr: false });

const PortfolioContext = createContext<{ profile: ProfileData; openContact: () => void; contactOpen: boolean; menuOpen: boolean } | null>(null);

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('Portfolio content must be rendered inside PortfolioShell.');
  return context;
}

const menuLinks = [
  ['01', 'Home', '/#about'],
  ['02', 'The introduction', '/#chapter-one'],
  ['03', 'The approach', '/#approach'],
  ['04', 'Projects', '/projects'],
  ['05', 'Skills', '/skills'],
  ['06', 'Meet Orbit', '/#playground'],
  ['07', 'Experience', '/#experience'],
  ['08', 'In motion', '/#story'],
  ['09', 'Credentials', '/#credentials'],
];

export default function PortfolioShell({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'dark' }) {
  const [profile, setProfile] = useState<ProfileData>(defaultProfileData);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const contactTrigger = useRef<HTMLButtonElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const navigation = useRef<HTMLElement>(null);
  const menuPanel = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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
    return () => document.removeEventListener('keydown', keepFocus);
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const lightNav = tone === 'light' && !navScrolled && !menuOpen;

  return (
    <PortfolioContext value={{ profile, openContact, contactOpen, menuOpen }}>
      <main className={`luxury-site min-h-screen ${styles.shell}`} data-tone={tone}>
        <nav ref={navigation} className={`site-nav fixed inset-x-0 top-0 z-50 ${styles.nav} ${lightNav ? styles.lightNav : ''} ${navScrolled || menuOpen ? 'is-scrolled' : ''}`} aria-label="Main navigation">
          <div className="site-nav-inner relative mx-auto flex h-[86px] items-center justify-between sm:h-[100px]">
            <div className={styles.navStart}>
              <button ref={menuTrigger} type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="site-menu" className="nav-menu-button flex items-center gap-3 text-[11px] font-medium">
                {menuOpen ? <X size={21} strokeWidth={1.4} /> : <Menu size={21} strokeWidth={1.4} />}<span>{menuOpen ? 'Close' : 'Menu'}</span>
              </button>
              <div className={styles.routeLinks}>
                <Link href="/projects" aria-current={pathname === '/projects' ? 'page' : undefined}>Projects</Link>
                <Link href="/skills" aria-current={pathname === '/skills' ? 'page' : undefined}>Skills</Link>
              </div>
            </div>
            <Link href="/#about" onClick={closeMenu} aria-label={`${profile.personalInfo.fullName}, home`} className={`brand-mark absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${styles.brand}`}>HM</Link>
            <button ref={contactTrigger} type="button" onClick={openContact} aria-haspopup="dialog" className="nav-contact inline-flex items-center gap-2 text-[11px] font-medium"><span className="hidden sm:inline">Get in touch</span><span className="sm:hidden">Contact</span><ArrowUpRight size={14} strokeWidth={1.4} /></button>
          </div>
        </nav>
        <div id="site-menu" ref={menuPanel} className={`site-menu ${styles.menu} ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen} inert={!menuOpen}>
          <div className={`site-menu-inner ${styles.menuInner}`}>
            <p className="eyebrow text-white/40">Explore / {profile.personalInfo.fullName}</p>
            {menuLinks.map(([number, label, href]) => (
              <Link key={href} href={href} onClick={closeMenu} aria-current={href === pathname ? 'page' : undefined} className={`site-menu-link ${styles.menuLink}`}><span>{number}</span>{label}<ArrowUpRight size={23} strokeWidth={1} /></Link>
            ))}
            <button type="button" onClick={openContact} aria-haspopup="dialog" className={`site-menu-link ${styles.menuLink} ${styles.menuContact}`}><span>10</span>Get in touch<ArrowUpRight size={23} strokeWidth={1} /></button>
            <p className="mt-8 text-xs text-white/40">Independent automation &amp; AI systems specialist · {profile.personalInfo.location}</p>
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
