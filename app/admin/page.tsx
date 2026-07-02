'use client';

import { useState } from 'react';
import Link from 'next/link';
import User from 'lucide-react/dist/esm/icons/user.mjs';
import Briefcase from 'lucide-react/dist/esm/icons/briefcase.mjs';
import Code from 'lucide-react/dist/esm/icons/code.mjs';
import FileText from 'lucide-react/dist/esm/icons/file-text.mjs';
import Home from 'lucide-react/dist/esm/icons/home.mjs';
import Menu from 'lucide-react/dist/esm/icons/menu.mjs';
import X from 'lucide-react/dist/esm/icons/x.mjs';
import AdminPersonalInfo from '@/components/AdminPersonalInfo';
import AdminSkills from '@/components/AdminSkills';
import AdminExperience from '@/components/AdminExperience';
import AdminProjects from '@/components/AdminProjects';

type Tab = 'personal' | 'skills' | 'experience' | 'projects';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('personal');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-950 border-r border-slate-800 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h1 className="font-bold text-lg text-white">Admin</h1>
              <p className="text-xs text-slate-400">Dashboard</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition mb-2 ${
                  activeTab === item.id
                    ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title={item.label}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition w-full"
            title="Back to Profile"
          >
            <Home size={20} />
            {sidebarOpen && <span className="font-medium">View Profile</span>}
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white">
              {navItems.find((item) => item.id === activeTab)?.label}
            </h1>
            <p className="text-slate-400 mt-2">Manage your profile information</p>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {activeTab === 'personal' && <AdminPersonalInfo />}
            {activeTab === 'skills' && <AdminSkills />}
            {activeTab === 'experience' && <AdminExperience />}
            {activeTab === 'projects' && <AdminProjects />}
          </div>
        </div>
      </div>
    </div>
  );
}
