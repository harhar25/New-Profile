'use client';

import { useState, useEffect } from 'react';
import { ProfileData, defaultProfileData } from '@/lib/profileData';
import { profileStorage } from '@/lib/storage';
import ProfileHeader from '@/components/ProfileHeader';
import SkillsSection from '@/components/SkillsSection';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsSection from '@/components/ProjectsSection';
import LogIn from 'lucide-react/dist/esm/icons/log-in.mjs';
import Moon from 'lucide-react/dist/esm/icons/moon.mjs';
import Sun from 'lucide-react/dist/esm/icons/sun.mjs';
import Link from 'next/link';

export default function Home() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfileData);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    setProfile(profileStorage.getProfile());
    const savedTheme = window.localStorage.getItem('profile-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    window.localStorage.setItem('profile-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const pressed = event.key.toLowerCase();
      if (event.shiftKey && pressed === 'h') {
        setShowAdmin((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-950 transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <button
        type="button"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg backdrop-blur transition hover:scale-105 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
        aria-label="Toggle color theme"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        {theme === 'dark' ? 'Light mode' : 'Dark mode'}
      </button>

      {showAdmin && (
        <div className="fixed bottom-6 right-6 z-50">
          <Link
            href="/admin"
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105 font-semibold"
            title="Admin Dashboard"
          >
            <LogIn size={20} />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      )}

      {/* Profile Sections */}
      <ProfileHeader profile={profile} />
      <SkillsSection skills={profile.skills} />
      <ExperienceSection experiences={profile.experiences} />
      <ProjectsSection projects={profile.projects} />

      {/* Certifications Section */}
      {profile.certifications && profile.certifications.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <p className="text-red-400 text-sm font-semibold uppercase tracking-widest mb-2">CREDENTIALS</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Certifications & Education</h2>
              <p className="text-slate-300 text-lg max-w-2xl">
                Professional certifications and educational achievements that validate my expertise.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {profile.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="group p-6 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-red-500/50 hover:bg-slate-800/80 transition-all duration-300 flex items-start gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white text-lg font-bold group-hover:scale-110 transition-transform">
                      ✓
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition">
                      {cert.name}
                    </h3>
                    <p className="text-red-400 font-semibold text-sm mt-1">{cert.issuer}</p>
                    <p className="text-slate-400 text-sm mt-2">{cert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div>
              <p className="text-slate-300 font-semibold text-lg">
                © 2024 {profile.personalInfo.fullName}. All rights reserved.
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Built with Next.js & Tailwind CSS
              </p>
            </div>
            <div className="flex gap-4 mt-6 md:mt-0">
              {profile.socialLinks.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:border-red-500 hover:text-red-400 transition"
                  title="LinkedIn"
                >
                  in
                </a>
              )}
              {profile.socialLinks.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:border-red-500 hover:text-red-400 transition"
                  title="GitHub"
                >
                  gh
                </a>
              )}
              {profile.socialLinks.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:border-red-500 hover:text-red-400 transition"
                  title="Twitter"
                >
                  𝕏
                </a>
              )}
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-slate-700 via-red-500/30 to-slate-700" />
        </div>
      </footer>
    </main>
  );
}
