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
    fullName: 'Your Name',
    title: 'BS Computer Science | GHL Expert',
    bio: 'Passionate about automation and digital solutions. Specialized in GoHighLevel setup and integration with multiple platforms.',
    email: 'your.email@example.com',
    phone: '+1 (555) 000-0000',
    location: 'Your Location',
    avatar: '/uploads/avatar.jpg',
  },
  skills: [
    {
      id: '1',
      name: 'GoHighLevel (GHL)',
      proficiency: 'Expert',
      category: 'Automation',
    },
    {
      id: '2',
      name: 'WordPress Development',
      proficiency: 'Advanced',
      category: 'Web Development',
    },
    {
      id: '3',
      name: 'Zapier Integration',
      proficiency: 'Advanced',
      category: 'Integration',
    },
    {
      id: '4',
      name: 'Make (Integromat)',
      proficiency: 'Advanced',
      category: 'Integration',
    },
    {
      id: '5',
      name: 'Webflow',
      proficiency: 'Advanced',
      category: 'Web Design',
    },
    {
      id: '6',
      name: 'Claude AI',
      proficiency: 'Expert',
      category: 'AI Tools',
    },
    {
      id: '7',
      name: 'ChatGPT',
      proficiency: 'Advanced',
      category: 'AI Tools',
    },
    {
      id: '8',
      name: 'Video Editing',
      proficiency: 'Advanced',
      category: 'Design',
    },
    {
      id: '9',
      name: 'Graphics Design',
      proficiency: 'Advanced',
      category: 'Design',
    },
    {
      id: '10',
      name: 'Funnel Building',
      proficiency: 'Expert',
      category: 'Automation',
    },
  ],
  experiences: [
    {
      id: '1',
      title: 'GHL Automation Specialist',
      company: 'Self-Employed',
      description: 'Designing and implementing automation workflows using GoHighLevel, Zapier, Make, and custom integrations.',
      startDate: '2022',
      endDate: 'Present',
      current: true,
    },
    {
      id: '2',
      title: 'Full Stack Developer',
      company: 'Your Previous Company',
      description: 'Developed WordPress and custom web solutions for clients across various industries.',
      startDate: '2020',
      endDate: '2022',
      current: false,
    },
  ],
  projects: [
    {
      id: '1',
      title: 'GHL Agency Automation Suite',
      description: 'Complete automation setup for GoHighLevel agency with native integrations, webhooks, and custom APIs.',
      technologies: ['GoHighLevel', 'Zapier', 'Make', 'Webhooks'],
      featured: true,
    },
    {
      id: '2',
      title: 'Multi-Platform Integration System',
      description: 'Integrated 10+ platforms using Zapier, Make, and custom APIs including Lovable and Claude CoWork.',
      technologies: ['Zapier', 'Make', 'APIs', 'Webhooks'],
      featured: true,
    },
    {
      id: '3',
      title: 'Webflow Funnel Platform',
      description: 'High-converting sales funnels built with Webflow, integrated with email and CRM systems.',
      technologies: ['Webflow', 'Zapier', 'Email Marketing'],
      featured: false,
    },
  ],
  certifications: [
    {
      name: 'GoHighLevel Expert Certification',
      issuer: 'GoHighLevel',
      date: '2023',
    },
    {
      name: 'BS in Computer Science',
      issuer: 'Your University',
      date: '2022',
    },
  ],
  socialLinks: {
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    portfolio: 'https://yourportfolio.com',
  },
};
