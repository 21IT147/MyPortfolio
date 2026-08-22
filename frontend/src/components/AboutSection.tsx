'use client';

import React from 'react';
import { ProfileInfo } from '@/types';
import { Award, Code2, Cpu, CheckCircle2 } from 'lucide-react';

interface AboutProps {
  profile: ProfileInfo | null;
}

export default function AboutSection({ profile }: AboutProps) {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-800/60">
      <div className="space-y-12">
        
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">BIOGRAPHY</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            About Me
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Stat Cards */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{profile?.yearsExperience || 2}+ Years</p>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Professional Experience</p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{profile?.technologiesMastered || 15}+ Tech Stack</p>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Frameworks & Tools</p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{profile?.projectsCompleted || 12}+ Projects</p>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Completed Solutions</p>
              </div>
            </div>
          </div>

          {/* About Text */}
          <div className="lg:col-span-8 glass-panel p-8 rounded-2xl border border-gray-800 space-y-4 text-gray-300 leading-relaxed text-base">
            <p>
              {profile?.aboutText || "I am a dedicated Associate Java Developer with a focus on enterprise application development, microservices, and database optimization. My goal is to build scalable, resilient, and maintainable backend systems while continuously embracing modern full-stack web technologies."}
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Spring Boot Microservices & REST APIs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Spring Security & JWT Authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>PostgreSQL & MySQL Database Design</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Next.js / React Frontend Development</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
