export interface Skill {
  id: string;
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  description: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  image?: string;
  featured: boolean;
}

export interface ProfileData {
  personalInfo: {
    fullName: string;
    title: string;
    bio: string;
    email: string;
    phone: string;
    location: string;
    avatar?: string;
  };
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
  certifications: {
    name: string;
    issuer: string;
    date: string;
  }[];
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
}

export const defaultProfileData: ProfileData = {
  personalInfo: {
    fullName: 'Harold Jey N. Madjos',
    title: 'BS in Computer Science | GHL Automation & AI Systems Specialist',
    bio: 'Graduate of BS in Computer Science at ACLC College of Butuan. I build CRM automations, AI-powered workflows, dashboards, and SEO systems that connect people, data, and business growth with reliable execution.',
    email: 'haroldjeymadjos@gmail.com',
    phone: '09518422898',
    location: 'Butuan City, Philippines',
    avatar: '/uploads/MADJOS%2C%20HAROLD%20JEY%20N%20BSCS%20%2813%29%202%20rr%202.jpg',
  },
  skills: [
    { id: '1', name: 'GoHighLevel CRM Setup', proficiency: 'Expert', category: 'GHL Automation' },
    { id: '2', name: 'GoHighLevel Workflow Automation', proficiency: 'Expert', category: 'GHL Automation' },
    { id: '3', name: 'GoHighLevel Pipeline Setup', proficiency: 'Expert', category: 'GHL Automation' },
    { id: '4', name: 'GoHighLevel Custom Fields Setup', proficiency: 'Expert', category: 'GHL Automation' },
    { id: '5', name: 'GoHighLevel Tags and Triggers Setup', proficiency: 'Expert', category: 'GHL Automation' },
    { id: '6', name: 'GoHighLevel Calendars Setup', proficiency: 'Advanced', category: 'GHL Automation' },
    { id: '7', name: 'GoHighLevel Forms and Surveys Setup', proficiency: 'Advanced', category: 'GHL Automation' },
    { id: '8', name: 'GoHighLevel Email and SMS Automation', proficiency: 'Expert', category: 'GHL Automation' },
    { id: '9', name: 'Lead Routing and Assignment Automation', proficiency: 'Expert', category: 'Automation' },
    { id: '10', name: 'Round-Robin Lead Assignment', proficiency: 'Advanced', category: 'Automation' },
    { id: '11', name: 'Lead Scoring Workflows', proficiency: 'Advanced', category: 'Automation' },
    { id: '12', name: 'Conditional Logic Workflows', proficiency: 'Advanced', category: 'Automation' },
    { id: '13', name: 'SLA / Follow-Up Monitoring', proficiency: 'Advanced', category: 'Automation' },
    { id: '14', name: 'Internal Notification Setup', proficiency: 'Advanced', category: 'Automation' },
    { id: '15', name: 'A2P / Compliance Setup Support', proficiency: 'Intermediate', category: 'Automation' },
    { id: '16', name: 'Funnel and Landing Page Setup', proficiency: 'Advanced', category: 'Web Setup' },
    { id: '17', name: 'Website Page Building inside GHL', proficiency: 'Advanced', category: 'Web Setup' },
    { id: '18', name: 'WordPress Website Support', proficiency: 'Advanced', category: 'Web Setup' },
    { id: '19', name: 'SEO City Page Creation', proficiency: 'Advanced', category: 'SEO' },
    { id: '20', name: 'Blog Draft Automation', proficiency: 'Advanced', category: 'SEO' },
    { id: '21', name: 'Local SEO Automation', proficiency: 'Advanced', category: 'SEO' },
    { id: '22', name: 'Google Business Profile Automation', proficiency: 'Advanced', category: 'SEO' },
    { id: '23', name: 'GBP Photo Upload Automation', proficiency: 'Advanced', category: 'SEO' },
    { id: '24', name: 'GBP Post Automation', proficiency: 'Advanced', category: 'SEO' },
    { id: '25', name: 'Google Review Tracking', proficiency: 'Advanced', category: 'SEO' },
    { id: '26', name: 'Review Reply Automation', proficiency: 'Advanced', category: 'SEO' },
    { id: '27', name: 'Competitor Research Reporting', proficiency: 'Advanced', category: 'SEO' },
    { id: '28', name: 'Ranking Tracking Automation', proficiency: 'Advanced', category: 'SEO' },
    { id: '29', name: 'Weekly SEO Reporting', proficiency: 'Advanced', category: 'SEO' },
    { id: '30', name: 'Google Sheets Automation', proficiency: 'Advanced', category: 'Integrations' },
    { id: '31', name: 'Google Drive Automation', proficiency: 'Advanced', category: 'Integrations' },
    { id: '32', name: 'Google Docs Automation', proficiency: 'Advanced', category: 'Integrations' },
    { id: '33', name: 'Make.com Scenario Building', proficiency: 'Expert', category: 'Integrations' },
    { id: '34', name: 'Make.com HTTP/API Setup', proficiency: 'Expert', category: 'Integrations' },
    { id: '35', name: 'Webhook Setup', proficiency: 'Expert', category: 'Integrations' },
    { id: '36', name: 'JSON Mapping', proficiency: 'Advanced', category: 'Integrations' },
    { id: '37', name: 'Data Structure Mapping', proficiency: 'Advanced', category: 'Integrations' },
    { id: '38', name: 'API Endpoint Testing', proficiency: 'Advanced', category: 'Integrations' },
    { id: '39', name: 'Lovable.dev Dashboard Building', proficiency: 'Advanced', category: 'AI & Apps' },
    { id: '40', name: 'Supabase Data Syncing Support', proficiency: 'Advanced', category: 'AI & Apps' },
    { id: '41', name: 'Dashboard QA Testing', proficiency: 'Advanced', category: 'QA & Ops' },
    { id: '42', name: 'Sync Health Monitoring', proficiency: 'Advanced', category: 'QA & Ops' },
    { id: '43', name: 'Real-Time Data Display Setup', proficiency: 'Advanced', category: 'AI & Apps' },
    { id: '44', name: 'Data Accuracy Checking', proficiency: 'Advanced', category: 'QA & Ops' },
    { id: '45', name: 'Security Issue Checking', proficiency: 'Advanced', category: 'QA & Ops' },
    { id: '46', name: 'Organization and Branch Access Control Testing', proficiency: 'Advanced', category: 'QA & Ops' },
    { id: '47', name: 'AI Manager Setup', proficiency: 'Advanced', category: 'AI & Apps' },
    { id: '48', name: 'Claude AI Integration Support', proficiency: 'Advanced', category: 'AI & Apps' },
    { id: '49', name: 'AI Prompt Engineering', proficiency: 'Advanced', category: 'AI & Apps' },
    { id: '50', name: 'AI Briefing Setup', proficiency: 'Advanced', category: 'AI & Apps' },
    { id: '51', name: 'AI Approval Queue Planning', proficiency: 'Advanced', category: 'AI & Apps' },
    { id: '52', name: 'AI Logs Planning', proficiency: 'Advanced', category: 'AI & Apps' },
    { id: '53', name: 'OpenAI Integration Status Management', proficiency: 'Advanced', category: 'AI & Apps' },
    { id: '54', name: 'Report Dashboard Creation', proficiency: 'Advanced', category: 'Reporting' },
    { id: '55', name: 'Growth Reports Hub Setup', proficiency: 'Advanced', category: 'Reporting' },
    { id: '56', name: 'Maps Automation Dashboard Setup', proficiency: 'Advanced', category: 'Reporting' },
    { id: '57', name: 'CEO Dashboard Review', proficiency: 'Advanced', category: 'Reporting' },
    { id: '58', name: 'System Review and QA Checklist Creation', proficiency: 'Advanced', category: 'QA & Ops' },
    { id: '59', name: 'Troubleshooting Make.com Errors', proficiency: 'Advanced', category: 'Support' },
    { id: '60', name: 'Troubleshooting Lovable Page Issues', proficiency: 'Advanced', category: 'Support' },
    { id: '61', name: 'Troubleshooting Login/Cache Issues', proficiency: 'Advanced', category: 'Support' },
    { id: '62', name: 'Client Update Writing', proficiency: 'Advanced', category: 'Operations' },
    { id: '63', name: 'EOD Report Writing', proficiency: 'Advanced', category: 'Operations' },
    { id: '64', name: 'SOP and Checklist Creation', proficiency: 'Advanced', category: 'Operations' },
    { id: '65', name: 'Software Development', proficiency: 'Advanced', category: 'Core Strengths' },
    { id: '66', name: 'Backend Development', proficiency: 'Advanced', category: 'Core Strengths' },
    { id: '67', name: 'Problem Solving', proficiency: 'Expert', category: 'Core Strengths' },
    { id: '68', name: 'AI & Automation', proficiency: 'Expert', category: 'Core Strengths' },
    { id: '69', name: 'System Design Thinking', proficiency: 'Advanced', category: 'Core Strengths' },
    { id: '70', name: 'Learning Mindset', proficiency: 'Expert', category: 'Core Strengths' },
  ],
  experiences: [
    {
      id: '1',
      title: 'Automation & AI Systems Specialist',
      company: 'Freelance / Client Projects',
      description: 'Designs and implements GoHighLevel automations, workflow systems, integrations, dashboards, SEO automations, and AI-assisted operations for agencies and growing businesses.',
      startDate: '2023',
      endDate: 'Present',
      current: true,
    },
    {
      id: '2',
      title: 'BS in Computer Science',
      company: 'ACLC College of Butuan',
      description: 'Built a strong foundation in software development, systems thinking, problem solving, and continuous learning relevant to modern automation and web development work.',
      startDate: '2019',
      endDate: '2023',
      current: false,
    },
  ],
  projects: [
    {
      id: '1',
      title: 'GoHighLevel Automation Suite',
      description: 'Built end-to-end CRM pipelines, lead routing, follow-up systems, calendars, forms, and internal automation for streamlined client operations.',
      technologies: ['GoHighLevel', 'Make.com', 'Webhooks', 'Automation'],
      featured: true,
    },
    {
      id: '2',
      title: 'Local SEO & GBP Growth System',
      description: 'Implemented automated city pages, Google Business Profile workflows, review tracking, and reporting setups to improve local visibility.',
      technologies: ['SEO', 'GBP', 'Sheets', 'Automation'],
      featured: true,
    },
    {
      id: '3',
      title: 'AI Dashboard & Data Sync Platform',
      description: 'Created dashboards and data synchronization flows using Lovable, Supabase, and QA-focused monitoring for accurate real-time visibility.',
      technologies: ['Lovable', 'Supabase', 'Dashboards', 'API'],
      featured: true,
    },
    {
      id: '4',
      title: 'AI Workflow & Approval Framework',
      description: 'Designed AI briefing, prompt engineering, approval queue, and logging structures to support scalable intelligent operations.',
      technologies: ['Claude', 'OpenAI', 'Prompting', 'Workflow'],
      featured: false,
    },
  ],
  certifications: [
    {
      name: 'BS in Computer Science',
      issuer: 'ACLC College of Butuan',
      date: '2023',
    },
    {
      name: 'GoHighLevel Automation & CRM Systems',
      issuer: 'Hands-on Practice',
      date: '2023 - Present',
    },
  ],
  socialLinks: {
    linkedin: 'https://www.linkedin.com/in/harold-jey-madjos-56a65635b',
    github: 'https://github.com/harhar25',
    twitter: '',
    portfolio: 'https://github.com/harhar25',
  },
};
