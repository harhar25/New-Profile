'use client';

import { useState } from 'react';
import { ProfileData } from '@/lib/profileData';
import Mail from 'lucide-react/dist/esm/icons/mail.mjs';
import Phone from 'lucide-react/dist/esm/icons/phone.mjs';
import MapPin from 'lucide-react/dist/esm/icons/map-pin.mjs';

interface ProfileHeaderProps {
  profile: ProfileData;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { personalInfo, socialLinks } = profile;
  const [avatarError, setAvatarError] = useState(false);
  const avatarUrl = personalInfo.avatar?.trim();
  const initials = personalInfo.fullName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-slate-900/0 to-slate-900/0 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Avatar Section */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl blur-xl opacity-50" />
                <div className="relative w-48 h-48 bg-slate-800 rounded-2xl border border-red-500/30 flex items-center justify-center overflow-hidden">
                  {avatarUrl && !avatarError ? (
                    <img
                      src={avatarUrl}
                      alt={personalInfo.fullName}
                      className="w-48 h-48 rounded-2xl object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center text-6xl font-bold">
                      {initials || 'ME'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 pt-4">
              <div className="inline-block px-3 py-1 mb-4 bg-red-500/10 border border-red-500/30 rounded-full text-xs font-semibold text-red-400 uppercase tracking-wider">
                Welcome
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-3 text-white">
                {personalInfo.fullName}
              </h1>
              <p className="text-xl text-red-400 font-semibold mb-4">{personalInfo.title}</p>
              <p className="text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">{personalInfo.bio}</p>

              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-red-500/50 transition">
                  <Mail size={20} className="text-red-400" />
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <a href={`mailto:${personalInfo.email}`} className="text-sm text-white hover:text-red-400 transition font-medium">
                      {personalInfo.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-red-500/50 transition">
                  <Phone size={20} className="text-red-400" />
                  <div>
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="text-sm text-white font-medium">{personalInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-red-500/50 transition">
                  <MapPin size={20} className="text-red-400" />
                  <div>
                    <p className="text-xs text-slate-400">Location</p>
                    <p className="text-sm text-white font-medium">{personalInfo.location}</p>
                  </div>
                </div>
              </div>

              {/* Social Links & CTA */}
              <div className="flex flex-wrap gap-3">
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:border-red-500 hover:bg-red-500/10 transition font-medium text-sm"
                  >
                    LinkedIn
                  </a>
                )}
                {socialLinks.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:border-red-500 hover:bg-red-500/10 transition font-medium text-sm"
                  >
                    GitHub
                  </a>
                )}
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:border-red-500 hover:bg-red-500/10 transition font-medium text-sm"
                  >
                    Twitter
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

