import Image from 'next/image';
import { ArrowUpRight, AudioLines, Download } from 'lucide-react';
import { englishListeningCertificate as certificate } from '@/lib/portfolioHighlights';
import styles from './EnglishProficiencySection.module.css';

const certificatePdf = certificate.pdf;

export default function EnglishProficiencySection() {
  return (
    <section id="english-proficiency" className={styles.section} aria-labelledby="english-title">
      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>Communication / English proficiency</p>
          <h2 id="english-title">Good work starts<br />with <em>understanding.</em></h2>
          <p className={styles.description}>Listening closely is part of how I work: understanding a brief, following a discussion, and keeping the details in focus.</p>
          <div className={styles.result}>
            <span className={styles.level}>{certificate.level}</span>
            <div><strong>{certificate.description}</strong><span><AudioLines size={15} aria-hidden="true" /> {certificate.framework} · {certificate.test}</span></div>
          </div>
          <dl className={styles.meta}><div><dt>Issued by</dt><dd>{certificate.issuer}</dd></div><div><dt>Achieved</dt><dd><time dateTime={certificate.date}>{certificate.displayDate}</time></dd></div></dl>
          <div className={styles.actions}>
            <a href={certificatePdf} target="_blank" rel="noopener noreferrer" className={styles.primary}>View certificate <ArrowUpRight size={15} /></a>
            <a href={certificatePdf} download>Download PDF <Download size={14} /></a>
          </div>
          <p className={styles.note}>{certificate.qualification}</p>
        </div>
        <figure className={styles.certificate}>
          <a href={certificatePdf} target="_blank" rel="noopener noreferrer" aria-label="View Harold Madjos’s C1 Advanced English listening certificate as a PDF">
            <Image src={certificate.preview} alt={`Exam English Certificate of Achievement for Harold jey N. Madjos, ${certificate.level} ${certificate.description}, dated ${certificate.displayDate}`} width={2000} height={1414} sizes="(max-width: 850px) 90vw, 55vw" className={styles.preview} />
          </a>
          <figcaption><span>Certificate of achievement</span><span>English listening / C1</span></figcaption>
        </figure>
      </div>
    </section>
  );
}
