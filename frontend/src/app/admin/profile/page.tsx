'use client';

import React, { useEffect, useState } from 'react';
import { fetchPublicProfile, updateAdminProfile } from '@/lib/api';
import { ProfileInfo } from '@/types';
import { Save, CheckCircle2, AlertCircle, Palette } from 'lucide-react';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<ProfileInfo>({
    fullName: '',
    eyebrow: '',
    title: '',
    summary: '',
    aboutText: '',
    avatarUrl: '',
    resumeUrl: '',
    yearsExperience: 0,
    projectsCompleted: 0,
    technologiesMastered: 0,
    githubUrl: '',
    linkedinUrl: '',
    email: '',
    location: '',
    primaryColor: '#3b82f6',
    accentColor: '#8b5cf6',
    themePreset: 'Midnight Dark'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchPublicProfile()
      .then((data) => {
        if (data) {
          setProfile({
            ...data,
            primaryColor: data.primaryColor || '#3b82f6',
            accentColor: data.accentColor || '#8b5cf6',
            themePreset: data.themePreset || 'Midnight Dark'
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const themePresets = [
    { name: 'Midnight Dark', primary: '#3b82f6', accent: '#8b5cf6' },
    { name: 'Neon Cyberpunk', primary: '#ec4899', accent: '#06b6d4' },
    { name: 'Emerald Forest', primary: '#10b981', accent: '#3b82f6' },
    { name: 'Sunset Amber', primary: '#f59e0b', accent: '#ef4444' }
  ];

  const applyPreset = (preset: { name: string; primary: string; accent: string }) => {
    setProfile({
      ...profile,
      themePreset: preset.name,
      primaryColor: preset.primary,
      accentColor: preset.accent
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    try {
      const updated = await updateAdminProfile(profile);
      setProfile(updated);
      setMsg({ type: 'success', text: 'Profile configuration & theme saved successfully to Database!' });
    } catch (err: unknown) {
      console.error(err);
      setMsg({ type: 'error', text: 'Failed to update profile. Ensure backend is running.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-500 text-sm py-10">Loading profile configuration...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Profile & Theme Customizer</h1>
        <p className="text-sm text-gray-400 mt-1">Configure profile details and choose custom brand accent theme settings.</p>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-semibold ${
          msg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Theme Selection Box */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
        <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
          <Palette className="w-5 h-5" />
          <span>Website Theme Customizer</span>
        </div>
        <p className="text-xs text-gray-400">Select a curated theme preset or choose custom brand colors. Saved themes persist in DB and display on your Admin Dashboard.</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {themePresets.map((preset) => {
            const isSelected = profile.themePreset === preset.name;
            return (
              <button
                type="button"
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className={`p-3 rounded-2xl border text-left transition-all space-y-2 ${
                  isSelected
                    ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                    : 'border-gray-800 bg-gray-900/60 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }} />
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.accent }} />
                </div>
                <p className="text-xs font-bold text-white">{preset.name}</p>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-800">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">Primary Accent Hex Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={profile.primaryColor || '#3b82f6'}
                onChange={(e) => setProfile({ ...profile, primaryColor: e.target.value, themePreset: 'Custom' })}
                className="w-10 h-10 rounded-lg border-0 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={profile.primaryColor || '#3b82f6'}
                onChange={(e) => setProfile({ ...profile, primaryColor: e.target.value, themePreset: 'Custom' })}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900/80 border border-gray-800 text-white text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">Secondary Accent Hex Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={profile.accentColor || '#8b5cf6'}
                onChange={(e) => setProfile({ ...profile, accentColor: e.target.value, themePreset: 'Custom' })}
                className="w-10 h-10 rounded-lg border-0 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={profile.accentColor || '#8b5cf6'}
                onChange={(e) => setProfile({ ...profile, accentColor: e.target.value, themePreset: 'Custom' })}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900/80 border border-gray-800 text-white text-xs font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-white text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">Eyebrow Badge</label>
            <input
              type="text"
              required
              value={profile.eyebrow}
              onChange={(e) => setProfile({ ...profile, eyebrow: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-white text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">Hero Title / Tagline</label>
          <input
            type="text"
            required
            value={profile.title}
            onChange={(e) => setProfile({ ...profile, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-white text-sm focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">Hero Short Summary</label>
          <textarea
            rows={3}
            value={profile.summary}
            onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-white text-sm focus:outline-none focus:border-purple-500 resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">Detailed Biography (About Text)</label>
          <textarea
            rows={5}
            value={profile.aboutText}
            onChange={(e) => setProfile({ ...profile, aboutText: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-white text-sm focus:outline-none focus:border-purple-500 resize-none"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">Years Experience</label>
            <input
              type="number"
              value={profile.yearsExperience}
              onChange={(e) => setProfile({ ...profile, yearsExperience: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-white text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">Projects Completed</label>
            <input
              type="number"
              value={profile.projectsCompleted}
              onChange={(e) => setProfile({ ...profile, projectsCompleted: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-white text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">Tech Mastered Count</label>
            <input
              type="number"
              value={profile.technologiesMastered}
              onChange={(e) => setProfile({ ...profile, technologiesMastered: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-white text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">Resume File / Download URL</label>
            <input
              type="text"
              value={profile.resumeUrl}
              onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
              placeholder="C:/Portfolio/Resume/14062026/Keval_Sheth.pdf"
              className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-white text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-white text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">GitHub URL</label>
            <input
              type="text"
              value={profile.githubUrl}
              onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-white text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">LinkedIn URL</label>
            <input
              type="text"
              value={profile.linkedinUrl}
              onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-white text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving Theme & Profile to DB...' : 'Save Profile & Theme Configuration'}
        </button>

      </form>
    </div>
  );
}
