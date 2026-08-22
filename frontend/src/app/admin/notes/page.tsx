'use client';

import React, { useEffect, useState } from 'react';
import { fetchAdminNotes, createAdminNote, updateAdminNote, deleteAdminNote } from '@/lib/api';
import { Note } from '@/types';
import { Plus, Trash2, Edit2, Save, X, BookOpen, Eye, EyeOff } from 'lucide-react';

export default function AdminNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<Partial<Note> | null>(null);

  const loadNotes = async () => {
    try {
      const data = await fetchAdminNotes();
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;

    try {
      if (editingNote.id) {
        await updateAdminNote(editingNote.id, editingNote);
      } else {
        await createAdminNote(editingNote);
      }
      setEditingNote(null);
      loadNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this note article?')) return;
    try {
      await deleteAdminNote(id);
      loadNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const togglePublish = async (note: Note) => {
    if (!note.id) return;
    try {
      await updateAdminNote(note.id, { ...note, published: !note.published });
      loadNotes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Notes & Knowledge Articles</h1>
          <p className="text-sm text-gray-400 mt-1">Write markdown technical guides, set categories, and publish/unpublish articles live.</p>
        </div>

        <button
          onClick={() => setEditingNote({ title: '', slug: 'new-article-slug', category: 'Java & Spring Boot', content: '# New Technical Guide\n\nWrite markdown content here...', published: true })}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-600/20"
        >
          <Plus className="w-4 h-4" /> Create Article
        </button>
      </div>

      {/* Editor Modal */}
      {editingNote && (
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/40 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">
              {editingNote.id ? 'Edit Article' : 'Write New Article'}
            </h3>
            <button onClick={() => setEditingNote(null)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={editingNote.title || ''}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  placeholder="Spring Boot JWT Guide"
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={editingNote.slug || ''}
                  onChange={(e) => setEditingNote({ ...editingNote, slug: e.target.value })}
                  placeholder="spring-boot-jwt-guide"
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Category</label>
                <input
                  type="text"
                  value={editingNote.category || ''}
                  onChange={(e) => setEditingNote({ ...editingNote, category: e.target.value })}
                  placeholder="Java & Spring Boot"
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Markdown Body Content</label>
              <textarea
                rows={8}
                value={editingNote.content || ''}
                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white font-mono text-xs resize-none"
              ></textarea>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-800">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingNote.published || false}
                  onChange={(e) => setEditingNote({ ...editingNote, published: e.target.checked })}
                  className="rounded bg-gray-900 border-gray-800 text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <span>Published to Public Notes Hub</span>
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingNote(null)}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" /> Save Note
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Grid List */}
      {loading ? (
        <div className="text-gray-500 text-sm py-10">Loading notes database...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.map((note) => (
            <div key={note.id} className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {note.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      note.published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-800 text-gray-500'
                    }`}>
                      {note.published ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{note.title}</h3>
                  <p className="text-xs text-gray-500 font-mono">/notes/{note.slug}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => togglePublish(note)}
                    title={note.published ? 'Unpublish' : 'Publish'}
                    className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300"
                  >
                    {note.published ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-gray-500" />}
                  </button>
                  <button
                    onClick={() => setEditingNote(note)}
                    className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => note.id && handleDelete(note.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
