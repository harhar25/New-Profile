import { automationScreenshots } from './automationScreenshots';

// Public portfolio screenshots, curated from uploads and Automation.
const originalScreenshots = [
  ['Screenshot 2026-08-06 015716.png', 'CRM workflow configuration', 'CRM automation', 'Workflow actions and configuration inside the CRM.'],
  ['Screenshot 2026-08-06 022606.png', 'Blog creation workflow', 'Make automation', 'A branching scenario that connects content generation and publishing tools.'],
  ['Screenshot 2026-08-06 022651.png', 'Blog analytics workflow', 'Make automation', 'Publishing tools and spreadsheets connected in an analytics scenario.'],
  ['Screenshot 2026-08-06 022827.png', 'Content summary workflow', 'AI & integrations', 'Spreadsheets, AI processing, and Slack connected in one workflow.'],
  ['Screenshot 2026-08-06 023050.png', 'Blog publishing integration', 'API integrations', 'API requests and spreadsheet updates arranged in a publishing workflow.'],
  ['Screenshot 2026-08-06 030620.png', 'Wellness website', 'Website design', 'A calm, editorial landing page for a wellness practice.'],
  ['Screenshot 2026-08-06 030644.png', 'Wellness practice introduction', 'Website design', 'An about page that introduces the practice and its approach.'],
  ['Screenshot 2026-08-06 030907.png', 'Landscaping website', 'Website design', 'A service business landing page with a clear path to requesting an estimate.'],
  ['Screenshot 2026-08-06 031103.png', 'Sports merchandise storefront', 'E-commerce', 'A product catalog for sports apparel and merchandise.'],
  ['Screenshot 2026-08-06 031232.png', 'Sports event registration', 'Website design', 'An event page presenting registration details and a sign-up action.'],
  ['Screenshot 2026-08-06 031447.png', 'CRM integration setup', 'API integrations', 'Private integration settings in the CRM.'],
  ['Screenshot 2026-08-06 221350.png', 'Approval routing workflow', 'Make automation', 'Webhook and email steps arranged for an approval flow.'],
  ['Screenshot 2026-09-22 221231.png', 'Eyewear shopping assistant', 'AI & websites', 'An eyewear website with conversational shopping assistance.'],
  ['Screenshot 2026-10-02 000110.png', 'Lead intake automation', 'n8n automation', 'A webhook flow connecting validation, email, and CRM records.'],
  ['Screenshot 2026-10-02 000126.png', 'Lead validation workflow', 'n8n automation', 'Lead normalization, deduplication, and follow-up steps.'],
].map(([filename, title, category, description]) => ({
  filename, title, category, description, src: `/uploads/${encodeURIComponent(filename)}`,
}));

export const projectScreenshots = [...originalScreenshots, ...automationScreenshots];
