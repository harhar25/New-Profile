# Portfolio pages and sections

Each homepage section is composed independently in `components/HomeSections.tsx`. Replace a section component or give it a dedicated CSS module to change its design without rewriting the page.

| Page / section | Component | Styling |
| --- | --- | --- |
| `/` landing | `BackgroundPathsHero.tsx` | `BackgroundPathsHero.module.css` |
| Introduction | `IntroductionSection.tsx` | `.intro-*` in `app/globals.css` |
| English listening certificate | `EnglishProficiencySection.tsx` | `EnglishProficiencySection.module.css` |
| Approach | `WorkflowPoster.tsx` | `.workflow-poster-*` in `app/globals.css` |
| Links to Projects and Skills | `PortfolioLinksSection.tsx` | `PortfolioLinksSection.module.css` |
| Conversational robot | `RobotShowcase.tsx`, `RobotChat.tsx` | Respective CSS modules |
| Experience | `ExperienceSection.tsx` | Existing section classes in `app/globals.css` |
| Photo corridor | `PortfolioMoments.tsx`, `ui/ImageStream.tsx` | `PortfolioMoments.module.css`, `ui/ImageStream.module.css` |
| Credentials | `CredentialsSection.tsx` | Existing section classes in `app/globals.css` |
| `/projects` | `ProjectsPageContent.tsx`, `ProjectsSection.tsx`, `SystemIllustration.tsx` | `PortfolioPages.module.css`, `FeatureBlocks.module.css` |
| Projects screenshot gallery | `ProjectScreenshotGallery.tsx`, `lib/projectScreenshots.ts` | `ProjectScreenshotGallery.module.css` |
| `/skills` | `SkillsPageContent.tsx`, `SkillsSection.tsx`, `SystemIllustration.tsx` | `PortfolioPages.module.css`, `FeatureBlocks.module.css` |
| `/automation` | `AutomationPlayground.tsx`, `lib/automationPlayground.ts` | `AutomationPlayground.module.css` |

`PortfolioShell.tsx` shares navigation, profile data, and the contact popup across the public pages. `PortfolioFooter.tsx` is their shared contact section. Admin and API routes remain outside this shell.

Use `usePortfolio()` inside shell content to read the saved profile and open the contact popup. Projects and Skills use the same existing profile data and preserve the original project links, n8n workflow download/research, and all skill names and proficiencies. Both sections use a compact illustrated feature grid inspired by the owner-selected uiable Feature Highlights Grid reference; skills are visible directly in category cards.

The automation playground is linked from the menu, Projects, and Skills. Its n8n-, GoHighLevel-, Make-, and Zapier-inspired modes have separate starter layouts and load a fresh workflow when switched. Visitors can add/configure/remove nodes, drag their grips (or use arrow keys), connect output and input ports (or use the connection form), remove connections, zoom, and run/stop a browser-only sample simulation. Sample data, tags, score filters, email previews, CRM stages, and spreadsheet previews follow the actual directed graph. The engine rejects disconnected steps, loops, duplicate inputs, and invalid data. No live integrations or credentials are used, and edits last for the current page visit. Run `npm run test:automation` for graph and execution tests.

The Projects page includes the 15 original `Screenshot*.png` uploads plus 48 distinct additional images from `public/Automation`, for 63 public archive frames before the system case studies. Its curated manifests are `lib/projectScreenshots.ts` and `lib/automationScreenshots.ts`. Five byte-identical Automation images reuse existing archive entries; the two dot-prefixed images use their existing public copies in `uploads` because Next cannot serve dot-prefixed files. The gallery adapts the supplied scatter/line/circle/arc card choreography using CSS transitions, with 12 thumbnails per set, previous/next controls, a full screenshot preview, and original-image links. Native page scrolling is retained. A text index makes every image easy to select, and reduced-motion preferences disable transitions and the automatic introduction.

The homepage features the English listening certificate immediately after the introduction. Its preview is a direct raster rendering of `public/C1_certificate/Harold_jey_N_Madjos_C1_certificate-listening.pdf`; view and download actions link to that original PDF. The section reports Exam English, 24 July 2026, CEFR C1 Advanced listening, and the certificate's self-assessment qualification without extending the result to speaking, reading, or writing.

The landing curves use the owner-supplied SVG geometry with 18 continuous strokes per rail. Each rail drifts slowly as one layer; stroke dashes and opacity do not animate. Background motion can be paused, stops outside the viewport or when a dialog/menu is open, and respects reduced motion preferences. The homepage wrapper and browser canvas use the same light background to prevent a dark flash during gate dismissal or overscroll.

The work corridor adapts the owner-supplied ImageStreamHero geometry in the existing `#story` section, between Experience and Credentials. It uses local workflow and website screenshots from `public/uploads`, landscape cards that contain the full image, CSS perspective, and a pause control. Every image gets a card on each rail, including collections larger than ten images. Motion stops offscreen, in background tabs, while a menu/contact dialog is open, and for reduced-motion preferences. The former WebGL gallery remains available in `ui/3d-gallery-photography.tsx` but is no longer mounted here.
