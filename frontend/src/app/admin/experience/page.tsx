'use client';

import React, { useEffect, useState } from 'react';
import { fetchAdminExperiences, createAdminExperience, updateAdminExperience, deleteAdminExperience } from '@/lib/api';
import { Experience } from '@/types';
import { Plus, Trash2, Edit2, Save, X, Briefcase } from 'lucide-react';

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExp, setEditingExp] = useState<Partial<Experience> | null>(null);

  const loadExperiences = async () => {
    try {
      const data = await fetchAdminExperiences();
      setExperiences(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;

    try {
      if (editingExp.id) {
        await updateAdminExperience(editingExp.id, editingExp);
      } else {
        await createAdminExperience(editingExp);
      }
      setEditingExp(null);
      loadExperiences();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this experience entry?')) return;
    try {
      await deleteAdminExperience(id);
      loadExperiences();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Work Experience Records</h1>
          <p className="text-sm text-gray-400 mt-1">Manage career timeline roles, companies, descriptions, and tech stacks.</p>
        </div>

        <button
          onClick={() => setEditingExp({ company: '', role: '', period: '2023 - Present', description: '', current: true, badgeText: 'FULLTIME', techStack: 'Java, Spring Boot', displayOrder: experiences.length + 1 })}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-600/20"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      {/* Form / Modal */}
      {editingExp && (
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">
              {editingExp.id ? 'Edit Experience Entry' : 'Add Experience Entry'}
            </h3>
            <button onClick={() => setEditingExp(null)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Role / Designation</label>
                <input
                  type="text"
                  required
                  value={editingExp.role || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                  placeholder="Associate Java Developer"
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={editingExp.company || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                  placeholder="Acme Corp"
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Period</label>
                <input
                  type="text"
                  value={editingExp.period || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                  placeholder="2023 - Present"
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Badge Text</label>
                <input
                  type="text"
                  value={editingExp.badgeText || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, badgeText: e.target.value })}
                  placeholder="CURRENT ROLE"
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Tech Stack</label>
                <input
                  type="text"
                  value={editingExp.techStack || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, techStack: e.target.value })}
                  placeholder="Java 17, Spring Boot, MySQL"
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Description</label>
              <textarea
                rows={3}
                value={editingExp.description || ''}
                onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm resize-none"
              ></textarea>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingExp.current || false}
                  onChange={(e) => setEditingExp({ ...editingExp, current: e.target.checked })}
                  className="rounded bg-gray-900 border-gray-800 text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <span>Current Role</span>
              </label>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>Order:</span>
                <input
                  type="number"
                  value={editingExp.displayOrder || 1}
                  onChange={(e) => setEditingExp({ ...editingExp, displayOrder: parseInt(e.target.value) || 1 })}
                  className="w-20 px-2 py-1 rounded bg-gray-900 border border-gray-800 text-white text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setEditingExp(null)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" /> Save Experience
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-gray-500 text-sm py-10">Loading experience history...</div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div key={exp.id} className="glass-panel p-6 rounded-2xl border border-gray-800 flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-400">{exp.period}</span>
                  {exp.current && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase">
                      CURRENT
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white">{exp.role} <span className="text-gray-400 font-normal">at {exp.company}</span></h3>
                <p className="text-xs text-gray-300">{exp.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setEditingExp(exp)}
                  className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => exp.id && handleDelete(exp.id)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
