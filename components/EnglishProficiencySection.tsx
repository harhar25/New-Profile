import Image from 'next/image';
import { ArrowUpRight, AudioLines, Download } from 'lucide-react';
import styles from './EnglishProficiencySection.module.css';

const certificatePdf = '/C1_certificate/Harold_jey_N_Madjos_C1_certificate-listening.pdf';

export default function EnglishProficiencySection() {
  return (
    <section id="english-proficiency" className={styles.section} aria-labelledby="english-title">
      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>Communication / English proficiency</p>
          <h2 id="english-title">Good work starts<br />with <em>understanding.</em></h2>
          <p className={styles.description}>Listening closely is part of how I work: understanding a brief, following a discussion, and keeping the details in focus.</p>
          <div className={styles.result}>
            <span className={styles.level}>C1</span>
            <div><strong>Advanced English listening</strong><span><AudioLines size={15} aria-hidden="true" /> CEFR · Listening Level Test</span></div>
          </div>
          <dl className={styles.meta}><div><dt>Issued by</dt><dd>Exam English</dd></div><div><dt>Achieved</dt><dd><time dateTime="2026-07-24">24 July 2026</time></dd></div></dl>
          <div className={styles.actions}>
            <a href={certificatePdf} target="_blank" rel="noopener noreferrer" className={styles.primary}>View certificate <ArrowUpRight size={15} /></a>
            <a href={certificatePdf} download>Download PDF <Download size={14} /></a>
          </div>
          <p className={styles.note}>Exam English listening self-assessment, aligned to the CEFR. This is not an official examination result.</p>
        </div>
        <figure className={styles.certificate}>
          <a href={certificatePdf} target="_blank" rel="noopener noreferrer" aria-label="View Harold Madjos’s C1 Advanced English listening certificate as a PDF">
            <Image src="/C1_certificate/c1-listening-preview.png" alt="Exam English Certificate of Achievement for Harold jey N. Madjos, C1 Advanced English Listening, dated 24 July 2026" width={2000} height={1414} sizes="(max-width: 850px) 90vw, 55vw" className={styles.preview} />
          </a>
          <figcaption><span>Certificate of achievement</span><span>English listening / C1</span></figcaption>
        </figure>
      </div>
    </section>
  );
}
