import { ArrowRightLeft, Bot, ChartNoAxesCombined, CheckCheck, Code2, Database, FileText, Globe, Mail, MousePointer2, Search, ShieldCheck, Webhook, Workflow } from 'lucide-react';
import styles from './FeatureBlocks.module.css';

const diagrams = [
  [[Webhook, 'Receive'], [Bot, 'Draft'], [FileText, 'Review']],
  [[MousePointer2, 'Capture'], [Workflow, 'Route'], [Mail, 'Follow up']],
  [[Search, 'Discover'], [Globe, 'Publish'], [ChartNoAxesCombined, 'Measure']],
  [[Database, 'Collect'], [ArrowRightLeft, 'Sync'], [ChartNoAxesCombined, 'Report']],
  [[Bot, 'Generate'], [ShieldCheck, 'Validate'], [CheckCheck, 'Approve']],
  [[Code2, 'Build'], [ShieldCheck, 'Test'], [CheckCheck, 'Deliver']],
] as const;

export default function SystemIllustration({ index }: { index: number }) {
  const nodes = diagrams[index % diagrams.length];
  return <div className={styles.diagram} aria-hidden="true">{nodes.map(([Icon, label], step) => <div key={label} style={{ display: 'contents' }}>{step > 0 && <span className={styles.connector} />}<div className={styles.diagramNode}><Icon /><span>{label}</span></div></div>)}</div>;
}
