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
| Photo corridor | `PortfolioMoments.tsx`, `ui/ImageStream.tsx` | `PortfolioMoments.module.css`, `ui/ImageStream.module.css` |
| Credentials | `CredentialsSection.tsx` | Existing section classes in `app/globals.css` |
| `/projects` | `ProjectsPageContent.tsx`, `ProjectsSection.tsx` | `PortfolioPages.module.css` and existing project classes |
| Projects screenshot gallery | `ProjectScreenshotGallery.tsx`, `lib/projectScreenshots.ts` | `ProjectScreenshotGallery.module.css` |
| `/skills` | `SkillsPageContent.tsx`, `SkillsSection.tsx` | `PortfolioPages.module.css` and existing skill classes |

`PortfolioShell.tsx` shares navigation, profile data, and the contact popup across the three public pages. `PortfolioFooter.tsx` is their shared contact section. Admin and API routes remain outside this shell.

Use `usePortfolio()` inside shell content to read the saved profile and open the contact popup. Projects and Skills use the same existing profile data and preserve the original project links, n8n workflow download/research, and skill accordions.

The Projects page includes all 15 `Screenshot*.png` uploads in a public visual archive before the system case studies. Its curated manifest is `lib/projectScreenshots.ts`. The gallery adapts the supplied scatter/line/circle/arc card choreography using CSS transitions, with selectable cards, previous/next controls, a full screenshot preview, and original-image links. Native page scrolling is retained. A text index makes every image easy to select, and reduced-motion preferences disable transitions and the automatic introduction.

The landing curves use the owner-supplied SVG geometry with 18 continuous strokes per rail. Each rail drifts slowly as one layer; stroke dashes and opacity do not animate. Background motion can be paused, stops outside the viewport or when a dialog/menu is open, and respects reduced motion preferences. The homepage wrapper and browser canvas use the same light background to prevent a dark flash during gate dismissal or overscroll.

The work corridor adapts the owner-supplied ImageStreamHero geometry in the existing `#story` section, between Experience and Credentials. It uses local workflow and website screenshots from `public/uploads`, landscape cards that contain the full image, CSS perspective, and a pause control. Every image gets a card on each rail, including collections larger than ten images. Motion stops offscreen, in background tabs, while a menu/contact dialog is open, and for reduced-motion preferences. The former WebGL gallery remains available in `ui/3d-gallery-photography.tsx` but is no longer mounted here.
