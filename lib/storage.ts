import { ProfileData, defaultProfileData } from './profileData';

const PROFILE_KEY = 'userProfileData';
const PREVIOUS_DEFAULT_AVATARS = [
  '/uploads/avatar.jpg',
  '/uploads/MADJOS%2C%20HAROLD%20JEY%20N%20BSCS%20%286%29%202%20rr%202.jpg',
];
const CURRENT_DEFAULT_AVATAR = '/uploads/MADJOS%2C%20HAROLD%20JEY%20N%20BSCS%20%2813%29%202%20rr%202.jpg';

export const profileStorage = {
  getProfile: (): ProfileData => {
    if (typeof window === 'undefined') {
      return defaultProfileData;
    }
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      if (!stored) return defaultProfileData;

      const profile = JSON.parse(stored) as ProfileData;
      if (PREVIOUS_DEFAULT_AVATARS.includes(profile.personalInfo.avatar ?? '')) {
        const updatedProfile = {
          ...profile,
          personalInfo: { ...profile.personalInfo, avatar: CURRENT_DEFAULT_AVATAR },
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
