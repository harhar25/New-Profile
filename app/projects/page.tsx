import type { Metadata } from 'next';
import PortfolioShell from '@/components/PortfolioShell';
import ProjectsPageContent from '@/components/ProjectsPageContent';

export const metadata: Metadata = {
  title: 'Projects | Harold Madjos',
  description:
    'Explore Harold Madjos’s automation and AI projects, including an importable n8n editorial workflow and practical implementation research.',
};

export default function ProjectsPage() {
  return (
    <PortfolioShell tone="dark">
      <ProjectsPageContent />
    </PortfolioShell>
  );
}
