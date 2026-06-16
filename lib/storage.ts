import { ProfileData, defaultProfileData } from './profileData';

const PROFILE_KEY = 'userProfileData';

export const profileStorage = {
  getProfile: (): ProfileData => {
    if (typeof window === 'undefined') {
      return defaultProfileData;
    }
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      return stored ? JSON.parse(stored) : defaultProfileData;
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
