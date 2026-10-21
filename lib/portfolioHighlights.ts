import type { Project } from './profileData';

export const editorialPipelineProject: Project = {
  id: 'n8n-ai-editorial-pipeline',
  title: 'AI Editorial Draft Pipeline',
  description: 'An importable n8n workflow that validates a content brief, generates an article draft with OpenAI, and saves it to WordPress for editorial review. It never publishes automatically.',
  technologies: ['n8n', 'OpenAI', 'WordPress', 'Webhooks', 'Human Review'],
  link: '/downloads/n8n-ai-editorial-pipeline.json',
  featured: true,
};

export const englishListeningCertificate = {
  level: 'C1',
  description: 'Advanced English listening',
  issuer: 'Exam English',
  test: 'Listening Level Test',
  framework: 'CEFR',
  date: '2026-07-24',
  displayDate: '24 July 2026',
  qualification: 'Exam English listening self-assessment, aligned to the CEFR. This is not an official examination result.',
  pdf: '/C1_certificate/Harold_jey_N_Madjos_C1_certificate-listening.pdf',
  preview: '/C1_certificate/c1-listening-preview.png',
  section: '/#english-proficiency',
};
