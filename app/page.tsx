import PortfolioShell from '@/components/PortfolioShell';
import HomeSections from '@/components/HomeSections';
import PortfolioGate from '@/components/PortfolioGate';

export default function Home() {
  return (
    <PortfolioGate>
      <PortfolioShell tone="dark">
        <HomeSections />
      </PortfolioShell>
    </PortfolioGate>
  );
}
