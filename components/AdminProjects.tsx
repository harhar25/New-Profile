'use client';

import { useState, useEffect } from 'react';
import { ProfileData, Project, defaultProfileData } from '@/lib/profileData';
import { profileStorage } from '@/lib/storage';
import { Trash2, Plus, Edit2 } from 'lucide-react';

export default function AdminProjects() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfileData);
  const [newProject, setNewProject] = useState<Partial<Project>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(profileStorage.getProfile());
  }, []);

  const handleAddProject = () => {
    if (newProject.title && newProject.description) {
      if (editingId) {
        // Update existing
        const updated = {
          ...profile,
          projects: profile.projects.map((p) =>
            p.id === editingId ? { ...p, ...newProject } : p
          ),
        };
        setProfile(updated);
        profileStorage.saveProfile(updated);
        setEditingId(null);
      } else {
        // Add new
        const project: Project = {
          id: Date.now().toString(),
          title: newProject.title,
          description: newProject.description,
          technologies: (newProject.technologies || []).filter((t) => t),
          link: newProject.link,
          image: newProject.image,
          featured: newProject.featured || false,
        };

        const updated = {
          ...profile,
          projects: [...profile.projects, project],
        };
        setProfile(updated);
        profileStorage.saveProfile(updated);
      }

      setNewProject({});
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleEditProject = (proj: Project) => {
    setNewProject(proj);
    setEditingId(proj.id);
  };

  const handleDeleteProject = (id: string) => {
    const updated = {
      ...profile,
      projects: profile.projects.filter((p) => p.id !== id),
    };
    setProfile(updated);
    profileStorage.saveProfile(updated);
  };

  const handleTechChange = (index: number, value: string) => {
    const techs = [...(newProject.technologies || [])];
    techs[index] = value;
    setNewProject({ ...newProject, technologies: techs });
  };

  const handleAddTech = () => {
    const techs = [...(newProject.technologies || []), ''];
    setNewProject({ ...newProject, technologies: techs });
  };

  const handleCancelEdit = () => {
    setNewProject({});
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Projects Management
      </h2>

      {/* Add/Edit Project */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          {editingId ? 'Edit Project' : 'Add New Project'}
        </h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Project Title"
            value={newProject.title || ''}
            onChange={(e) =>
              setNewProject({ ...newProject, title: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            placeholder="Project Description"
            value={newProject.description || ''}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technologies
            </label>
            <div className="space-y-2">
              {(newProject.technologies || []).map((tech, idx) => (
                <input
                  key={idx}
                  type="text"
                  placeholder={`Technology ${idx + 1}`}
                  value={tech}
                  onChange={(e) => handleTechChange(idx, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
            <button
              onClick={handleAddTech}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-semibold"
            >
              + Add Technology
            </button>
          </div>

          <input
            type="text"
            placeholder="Project Link (URL)"
            value={newProject.link || ''}
            onChange={(e) =>
              setNewProject({ ...newProject, link: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Image URL"
            value={newProject.image || ''}
            onChange={(e) =>
              setNewProject({ ...newProject, image: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newProject.featured || false}
              onChange={(e) =>
                setNewProject({ ...newProject, featured: e.target.checked })
              }
              className="w-4 h-4"
            />
            <span className="text-gray-700">Featured Project</span>
          </label>

          <div className="flex gap-4">
            <button
              onClick={handleAddProject}
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

      {/* Projects List */}
      <div className="space-y-4">
        {profile.projects.map((proj) => (
          <div key={proj.id} className="p-4 border border-gray-300 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex gap-2 items-center">
                  <p className="font-bold text-gray-900">{proj.title}</p>
                  {proj.featured && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditProject(proj)}
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDeleteProject(proj.id)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <p className="text-gray-700 mb-2">{proj.description}</p>
            <div className="flex flex-wrap gap-2">
              {proj.technologies.map((tech) => (
                <span
                  key={tech}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {profile.projects.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No projects added yet. Add your first project above!
        </div>
      )}

      {saved && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
          ✓ Project saved successfully!
        </div>
      )}
    </div>
  );
}
