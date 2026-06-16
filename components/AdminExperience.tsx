'use client';

import { useState, useEffect } from 'react';
import { ProfileData, Experience, defaultProfileData } from '@/lib/profileData';
import { profileStorage } from '@/lib/storage';
import { Trash2, Plus, Edit2 } from 'lucide-react';

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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Experience Management
      </h2>

      {/* Add/Edit Experience */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Company"
              value={newExp.company || ''}
              onChange={(e) =>
                setNewExp({ ...newExp, company: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <textarea
            placeholder="Description"
            value={newExp.description || ''}
            onChange={(e) =>
              setNewExp({ ...newExp, description: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid md:grid-cols-3 gap-4 items-end">
            <input
              type="text"
              placeholder="Start Date (e.g., 2022)"
              value={newExp.startDate || ''}
              onChange={(e) =>
                setNewExp({ ...newExp, startDate: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="End Date"
              value={newExp.endDate || ''}
              onChange={(e) =>
                setNewExp({ ...newExp, endDate: e.target.value })
              }
              disabled={newExp.current}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newExp.current || false}
                onChange={(e) =>
                  setNewExp({ ...newExp, current: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span className="text-gray-700">Currently working</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddExperience}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <Plus size={20} />
              {editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button
                onClick={handleCancelEdit}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
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
          <div key={exp.id} className="p-4 border border-gray-300 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-gray-900">{exp.title}</p>
                <p className="text-blue-600">{exp.company}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditExperience(exp)}
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDeleteExperience(exp.id)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
            </p>
            <p className="text-gray-700">{exp.description}</p>
          </div>
        ))}
      </div>

      {profile.experiences.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No experiences added yet. Add your first experience above!
        </div>
      )}

      {saved && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
          ✓ Experience saved successfully!
        </div>
      )}
    </div>
  );
}
