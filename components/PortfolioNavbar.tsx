'use client';

import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FolderKanban, House, Layers3, Mail, Menu, Workflow, X } from 'lucide-react';
import styles from './PortfolioNavbar.module.css';

const links = [
  { key: 'home', label: 'Home', href: '/#about', path: '/', icon: House },
  { key: 'projects', label: 'Projects', href: '/projects', path: '/projects', icon: FolderKanban },
  { key: 'skills', label: 'Skills', href: '/skills', path: '/skills', icon: Layers3 },
  { key: 'automation', label: 'Playground', href: '/automation', path: '/automation', icon: Workflow },
];

type Position = { left: number; width: number };
type Props = {
  fullName: string;
  menuOpen: boolean;
  contactOpen: boolean;
  onMenuToggle: () => void;
  onCloseMenu: () => void;
  onContact: () => void;
  navigationRef: RefObject<HTMLElement | null>;
  menuTriggerRef: RefObject<HTMLButtonElement | null>;
  contactTriggerRef: RefObject<HTMLButtonElement | null>;
};

export default function PortfolioNavbar({ fullName, menuOpen, contactOpen, onMenuToggle, onCloseMenu, onContact, navigationRef, menuTriggerRef, contactTriggerRef }: Props) {
  const pathname = usePathname();
  const dock = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [interacting, setInteracting] = useState(false);
  const page = links.find(link => link.path === pathname)?.key ?? 'home';
  const activeKey = contactOpen ? 'contact' : menuOpen ? 'menu' : page;
  const active = positions[activeKey];

  useLayoutEffect(() => {
    const element = dock.current;
    if (!element) return;
    const measure = () => {
      const bounds = element.getBoundingClientRect();
      const next = Object.fromEntries([...element.querySelectorAll<HTMLElement>('[data-nav-key]')].map(item => {
        const rect = item.getBoundingClientRect();
        return [item.dataset.navKey!, { left: rect.left - bounds.left - element.clientLeft, width: rect.width }];
      }));
      setPositions(previous => Object.keys(next).every(key => previous[key]?.left === next[key].left && previous[key]?.width === next[key].width) ? previous : next);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element.querySelectorAll<HTMLElement>('[data-nav-key]').forEach(item => observer.observe(item));
    measure();
    return () => observer.disconnect();
  }, []);

  return (
    <nav ref={navigationRef} className={`site-nav ${styles.nav}`} aria-label="Main navigation" data-active={activeKey}>
      <div className={styles.bar}>
        <Link href="/#about" onNavigate={onCloseMenu} className={styles.brand} aria-label={`${fullName}, home`}>
          <Image src="/icon.svg" alt="" width={40} height={40} />
          <span>Harold Madjos<small>Automation &amp; AI</small></span>
        </Link>
        <div
          ref={dock}
          className={styles.dock}
          data-ready={Boolean(active)}
          data-interacting={interacting}
          onPointerOver={event => { if (event.pointerType !== 'touch') setInteracting(true); }}
          onPointerLeave={() => setInteracting(false)}
          onFocus={() => setInteracting(true)}
          onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}
        >
          <span className={styles.indicator} style={{ left: active?.left ?? 6, width: active?.width ?? 0 }} aria-hidden="true" />
          <span className={styles.mascot} style={{ left: active ? active.left + active.width / 2 : 0 }} aria-hidden="true">
            <span className={styles.mascotFloat}><Image src="/images/harold-nav-mascot.png" alt="" width={96} height={88} sizes="(max-width: 639px) 76px, 96px" loading="eager" className={styles.portrait} /></span>
          </span>
          {links.map(link => {
            const Icon = link.icon;
            return <Link
              key={link.key}
              href={link.href}
              onNavigate={onCloseMenu}
              data-nav-key={link.key}
              data-selected={activeKey === link.key}
              aria-current={page === link.key ? 'page' : undefined}
              className={styles.tab}
            ><Icon size={17} strokeWidth={1.65} aria-hidden="true" /><span>{link.label}</span></Link>;
          })}
          <button
            ref={menuTriggerRef}
            type="button"
            onClick={onMenuToggle}
            className={`${styles.tab} ${styles.more}`}
            data-nav-key="menu"
            data-selected={activeKey === 'menu'}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
          >{menuOpen ? <X size={18} strokeWidth={1.65} aria-hidden="true" /> : <Menu size={18} strokeWidth={1.65} aria-hidden="true" />}<span>More</span></button>
          <button
            ref={contactTriggerRef}
            type="button"
            onClick={onContact}
            className={`${styles.tab} ${styles.contact}`}
            data-nav-key="contact"
            data-selected={activeKey === 'contact'}
            aria-label="Get in touch"
            aria-haspopup="dialog"
          ><Mail size={16} strokeWidth={1.65} aria-hidden="true" /><span>Contact</span></button>
        </div>
      </div>
    </nav>
  );
}
