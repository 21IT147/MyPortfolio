'use client';

import React, { useEffect, useState } from 'react';
import { fetchPublicProfile, updateAdminProfile } from '@/lib/api';
import { ProfileInfo } from '@/types';
import { Save, CheckCircle2, AlertCircle, Palette, UploadCloud, FileText, ExternalLink, Loader2, Settings } from 'lucide-react';

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
  
  // Cloudinary Resume Upload State
  const [uploadingResume, setUploadingResume] = useState(false);
  const [cloudName, setCloudName] = useState(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dkg7k4a0p');
  const [uploadPreset, setUploadPreset] = useState(import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'portfolio_preset');
  const [showCloudSettings, setShowCloudSettings] = useState(false);

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

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset.trim());

      let res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName.trim()}/raw/upload`, {
        method: 'POST',
        body: formData
      });

      let data = await res.json();

      if (!data.secure_url) {
        res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName.trim()}/auto/upload`, {
          method: 'POST',
          body: formData
        });
        data = await res.json();
      }

      if (data.secure_url) {
        setProfile((prev) => ({ ...prev, resumeUrl: data.secure_url }));
        setMsg({ type: 'success', text: 'Resume uploaded successfully to Cloudinary! Click "Save Profile" below to persist.' });
      } else {
        throw new Error(data.error?.message || 'Cloudinary upload failed. Check Cloud Name and Unsigned Preset.');
      }
    } catch (err: unknown) {
      console.error(err);
      const errText = err instanceof Error ? err.message : 'Upload failed.';
      setMsg({ type: 'error', text: `Cloudinary Upload Error: ${errText}` });
    } finally {
      setUploadingResume(false);
    }
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

        {/* Cloudinary Resume File Upload Section */}
        <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs font-semibold uppercase text-purple-400 tracking-wider">Cloudinary Resume Upload</label>
              <p className="text-xs text-gray-400 mt-0.5">Upload your PDF/Word resume file. Each upload automatically replaces the older resume on Cloudinary.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowCloudSettings(!showCloudSettings)}
              className="text-xs font-semibold text-gray-400 hover:text-purple-400 flex items-center gap-1.5 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{showCloudSettings ? 'Hide Cloud Config' : 'Cloudinary Config'}</span>
            </button>
          </div>

          {showCloudSettings && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-gray-950 border border-gray-800 text-xs">
              <div>
                <label className="block font-semibold text-gray-400 mb-1">Cloudinary Cloud Name</label>
                <input
                  type="text"
                  value={cloudName}
                  onChange={(e) => setCloudName(e.target.value)}
                  placeholder="e.g. dkg7k4a0p"
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-400 mb-1">Unsigned Upload Preset</label>
                <input
                  type="text"
                  value={uploadPreset}
                  onChange={(e) => setUploadPreset(e.target.value)}
                  placeholder="e.g. portfolio_preset"
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-white font-mono"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
            <label className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-purple-600/20 border border-purple-500/40 hover:bg-purple-600/30 text-purple-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md">
              {uploadingResume ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  <span>Uploading File to Cloudinary...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 text-purple-400" />
                  <span>Upload New Resume (.pdf, .doc)</span>
                </>
              )}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                disabled={uploadingResume}
                onChange={handleResumeUpload}
                className="hidden"
              />
            </label>

            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all border border-gray-700 shadow-md"
              >
                <FileText className="w-4 h-4 text-blue-400" />
                <span>View Current Resume</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </a>
            )}
          </div>

          {profile.resumeUrl && (
            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono bg-gray-950 p-3 rounded-xl border border-gray-800/80 overflow-x-auto">
              <span className="text-gray-500 font-sans font-semibold shrink-0">Live Cloudinary URL:</span>
              <span className="text-purple-300 truncate select-all">{profile.resumeUrl}</span>
            </div>
          )}
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
