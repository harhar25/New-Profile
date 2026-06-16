'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Briefcase,
  Code,
  FileText,
  Home,
  Menu,
  X,
} from 'lucide-react';
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
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {sidebarOpen && <h1 className="font-bold text-lg">Admin Panel</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded"
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
                    ? 'bg-blue-600'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
                title={item.label}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <Link
            href="/"
            className="flex items-center gap-4 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition w-full"
            title="Back to Profile"
          >
            <Home size={20} />
            {sidebarOpen && <span>View Profile</span>}
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              {navItems.find((item) => item.id === activeTab)?.label}
            </h1>
            <p className="text-gray-600 mt-2">Manage your profile information</p>
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
