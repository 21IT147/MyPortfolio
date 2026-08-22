import React, { useEffect, useState } from 'react';
import { fetchAdminStats, fetchPublicProfile } from '@/lib/api';
import { AdminStats, ProfileInfo } from '@/types';
import { Link } from 'react-router-dom';
import {
  Code,
  FolderGit2,
  Briefcase,
  BookOpen,
  Mail,
  ArrowRight,
  Database,
  Sparkles,
  Palette
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAdminStats(), fetchPublicProfile()])
      .then(([statsData, profileData]) => {
        setStats(statsData);
        setProfile(profileData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Spring Boot DB Dashboard
        </div>
        <h1 className="text-3xl font-extrabold text-white">System Overview</h1>
        <p className="text-sm text-gray-400 mt-1">Manage database records and visual branding themes in real time.</p>
      </div>

      {/* Active Theme Card */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Saved Theme:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/40">
                {profile?.themePreset || 'Midnight Dark'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Primary: <code className="text-blue-400 font-mono">{profile?.primaryColor || '#3b82f6'}</code> | Accent: <code className="text-purple-400 font-mono">{profile?.accentColor || '#8b5cf6'}</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-gray-900 border border-gray-800">
            <div className="w-5 h-5 rounded-full border border-gray-700" style={{ backgroundColor: profile?.primaryColor || '#3b82f6' }} />
            <div className="w-5 h-5 rounded-full border border-gray-700" style={{ backgroundColor: profile?.accentColor || '#8b5cf6' }} />
          </div>
          <Link to="/admin/profile" className="px-4 py-2 rounded-xl bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 text-xs font-bold transition-all">
            Customize Theme
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm py-10">Loading system statistics...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Skills</span>
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Code className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stats?.totalSkills || 0}</p>
            <Link to="/admin/skills" className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-semibold hover:underline">
              Manage Skills <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Projects</span>
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <FolderGit2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stats?.totalProjects || 0}</p>
            <Link to="/admin/projects" className="inline-flex items-center gap-1.5 text-xs text-purple-400 font-semibold hover:underline">
              Manage Projects <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Experiences</span>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stats?.totalExperiences || 0}</p>
            <Link to="/admin/experience" className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold hover:underline">
              Manage Experience <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Notes & Articles</span>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stats?.totalNotes || 0}</p>
            <Link to="/admin/notes" className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold hover:underline">
              Manage Notes <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Inbox Contact Submissions</span>
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <Mail className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-4">
              <p className="text-3xl font-bold text-white">{stats?.unreadMessages || 0}</p>
              <span className="text-xs font-medium text-red-400 uppercase tracking-wider">Unread Messages ({stats?.totalMessages || 0} Total)</span>
            </div>
            <Link to="/admin/messages" className="inline-flex items-center gap-1.5 text-xs text-red-400 font-semibold hover:underline">
              Open Inbox <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      )}

      {/* DB Connection info card */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-purple-400" />
          <div>
            <p className="text-sm font-bold text-white">Database Integration Status</p>
            <p className="text-xs text-gray-400">Connected to Spring Boot Gradle MySQL 8.0 Workbench repository on port 8085.</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
          ACTIVE
        </span>
      </div>

    </div>
  );
}
