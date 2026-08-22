'use client';

import React from 'react';
import { Experience } from '@/types';
import { Briefcase, Calendar, CheckCircle } from 'lucide-react';

interface ExperienceProps {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceProps) {
  return (
    <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-800/60">
      <div className="space-y-12">
        
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">CAREER PATH</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Work Experience
          </h2>
        </div>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-gradient-to-b border-blue-500/40 space-y-10">
          {experiences.map((exp) => (
            <div key={exp.id || exp.company} className="relative group">
              
              {/* Timeline Dot */}
              <div className={`absolute -left-[31px] sm:-left-[39px] top-1 w-5 h-5 rounded-full border-4 border-gray-950 ${
                exp.current ? 'bg-purple-500 animate-pulse' : 'bg-blue-500'
              }`}></div>

              <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-gray-800 hover:border-blue-500/40 transition-all space-y-4">
                
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    {exp.badgeText && (
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-1">
                        {exp.badgeText}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {exp.role}
                    </h3>
                    <p className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-blue-400" /> {exp.company}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-900/60 px-3 py-1.5 rounded-lg border border-gray-800 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>{exp.period}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed">
                  {exp.description}
                </p>

                {exp.techStack && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {exp.techStack.split(',').map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
