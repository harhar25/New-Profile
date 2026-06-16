# Professional Web Profile - GHL Expert & CS Graduate

A modern, fully-functional web profile built with **Next.js 15** and **Tailwind CSS** featuring a public portfolio page and a complete admin dashboard for managing your professional information.

## Features

### 🎨 Public Profile Page
- **Professional Header** - Personal branding with avatar, title, and contact information
- **Skills Section** - Organized skills by category with proficiency levels
- **Experience Timeline** - Chronological work experience display
- **Featured Projects** - Showcase your best work with descriptions and technologies
- **Certifications** - Display your credentials and achievements
- **Social Links** - Connect to LinkedIn, GitHub, Twitter, and portfolio
- **Responsive Design** - Perfect on mobile, tablet, and desktop

### 🔧 Admin Dashboard
- **Personal Information Management** - Update name, title, bio, contact details, and avatar
- **Skills Management** - Add, edit, and delete skills with categories and proficiency levels
- **Experience Management** - Manage work history with dates and descriptions
- **Projects Management** - Add featured and regular projects with technologies and links
- **Real-time Updates** - Changes save instantly to local storage
- **Intuitive UI** - Easy-to-use tabbed interface with icons

## Pre-configured for Your Profile

This profile is pre-populated with example data tailored for a **BS Computer Science graduate & GHL Expert** with experience in:

- ✅ GoHighLevel (GHL) Automation & Setup
- ✅ WordPress Development
- ✅ Multiple Integrations (Zapier, Make, Lovable, Claude CoWork, GHL APIs)
- ✅ AI Tools (Claude, ChatGPT, Deepseek)
- ✅ Video Editing & Graphics Design
- ✅ Webflow & Funnel Building
- ✅ Agency Account Setup

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your profile.

### 3. Access Admin Dashboard
Click the **"Admin"** button on the bottom-right of the profile page, or navigate to `/admin`

## Project Structure

```
├── app/
│   ├── page.tsx              # Public profile page
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard
│   ├── api/
│   │   └── profile/
│   │       └── route.ts      # Profile API endpoints
│   ├── layout.tsx            # Root layout with metadata
│   └── globals.css           # Global styles
├── components/
│   ├── ProfileHeader.tsx     # Hero section with contact info
│   ├── SkillsSection.tsx     # Skills display by category
│   ├── ExperienceSection.tsx # Timeline experience display
│   ├── ProjectsSection.tsx   # Featured & other projects
│   ├── AdminPersonalInfo.tsx # Personal info editor
│   ├── AdminSkills.tsx       # Skills management
│   ├── AdminExperience.tsx   # Experience management
│   └── AdminProjects.tsx     # Projects management
├── lib/
│   ├── profileData.ts        # Type definitions & default data
│   └── storage.ts            # Local storage utilities
├── public/
│   └── uploads/              # Avatar and image uploads
└── package.json
```

## Customization

### Change Profile Data
Edit the initial data in `lib/profileData.ts`:

```typescript
export const defaultProfileData: ProfileData = {
  personalInfo: {
    fullName: 'Your Name',
    title: 'Your Title',
    // ... more fields
  },
  // ... rest of profile
};
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Local Storage** - Client-side data persistence

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Data Persistence

All changes made in the admin dashboard are automatically saved to browser **localStorage**. Data persists between sessions but is browser-specific.

## Deployment

### Deploy to Vercel (Recommended)
```bash
npm run build
# Push to GitHub, then connect to Vercel
```

### Deploy to Other Platforms
```bash
npm run build
# Deploy the .next folder
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)

---

**Built with ❤️ for GHL Experts, Developers, and Digital Entrepreneurs**
