import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchPublicNotes } from '@/lib/api';
import { Note } from '@/types';
import { Search, ArrowRight, Tag } from 'lucide-react';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicNotes()
      .then((data) => setNotes(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(notes.map((n) => n.category)))];

  const filteredNotes = notes.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
                          n.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[#0d0f14] text-[#e8eaf0]">
      <Navbar />

      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">KNOWLEDGE HUB</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-1">
            Java & System Design Notes
          </h1>
          <p className="text-gray-400 mt-2 text-base max-w-2xl">
            A curated database of architecture guides, Spring Security tutorials, microservices patterns, and technical notes.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-500 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search notes and articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface border border-custom text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-gray-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'bg-surface border border-custom text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="text-center py-16 text-gray-500 text-sm">Loading notes...</div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-2xl border border-gray-800 text-gray-400">
            No published notes found matching your filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <Link
                key={note.id || note.slug}
                to={`/notes/${note.slug}`}
                className="glass-panel p-6 rounded-2xl border border-gray-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group hover:-translate-y-1"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Tag className="w-3 h-3" /> {note.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                    {note.title}
                  </h3>

                  <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                    {note.content.replace(/#|\*|`/g, '').slice(0, 150)}...
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-800/80 flex items-center justify-between text-xs text-amber-400 font-semibold">
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}

      </section>

      <Footer />
    </main>
  );
}
