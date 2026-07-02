'use client';

import { useState, useEffect } from 'react';
import { ProfileData, Experience, defaultProfileData } from '@/lib/profileData';
import { profileStorage } from '@/lib/storage';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2.mjs';
import Plus from 'lucide-react/dist/esm/icons/plus.mjs';
import Edit2 from 'lucide-react/dist/esm/icons/edit-2.mjs';

export default function AdminExperience() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfileData);
  const [newExp, setNewExp] = useState<Partial<Experience>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(profileStorage.getProfile());
  }, []);

  const handleAddExperience = () => {
    if (newExp.title && newExp.company && newExp.description) {
      if (editingId) {
        // Update existing
        const updated = {
          ...profile,
          experiences: profile.experiences.map((e) =>
            e.id === editingId
              ? { ...e, ...newExp }
              : e
          ),
        };
        setProfile(updated);
        profileStorage.saveProfile(updated);
        setEditingId(null);
      } else {
        // Add new
        const experience: Experience = {
          id: Date.now().toString(),
          title: newExp.title,
          company: newExp.company,
          description: newExp.description,
          startDate: newExp.startDate || '',
          endDate: newExp.endDate || '',
          current: newExp.current || false,
        };

        const updated = {
          ...profile,
          experiences: [...profile.experiences, experience],
        };
        setProfile(updated);
        profileStorage.saveProfile(updated);
      }

      setNewExp({});
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleEditExperience = (exp: Experience) => {
    setNewExp(exp);
    setEditingId(exp.id);
  };

  const handleDeleteExperience = (id: string) => {
    const updated = {
      ...profile,
      experiences: profile.experiences.filter((e) => e.id !== id),
    };
    setProfile(updated);
    profileStorage.saveProfile(updated);
  };

  const handleCancelEdit = () => {
    setNewExp({});
    setEditingId(null);
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Experience Management
      </h2>

      {/* Add/Edit Experience */}
      <div className="mb-8 p-6 bg-slate-900/50 border border-red-500/30 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-white">
          {editingId ? 'Edit Experience' : 'Add New Experience'}
        </h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Job Title"
              value={newExp.title || ''}
              onChange={(e) =>
                setNewExp({ ...newExp, title: e.target.value })
              }
              className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
            />
            <input
              type="text"
              placeholder="Company"
              value={newExp.company || ''}
              onChange={(e) =>
                setNewExp({ ...newExp, company: e.target.value })
              }
              className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
            />
          </div>

          <textarea
            placeholder="Description"
            value={newExp.description || ''}
            onChange={(e) =>
              setNewExp({ ...newExp, description: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
          />

          <div className="grid md:grid-cols-3 gap-4 items-end">
            <input
              type="text"
              placeholder="Start Date (e.g., 2022)"
              value={newExp.startDate || ''}
              onChange={(e) =>
                setNewExp({ ...newExp, startDate: e.target.value })
              }
              className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
            />
            <input
              type="text"
              placeholder="End Date"
              value={newExp.endDate || ''}
              onChange={(e) =>
                setNewExp({ ...newExp, endDate: e.target.value })
              }
              disabled={newExp.current}
              className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition disabled:opacity-50"
            />
            <label className="flex items-center gap-2 text-slate-300">
              <input
                type="checkbox"
                checked={newExp.current || false}
                onChange={(e) =>
                  setNewExp({ ...newExp, current: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span>Currently working</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddExperience}
              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition font-semibold"
            >
              <Plus size={20} />
              {editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button
                onClick={handleCancelEdit}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Experiences List */}
      <div className="space-y-4">
        {profile.experiences.map((exp) => (
          <div key={exp.id} className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg hover:border-red-500/30 transition">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-white">{exp.title}</p>
                <p className="text-red-400">{exp.company}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditExperience(exp)}
                  className="text-slate-400 hover:text-red-400 transition"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDeleteExperience(exp.id)}
                  className="text-slate-400 hover:text-red-400 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-2">
              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
            </p>
            <p className="text-slate-300">{exp.description}</p>
          </div>
        ))}
      </div>

      {profile.experiences.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          No experiences added yet. Add your first experience above!
        </div>
      )}

      {saved && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg">
          ✓ Experience saved successfully!
        </div>
      )}
    </div>
  );
}
