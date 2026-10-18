# Portfolio pages and sections

Each homepage section is composed independently in `components/HomeSections.tsx`. Replace a section component or give it a dedicated CSS module to change its design without rewriting the page.

| Page / section | Component | Styling |
| --- | --- | --- |
| `/` landing | `BackgroundPathsHero.tsx` | `BackgroundPathsHero.module.css` |
| Introduction | `IntroductionSection.tsx` | `.intro-*` in `app/globals.css` |
| Approach | `WorkflowPoster.tsx` | `.workflow-poster-*` in `app/globals.css` |
| Links to Projects and Skills | `PortfolioLinksSection.tsx` | `PortfolioLinksSection.module.css` |
| Conversational robot | `RobotShowcase.tsx`, `RobotChat.tsx` | Respective CSS modules |
| Experience | `ExperienceSection.tsx` | Existing section classes in `app/globals.css` |
| Photo gallery | `PortfolioMoments.tsx` | `.gallery-*` in `app/globals.css` |
| Credentials | `CredentialsSection.tsx` | Existing section classes in `app/globals.css` |
| `/projects` | `ProjectsPageContent.tsx`, `ProjectsSection.tsx` | `PortfolioPages.module.css` and existing project classes |
| `/skills` | `SkillsPageContent.tsx`, `SkillsSection.tsx` | `PortfolioPages.module.css` and existing skill classes |

`PortfolioShell.tsx` shares navigation, profile data, the floating avatar/orb, and the contact popup across the three public pages. `PortfolioFooter.tsx` is their shared contact section. Admin and API routes remain outside this shell.

Use `usePortfolio()` inside shell content to read the saved profile and open the contact popup. Projects and Skills use the same existing profile data and preserve the original project links, n8n workflow download/research, and skill accordions.

The landing curves use the owner-supplied SVG geometry. Their motion and letter entrance use CSS with deterministic timing. Background motion can be paused, stops outside the viewport or when a dialog/menu is open, and respects reduced motion preferences.
