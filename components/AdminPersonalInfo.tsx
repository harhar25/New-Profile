'use client';

import { useState, useEffect } from 'react';
import { ProfileData, defaultProfileData } from '@/lib/profileData';
import { profileStorage } from '@/lib/storage';
import { RotateCcw, Save } from 'lucide-react';

export default function AdminPersonalInfo() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfileData);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(profileStorage.getProfile());
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value,
      },
    }));
  };

  const handleSave = () => {
    profileStorage.saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setProfile(profileStorage.getProfile());
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">Personal Information</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={profile.personalInfo.fullName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Professional Title
          </label>
          <input
            type="text"
            name="title"
            value={profile.personalInfo.title}
            onChange={handleInputChange}
            placeholder="e.g., BS Computer Science | GHL Expert"
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={profile.personalInfo.bio}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={profile.personalInfo.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={profile.personalInfo.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={profile.personalInfo.location}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Avatar URL
          </label>
          <input
            type="text"
            name="avatar"
            value={profile.personalInfo.avatar || ''}
            onChange={handleInputChange}
            placeholder="/uploads/avatar.jpg"
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg transition font-semibold"
        >
          <Save size={20} />
          Save Changes
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-2.5 rounded-lg transition font-semibold"
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>

      {saved && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg">
          ✓ Changes saved successfully!
        </div>
      )}
    </div>
  );
}
