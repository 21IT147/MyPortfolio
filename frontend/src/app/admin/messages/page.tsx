'use client';

import React, { useEffect, useState } from 'react';
import { fetchAdminMessages, markMessageAsRead, deleteAdminMessage } from '@/lib/api';
import { ContactMessage } from '@/types';
import { Trash2, Mail, CheckCircle2, Calendar } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    try {
      const data = await fetchAdminMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await markMessageAsRead(id);
      loadMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteAdminMessage(id);
      loadMessages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Contact Form Inbox</h1>
        <p className="text-sm text-gray-400 mt-1">Review contact inquiries submitted directly from the public portfolio.</p>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm py-10">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-gray-800 text-gray-400">
          No contact messages received yet.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`glass-panel p-6 rounded-2xl border transition-all space-y-3 ${
                msg.read ? 'border-gray-800/80 opacity-80' : 'border-purple-500/40 bg-purple-950/10'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{msg.name}</span>
                    <span className="text-xs text-purple-400 font-semibold">&lt;{msg.email}&gt;</span>
                    {!msg.read && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-600 text-white uppercase">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-gray-200 mt-1">{msg.subject}</p>
                </div>

                <div className="flex items-center gap-2">
                  {!msg.read && msg.id && (
                    <button
                      onClick={() => handleMarkRead(msg.id!)}
                      className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark as Read
                    </button>
                  )}
                  {msg.id && (
                    <button
                      onClick={() => handleDelete(msg.id!)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </div>

              {msg.receivedAt && (
                <p className="text-[11px] text-gray-500 font-mono">Received: {new Date(msg.receivedAt).toLocaleString()}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
