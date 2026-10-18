import type { Metadata } from 'next';
import PortfolioShell from '@/components/PortfolioShell';
import SkillsPageContent from '@/components/SkillsPageContent';

export const metadata: Metadata = {
  title: 'Skills | Harold Madjos',
  description:
    'Explore Harold Madjos’s skills in GoHighLevel automation, integrations, AI applications, SEO, reporting, and digital operations.',
};

export default function SkillsPage() {
  return (
    <PortfolioShell tone="light">
      <SkillsPageContent />
    </PortfolioShell>
  );
}
