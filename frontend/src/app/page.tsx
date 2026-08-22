'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

import {
  fetchPublicProfile,
  fetchPublicSkills,
  fetchPublicExperiences,
  fetchPublicProjects
} from '@/lib/api';
import { ProfileInfo, Skill, Experience, Project } from '@/types';

export default function Home() {
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPortfolioData() {
      try {
        const [profData, skillData, expData, projData] = await Promise.all([
          fetchPublicProfile().catch(() => null),
          fetchPublicSkills().catch(() => []),
          fetchPublicExperiences().catch(() => []),
          fetchPublicProjects().catch(() => []),
        ]);

        if (profData) setProfile(profData);
        if (skillData.length > 0) setSkills(skillData);
        if (expData.length > 0) setExperiences(expData);
        if (projData.length > 0) setProjects(projData);
      } catch (err) {
        console.error("Error loading portfolio APIs:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPortfolioData();
  }, []);

  return (
    <main className="min-h-screen bg-[#0d0f14] text-[#e8eaf0] selection:bg-blue-500/30 selection:text-blue-200">
      <Navbar />
      <HeroSection profile={profile} />
      <AboutSection profile={profile} />
      <SkillsSection skills={skills} />
      <ExperienceSection experiences={experiences} />
      <ProjectsSection projects={projects} />
      <ContactSection />
      <Footer />
    </main>
  );
}
