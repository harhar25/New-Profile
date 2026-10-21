import type { Metadata } from 'next';
import PortfolioShell from '@/components/PortfolioShell';
import AutomationPlayground from '@/components/AutomationPlayground';

export const metadata: Metadata = { title: 'Automation Playground | Harold Madjos', description: 'Connect nodes, customize a sample lead workflow, and explore four automation builder styles in an interactive portfolio demo.' };

export default function AutomationPage() {
  return <PortfolioShell tone="dark"><AutomationPlayground /></PortfolioShell>;
}
