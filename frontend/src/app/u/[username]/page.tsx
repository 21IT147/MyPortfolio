import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchUserBySlug } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';
import { ProfileInfo, Skill, Experience, Project } from '@/types';
import { User, AlertCircle } from 'lucide-react';

export default function UserPortfolioPage() {
  const { username } = useParams<{ username: string }>();

  const [data, setData] = useState<{
    profile: ProfileInfo;
    skills: Skill[];
    experiences: Experience[];
    projects: Project[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (username) {
      fetchUserBySlug(username)
        .then((resData) => setData(resData))
        .catch((err) => {
          console.error(err);
          setError(true);
        })
        .finally(() => setLoading(false));
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center text-gray-400 text-sm">
        Loading portfolio for /u/{username}...
      </div>
    );
  }

  if (error || !data || !data.profile) {
    return (
      <div className="min-h-screen bg-[#0d0f14] text-white flex flex-col items-center justify-center p-6 space-y-4">
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold">Portfolio Not Found</h1>
        <p className="text-sm text-gray-400">The user portfolio &apos;/u/{username}&apos; does not exist or has been removed.</p>
        <Link to="/" className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d0f14] text-[#e8eaf0] selection:bg-blue-500 selection:text-white">
      <Navbar />

      {/* User Slug Badge */}
      <div className="pt-24 px-4 max-w-7xl mx-auto flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <User className="w-3.5 h-3.5" /> Multi-Tenant Portfolio: <span className="font-mono text-white">/u/{username}</span>
        </div>
      </div>

      <HeroSection profile={data.profile} />
      <AboutSection profile={data.profile} />
      <SkillsSection skills={data.skills} />
      <ExperienceSection experiences={data.experiences} />
      <ProjectsSection projects={data.projects} />
      <ContactSection />

      <Footer />
    </main>
  );
}
