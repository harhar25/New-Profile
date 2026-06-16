'use client';

import { ProfileData } from '@/lib/profileData';
import { Mail, Phone, MapPin, Code2 } from 'lucide-react';

interface ProfileHeaderProps {
  profile: ProfileData;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { personalInfo, socialLinks } = profile;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row gap-8 items-start">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
              <img
                src={personalInfo.avatar || '/uploads/avatar.jpg'}
                alt={personalInfo.fullName}
                className="w-32 h-32 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/128?text=' +
                    personalInfo.fullName.split(' ')[0];
                }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{personalInfo.fullName}</h1>
            <p className="text-xl text-blue-100 mb-4">{personalInfo.title}</p>
            <p className="text-blue-50 mb-4 max-w-2xl">{personalInfo.bio}</p>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-6 mb-4">
              <div className="flex items-center gap-2">
                <Mail size={20} />
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="hover:underline"
                >
                  {personalInfo.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={20} />
                <span>{personalInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                <span>{personalInfo.location}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-white/20 px-3 py-2 rounded transition font-semibold"
                  title="LinkedIn"
                >
                  LinkedIn
                </a>
              )}
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-white/20 px-3 py-2 rounded transition font-semibold"
                  title="GitHub"
                >
                  GitHub
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-white/20 px-3 py-2 rounded transition font-semibold"
                  title="Twitter"
                >
                  Twitter
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
