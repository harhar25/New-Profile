'use client';

import { useState, useEffect } from 'react';
import { ProfileData, defaultProfileData } from '@/lib/profileData';
import { profileStorage } from '@/lib/storage';
import ProfileHeader from '@/components/ProfileHeader';
import SkillsSection from '@/components/SkillsSection';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsSection from '@/components/ProjectsSection';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfileData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setProfile(profileStorage.getProfile());
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Admin Link */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          href="/admin"
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
          title="Admin Dashboard"
        >
          <LogIn size={20} />
          <span className="hidden sm:inline">Admin</span>
        </Link>
      </div>

      {/* Profile Sections */}
      <ProfileHeader profile={profile} />
      <SkillsSection skills={profile.skills} />
      <ExperienceSection experiences={profile.experiences} />
      <ProjectsSection projects={profile.projects} />

      {/* Certifications Section */}
      {profile.certifications && profile.certifications.length > 0 && (
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">
              Certifications
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {profile.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        ✓
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {cert.name}
                      </h3>
                      <p className="text-blue-600">{cert.issuer}</p>
                      <p className="text-sm text-gray-600 mt-1">{cert.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 {profile.personalInfo.fullName}. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Built with Next.js & Tailwind CSS
          </p>
        </div>
      </footer>
    </main>
  );
}
