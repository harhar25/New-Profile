import { defaultProfileData } from './profileData';
import { englishListeningCertificate } from './portfolioHighlights';

// The model chooses IDs, never executable code or arbitrary destinations.
export const orbitActions = {
  projects: { label: 'Explore projects', href: '/projects', kind: 'link' },
  gallery: { label: 'View project screenshots', href: '/projects#project-gallery', kind: 'link' },
  skills: { label: 'Explore skills', href: '/skills', kind: 'link' },
  automation: { label: 'Try the automation playground', href: '/automation', kind: 'link' },
  certificate: { label: 'See the English certificate', href: '/#english-proficiency', kind: 'link' },
  certificate_pdf: { label: 'View certificate PDF', href: englishListeningCertificate.pdf, kind: 'external' },
  editorial: { label: 'Download the n8n demo', href: '/downloads/n8n-ai-editorial-pipeline.json', kind: 'download' },
  contact: { label: 'Talk to Harold', href: '', kind: 'contact' },
  linkedin: { label: 'Visit LinkedIn', href: defaultProfileData.socialLinks.linkedin!, kind: 'external' },
  github: { label: 'Visit GitHub', href: defaultProfileData.socialLinks.github!, kind: 'external' },
} as const;

export type OrbitActionId = keyof typeof orbitActions;

export function validActions(value: unknown): OrbitActionId[] {
  return Array.isArray(value) ? [...new Set(value.filter((id): id is OrbitActionId => typeof id === 'string' && Object.hasOwn(orbitActions, id)))].slice(0, 3) : [];
}

export function validFollowUps(value: unknown): string[] {
  return Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === 'string' && !!item.trim() && item.length <= 100).map(item => item.trim()))].slice(0, 3) : [];
}

