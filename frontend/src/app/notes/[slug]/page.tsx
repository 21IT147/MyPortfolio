import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchPublicNoteBySlug } from '@/lib/api';
import { Note } from '@/types';
import { ArrowLeft, Tag } from 'lucide-react';

export default function NoteDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPublicNoteBySlug(slug)
        .then((data) => setNote(data))
        .catch((err) => {
          console.error(err);
          setError(true);
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  return (
    <main className="min-h-screen bg-[#0d0f14] text-[#e8eaf0]">
      <Navbar />

      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        
        <Link
          to="/notes"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Notes Hub
        </Link>

        {loading ? (
          <div className="py-20 text-center text-gray-500 text-sm">Loading note article...</div>
        ) : error || !note ? (
          <div className="py-20 glass-panel text-center rounded-2xl border border-gray-800 space-y-4">
            <h2 className="text-xl font-bold text-white">Article Not Found</h2>
            <p className="text-sm text-gray-400">The requested note article does not exist or has been unpublished.</p>
          </div>
        ) : (
          <article className="glass-panel p-8 sm:p-12 rounded-3xl border border-gray-800 space-y-8">
            
            <div className="space-y-4 border-b border-gray-800 pb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Tag className="w-3.5 h-3.5" /> {note.category}
              </span>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                {note.title}
              </h1>
            </div>

            {/* Note Markdown Content Body */}
            <div className="prose prose-invert max-w-none space-y-4 text-gray-300 leading-relaxed text-base">
              {note.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('# ')) {
                  return <h1 key={idx} className="text-2xl font-bold text-white pt-4">{paragraph.replace('# ', '')}</h1>;
                }
                if (paragraph.startsWith('## ')) {
                  return <h2 key={idx} className="text-xl font-bold text-amber-400 pt-3">{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={idx} className="text-lg font-bold text-blue-400 pt-2">{paragraph.replace('### ', '')}</h3>;
                }
                if (paragraph.startsWith('```')) {
                  return (
                    <pre key={idx} className="p-4 rounded-xl bg-gray-950 border border-gray-800 text-amber-300 font-mono text-xs overflow-x-auto">
                      <code>{paragraph.replace(/```[a-z]*/g, '')}</code>
                    </pre>
                  );
                }
                return <p key={idx}>{paragraph}</p>;
              })}
            </div>

          </article>
        )}

      </section>

      <Footer />
    </main>
  );
}
