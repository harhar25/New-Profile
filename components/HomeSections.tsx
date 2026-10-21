'use client';

import BackgroundPathsHero from './BackgroundPathsHero';
import IntroductionSection from './IntroductionSection';
import EnglishProficiencySection from './EnglishProficiencySection';
import WorkflowPoster from './WorkflowPoster';
import PortfolioLinksSection from './PortfolioLinksSection';
import RobotShowcase from './RobotShowcase';
import ExperienceSection from './ExperienceSection';
import PortfolioMoments from './PortfolioMoments';
import CredentialsSection from './CredentialsSection';
import { usePortfolio } from './PortfolioShell';

export default function HomeSections() {
  const { profile, openContact, contactOpen, menuOpen } = usePortfolio();
  const { personalInfo } = profile;
  return (
    <>
      <BackgroundPathsHero fullName={personalInfo.fullName} location={personalInfo.location} suspended={contactOpen || menuOpen} />
      <IntroductionSection profile={profile} />
      <EnglishProficiencySection />
      <WorkflowPoster fullName={personalInfo.fullName} location={personalInfo.location} title={personalInfo.title} />
      <PortfolioLinksSection />
      <RobotShowcase suspended={contactOpen || menuOpen} onContact={openContact} />
      <ExperienceSection experiences={profile.experiences} />
      <PortfolioMoments suspended={contactOpen || menuOpen} />
      <CredentialsSection certifications={profile.certifications} />
    </>
  );
}
