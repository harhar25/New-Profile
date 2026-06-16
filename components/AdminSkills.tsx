'use client';

import { useState, useEffect } from 'react';
import { ProfileData, Skill, defaultProfileData } from '@/lib/profileData';
import { profileStorage } from '@/lib/storage';
import { Trash2, Plus, Save } from 'lucide-react';

export default function AdminSkills() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfileData);
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(profileStorage.getProfile());
  }, []);

  const handleAddSkill = () => {
    if (newSkill.name && newSkill.category && newSkill.proficiency) {
      const skill: Skill = {
        id: Date.now().toString(),
        name: newSkill.name,
        category: newSkill.category,
        proficiency: newSkill.proficiency as Skill['proficiency'],
      };

      const updated = {
        ...profile,
        skills: [...profile.skills, skill],
      };
      setProfile(updated);
      profileStorage.saveProfile(updated);
      setNewSkill({});
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleDeleteSkill = (id: string) => {
    const updated = {
      ...profile,
      skills: profile.skills.filter((s) => s.id !== id),
    };
    setProfile(updated);
    profileStorage.saveProfile(updated);
  };

  const categories = [...new Set(profile.skills.map((s) => s.category))];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Skills Management</h2>

      {/* Add New Skill */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Add New Skill</h3>
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Skill name"
            value={newSkill.name || ''}
            onChange={(e) =>
              setNewSkill({ ...newSkill, name: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Category (e.g., AI Tools)"
            value={newSkill.category || ''}
            onChange={(e) =>
              setNewSkill({ ...newSkill, category: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newSkill.proficiency || ''}
            onChange={(e) =>
              setNewSkill({
                ...newSkill,
                proficiency: e.target.value as Skill['proficiency'],
              })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Proficiency</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
          <button
            onClick={handleAddSkill}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <Plus size={20} />
            Add
          </button>
        </div>
      </div>

      {/* Skills by Category */}
      {categories.map((category) => (
        <div key={category} className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            {category}
          </h3>
          <div className="space-y-2">
            {profile.skills
              .filter((s) => s.category === category)
              .map((skill) => (
                <div
                  key={skill.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{skill.name}</p>
                    <p className="text-sm text-gray-600">{skill.proficiency}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
          </div>
        </div>
      ))}

      {profile.skills.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No skills added yet. Add your first skill above!
        </div>
      )}

      {saved && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
          ✓ Skill added successfully!
        </div>
      )}
    </div>
  );
}
