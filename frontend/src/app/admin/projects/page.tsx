'use client';

import React, { useEffect, useState } from 'react';
import { fetchAdminProjects, createAdminProject, updateAdminProject, deleteAdminProject } from '@/lib/api';
import { Project } from '@/types';
import { Plus, Trash2, Edit2, Save, X, ExternalLink, Star } from 'lucide-react';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);

  const loadProjects = async () => {
    try {
      const data = await fetchAdminProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      if (editingProject.id) {
        await updateAdminProject(editingProject.id, editingProject);
      } else {
        await createAdminProject(editingProject);
      }
      setEditingProject(null);
      loadProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteAdminProject(id);
      loadProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Project Case Studies</h1>
          <p className="text-sm text-gray-400 mt-1">Manage project titles, descriptions, tech tags, URLs, and featured flags.</p>
        </div>

        <button
          onClick={() => setEditingProject({ title: '', shortDesc: '', fullDesc: '', demoUrl: '', githubUrl: '', imageUrl: '', tags: 'Java, Spring Boot', featured: false, displayOrder: projects.length + 1 })}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-600/20"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Form / Modal */}
      {editingProject && (
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">
              {editingProject.id ? 'Edit Project' : 'Add New Project'}
            </h3>
            <button onClick={() => setEditingProject(null)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  placeholder="e.g. Microservices Gateway"
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Tech Stack Tags (Comma separated)</label>
                <input
                  type="text"
                  value={editingProject.tags || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value })}
                  placeholder="Java, Spring Boot, PostgreSQL"
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Short Description</label>
              <textarea
                rows={2}
                value={editingProject.shortDesc || ''}
                onChange={(e) => setEditingProject({ ...editingProject, shortDesc: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Live Demo URL</label>
                <input
                  type="text"
                  value={editingProject.demoUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">GitHub Repo URL</label>
                <input
                  type="text"
                  value={editingProject.githubUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Image Banner URL</label>
                <input
                  type="text"
                  value={editingProject.imageUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingProject.featured || false}
                  onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                  className="rounded bg-gray-900 border-gray-800 text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <span>Featured Project Badge</span>
              </label>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>Display Order:</span>
                <input
                  type="number"
                  value={editingProject.displayOrder || 1}
                  onChange={(e) => setEditingProject({ ...editingProject, displayOrder: parseInt(e.target.value) || 1 })}
                  className="w-20 px-2 py-1 rounded bg-gray-900 border border-gray-800 text-white text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" /> Save Project
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid List */}
      {loading ? (
        <div className="text-gray-500 text-sm py-10">Loading projects database...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4 relative group">
              <div className="flex items-start justify-between">
                <div>
                  {project.featured && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
                      <Star className="w-3 h-3 fill-current" /> Featured
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-white">{project.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => project.id && handleDelete(project.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">{project.shortDesc}</p>

              {project.tags && (
                <div className="flex flex-wrap gap-1">
                  {project.tags.split(',').map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-gray-400 text-[10px]">
                      {t.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
