'use client';

import { useState, useEffect } from 'react';
import { ProfileData, Skill, defaultProfileData } from '@/lib/profileData';
import { profileStorage } from '@/lib/storage';
import { Plus, Save, Trash2 } from 'lucide-react';

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
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">Skills Management</h2>

      {/* Add New Skill */}
      <div className="mb-8 p-6 bg-slate-900/50 border border-red-500/30 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-white">Add New Skill</h3>
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Skill name"
            value={newSkill.name || ''}
            onChange={(e) =>
              setNewSkill({ ...newSkill, name: e.target.value })
            }
            className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
          />
          <input
            type="text"
            placeholder="Category (e.g., AI Tools)"
            value={newSkill.category || ''}
            onChange={(e) =>
              setNewSkill({ ...newSkill, category: e.target.value })
            }
            className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
          />
          <select
            value={newSkill.proficiency || ''}
            onChange={(e) =>
              setNewSkill({
                ...newSkill,
                proficiency: e.target.value as Skill['proficiency'],
              })
            }
            className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
          >
            <option value="">Select Proficiency</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
          <button
            onClick={handleAddSkill}
            className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition font-semibold"
          >
            <Plus size={20} />
            Add
          </button>
        </div>
      </div>

      {/* Skills by Category */}
      {categories.map((category) => (
        <div key={category} className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-white">
            {category}
          </h3>
          <div className="space-y-2">
            {profile.skills
              .filter((s) => s.category === category)
              .map((skill) => (
                <div
                  key={skill.id}
                  className="flex justify-between items-center p-4 bg-slate-900/50 border border-slate-700 rounded-lg hover:border-red-500/30 transition"
                >
                  <div>
                    <p className="font-semibold text-white">{skill.name}</p>
                    <p className="text-sm text-slate-400">{skill.proficiency}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
          </div>
        </div>
      ))}

      {profile.skills.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          No skills added yet. Add your first skill above!
        </div>
      )}

      {saved && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg">
          ✓ Skill added successfully!
        </div>
      )}
    </div>
  );
}
