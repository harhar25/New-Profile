'use client';

import { useId, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, FileText, Layers3, Workflow } from 'lucide-react';
import styles from './PortfolioFolder.module.css';

export type FolderPreview = {
  title: string;
  meta: string;
  href: string;
  image?: string;
  items?: string[];
};

type PortfolioFolderProps = {
  label: string;
  meta: string;
  tone: 'projects' | 'skills';
  files: FolderPreview[];
};

// Panel geometry adapted from the supplied Glass Folder Cards component.
const BACK_PATH = 'M0 56A22 22 0 0 1 22 34L146 34C170 34 172 0 198 0L318 0A22 22 0 0 1 340 22L340 250A22 22 0 0 1 318 272L22 272A22 22 0 0 1 0 250Z';
const FRONT_PATH = 'M0 22A22 22 0 0 1 22 0L118 0C144 0 146 32 172 32L318 32A22 22 0 0 1 340 54L340 176A22 22 0 0 1 318 198L22 198A22 22 0 0 1 0 176Z';

export default function PortfolioFolder({ label, meta, tone, files }: PortfolioFolderProps) {
  const id = useId().replace(/:/g, '');
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const Icon = tone === 'projects' ? Workflow : Layers3;

  return (
    <div
      ref={root}
      className={styles.folder}
      data-tone={tone}
      data-open={open}
      onPointerMove={(event) => {
        if (event.pointerType === 'touch') return;
        const bounds = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty('--pointer-x', String((event.clientX - bounds.left) / bounds.width - 0.5));
        event.currentTarget.style.setProperty('--pointer-y', String((event.clientY - bounds.top) / bounds.height - 0.5));
      }}
      onPointerLeave={() => {
        root.current?.style.setProperty('--pointer-x', '0');
        root.current?.style.setProperty('--pointer-y', '0');
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Escape' || !open) return;
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        toggle.current?.focus({ preventScroll: true });
      }}
    >
      <svg width="0" height="0" className={styles.definitions} aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={`${id}-back`} clipPathUnits="objectBoundingBox">
            <path d={BACK_PATH} transform="scale(.00294117647 .00367647059)" />
          </clipPath>
          <clipPath id={`${id}-front`} clipPathUnits="objectBoundingBox">
            <path d={FRONT_PATH} transform="scale(.00294117647 .00505050505)" />
          </clipPath>
          <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="white" stopOpacity=".9" />
            <stop offset="1" stopColor="white" stopOpacity=".12" />
          </linearGradient>
        </defs>
      </svg>
      <div className={styles.stage}>
        <div className={styles.shadow} aria-hidden="true" />
        <div className={styles.back} style={{ clipPath: `url(#${id}-back)` }} aria-hidden="true">
          <div className={styles.art} />
          <div className={styles.sheen} />
        </div>
        <svg className={styles.backRim} viewBox="0 0 340 272" aria-hidden="true"><path d={BACK_PATH} /></svg>
        <button
          ref={toggle}
          type="button"
          className={styles.front}
          style={{ clipPath: `url(#${id}-front)` }}
          aria-expanded={open}
          aria-controls={`${id}-files`}
          aria-label={`${open ? 'Close' : 'Open'} ${label} folder`}
          aria-describedby={`${id}-hint`}
          onClick={() => setOpen((value) => !value)}
        >
          <span className={styles.tint} aria-hidden="true" />
          <span className={styles.reflection} aria-hidden="true" />
          <svg className={styles.frontRim} viewBox="0 0 340 198" aria-hidden="true"><path d={FRONT_PATH} stroke={`url(#${id}-rim)`} /></svg>
          <span className={styles.frontIcon} aria-hidden="true"><Icon size={22} strokeWidth={1.2} /></span>
          <span className={styles.label}><span className={styles.title}>{label}</span><span className={styles.meta}>{meta}</span></span>
          <span className={styles.folderKey} aria-hidden="true"><span /><span /></span>
        </button>
        <ul id={`${id}-files`} className={styles.files} aria-label={`${label} previews`} aria-hidden={!open} inert={!open}>
          {files.map((file, index) => (
            <li key={file.title} className={styles.sheetSlot}>
              <Link
                href={file.href}
                className={styles.sheet}
                style={{
                  '--slot': files.length <= 1 ? 0 : index / (files.length - 1) * 2 - 1,
                  '--depth': files.length - 1 - index,
                  zIndex: index + 1,
                } as CSSProperties}
              >
                <span className={styles.sheetHeading}><FileText size={13} aria-hidden="true" /><span>{file.title}</span><ArrowUpRight size={13} aria-hidden="true" /></span>
                {file.image ? (
                  <span className={styles.image}><Image src={file.image} alt="" fill sizes="(max-width: 639px) 65vw, 320px" draggable={false} /></span>
                ) : (
                  <span className={styles.skillPreview}>{file.items?.map((item) => <span key={item}><i aria-hidden="true" />{item}</span>)}</span>
                )}
                <span className={styles.sheetMeta}>{file.meta}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <p id={`${id}-hint`} className={styles.hint}><span className={styles.hintDot} aria-hidden="true" />{open ? 'Choose a preview to explore' : 'Open a folder. Find a little more.'}</p>
    </div>
  );
}
