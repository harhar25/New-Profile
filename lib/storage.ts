import { ProfileData, defaultProfileData } from './profileData';

const PROFILE_KEY = 'userProfileData';
const PREVIOUS_DEFAULT_AVATARS = [
  '/uploads/avatar.jpg',
  '/uploads/MADJOS%2C%20HAROLD%20JEY%20N%20BSCS%20%2813%29%202%20rr%202.jpg',
];
const CURRENT_DEFAULT_AVATAR = '/uploads/MADJOS%2C%20HAROLD%20JEY%20N%20BSCS%20%286%29%202%20rr%202.jpg';
const PREVIOUS_DEFAULT_BIO = 'Graduate of BS in Computer Science at ACLC College of Butuan. I build CRM automations, AI-powered workflows, dashboards, and SEO systems that connect people, data, and business growth with reliable execution.';
const CURRENT_DEFAULT_BIO = 'I specialize in building GoHighLevel (GHL) automations, AI-powered workflows, analytics dashboards, and SEO systems that streamline operations, connect data, and drive business growth. Backed by a Bachelor of Science in Computer Science from ACLC College of Butuan, I combine software engineering, system design, databases, and AI to deliver scalable, reliable solutions.';

export const profileStorage = {
  getProfile: (): ProfileData => {
    if (typeof window === 'undefined') {
      return defaultProfileData;
    }
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      if (!stored) return defaultProfileData;

      const profile = JSON.parse(stored) as ProfileData;
      const shouldUpdateAvatar = PREVIOUS_DEFAULT_AVATARS.includes(profile.personalInfo.avatar ?? '');
      const shouldUpdateBio = profile.personalInfo.bio === PREVIOUS_DEFAULT_BIO;
      if (shouldUpdateAvatar || shouldUpdateBio) {
        const updatedProfile = {
          ...profile,
          personalInfo: {
            ...profile.personalInfo,
            avatar: shouldUpdateAvatar ? CURRENT_DEFAULT_AVATAR : profile.personalInfo.avatar,
            bio: shouldUpdateBio ? CURRENT_DEFAULT_BIO : profile.personalInfo.bio,
          },
        };
        profileStorage.saveProfile(updatedProfile);
        return updatedProfile;
      }

      return profile;
    } catch {
      return defaultProfileData;
    }
  },

  saveProfile: (data: ProfileData): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  },

  updateProfile: (updates: Partial<ProfileData>): ProfileData => {
    const current = profileStorage.getProfile();
    const updated = { ...current, ...updates };
    profileStorage.saveProfile(updated);
    return updated;
  },

  resetProfile: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(PROFILE_KEY);
  },
};
