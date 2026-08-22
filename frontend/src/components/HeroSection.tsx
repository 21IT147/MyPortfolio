'use client';

import React from 'react';
import { ProfileInfo } from '@/types';
import { Download, Mail, Sparkles, ArrowRight, Globe } from 'lucide-react';

interface HeroProps {
  profile: ProfileInfo | null;
}

function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z" />
    </svg>
  );
}

export default function HeroSection({ profile }: HeroProps) {
  const name = profile?.fullName || "Keval Sheth";
  const eyebrow = profile?.eyebrow || "ASSOCIATE JAVA DEVELOPER";
  const title = profile?.title || "Building Enterprise Backend Microservices & Modern Web Applications";
  const summary = profile?.summary || "Specializing in Java 17, Spring Boot, Spring Security, RESTful APIs, PostgreSQL, and modern frontend design.";
  const resumeUrl = profile?.resumeUrl || "#";
  const github = profile?.githubUrl || "https://github.com";
  const linkedin = profile?.linkedinUrl || "https://linkedin.com";

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        
        {/* Content */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            {eyebrow}
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none">
            Hi, I&apos;m <span className="text-gradient">{name}</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-300 font-medium leading-snug">
            {title}
          </p>

          <p className="text-base text-gray-400 max-w-2xl leading-relaxed">
            {summary}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="#contact"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 hover:scale-105"
            >
              Get In Touch <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 text-gray-200 font-semibold text-sm flex items-center gap-2 transition-all hover:border-blue-500/40"
            >
              <Download className="w-4 h-4 text-blue-400" /> View Resume
            </a>
          </div>

          <div className="flex items-center gap-4 pt-6">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Connect:</span>
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-surface border border-custom text-gray-400 hover:text-white hover:border-blue-500/40 transition-all hover:scale-110"
              aria-label="GitHub"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-surface border border-custom text-gray-400 hover:text-white hover:border-blue-500/40 transition-all hover:scale-110"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${profile?.email || 'contact@example.com'}`}
              className="p-2.5 rounded-xl bg-surface border border-custom text-gray-400 hover:text-white hover:border-blue-500/40 transition-all hover:scale-110"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Profile Card / Avatar */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative glass-panel rounded-3xl p-6 border border-gray-800 flex flex-col items-center text-center space-y-4">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-blue-500/40 relative shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                  <div className="w-32 h-32 rounded-full bg-blue-600/20 flex items-center justify-center text-5xl font-bold text-blue-400 border border-blue-500/30">
                    KS
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">{name}</h3>
                <p className="text-sm text-blue-400 font-medium">Associate Java Developer</p>
              </div>

              <div className="w-full grid grid-cols-2 gap-3 pt-2 text-left">
                <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                  <p className="text-xs text-gray-500 font-semibold uppercase">Experience</p>
                  <p className="text-lg font-bold text-white">{profile?.yearsExperience || 2}+ Years</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800">
                  <p className="text-xs text-gray-500 font-semibold uppercase">Projects</p>
                  <p className="text-lg font-bold text-white">{profile?.projectsCompleted || 10}+ Delivered</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
