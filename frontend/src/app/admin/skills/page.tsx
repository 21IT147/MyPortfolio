'use client';

import React, { useEffect, useState } from 'react';
import { fetchAdminSkills, createAdminSkill, updateAdminSkill, deleteAdminSkill } from '@/lib/api';
import { Skill } from '@/types';
import { Plus, Trash2, Edit2, Save, X, Code } from 'lucide-react';

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);

  const loadSkills = async () => {
    try {
      const data = await fetchAdminSkills();
      setSkills(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    try {
      if (editingSkill.id) {
        await updateAdminSkill(editingSkill.id, editingSkill);
      } else {
        await createAdminSkill(editingSkill);
      }
      setEditingSkill(null);
      loadSkills();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await deleteAdminSkill(id);
      loadSkills();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Skills & Technologies</h1>
          <p className="text-sm text-gray-400 mt-1">Manage skill categories, names, proficiency scores, and ordering.</p>
        </div>

        <button
          onClick={() => setEditingSkill({ name: '', category: 'Backend', proficiencyPercent: 85, iconName: 'code', displayOrder: skills.length + 1 })}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-600/20"
        >
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      {/* Edit Modal / Form */}
      {editingSkill && (
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">
              {editingSkill.id ? 'Edit Skill Record' : 'Add New Skill'}
            </h3>
            <button onClick={() => setEditingSkill(null)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Skill Name</label>
              <input
                type="text"
                required
                value={editingSkill.name || ''}
                onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                placeholder="e.g. Java 17"
                className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Category</label>
              <select
                value={editingSkill.category || 'Backend'}
                onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm"
              >
                <option value="Backend">Backend</option>
                <option value="Frontend">Frontend</option>
                <option value="Databases">Databases</option>
                <option value="DevOps & Tools">DevOps & Tools</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Proficiency %</label>
              <input
                type="number"
                min={1}
                max={100}
                value={editingSkill.proficiencyPercent || 85}
                onChange={(e) => setEditingSkill({ ...editingSkill, proficiencyPercent: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Display Order</label>
              <input
                type="number"
                value={editingSkill.displayOrder || 1}
                onChange={(e) => setEditingSkill({ ...editingSkill, displayOrder: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingSkill(null)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" /> Save Skill
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table List */}
      {loading ? (
        <div className="text-gray-500 text-sm py-10">Loading skills database...</div>
      ) : (
        <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/60 text-xs text-gray-400 uppercase font-semibold">
                <th className="p-4">Order</th>
                <th className="p-4">Skill Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Proficiency</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {skills.map((skill) => (
                <tr key={skill.id} className="hover:bg-gray-900/40">
                  <td className="p-4 text-xs font-mono text-gray-500">#{skill.displayOrder}</td>
                  <td className="p-4 font-bold text-white">{skill.name}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {skill.category}
                    </span>
                  </td>
                  <td className="p-4 text-blue-400 font-semibold">{skill.proficiencyPercent}%</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setEditingSkill(skill)}
                      className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => skill.id && handleDelete(skill.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
