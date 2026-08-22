'use client';

import React, { useState } from 'react';
import { Skill } from '@/types';
import { Layers, Terminal, Database, Wrench } from 'lucide-react';

interface SkillsProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(skills.map((s) => s.category)))];

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter((s) => s.category === activeCategory);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'backend':
        return <Terminal className="w-4 h-4 text-blue-400" />;
      case 'frontend':
        return <Layers className="w-4 h-4 text-purple-400" />;
      case 'databases':
        return <Database className="w-4 h-4 text-emerald-400" />;
      default:
        return <Wrench className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-800/60">
      <div className="space-y-8">
        
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">TECHNICAL PROFICIENCY</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Skills & Expertise
          </h2>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-surface border border-custom text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id || skill.name}
              className="glass-panel p-5 rounded-2xl border border-gray-800 hover:border-blue-500/40 transition-all group hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(skill.category)}
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{skill.category}</span>
                </div>
                <span className="text-xs font-bold text-blue-400">{skill.proficiencyPercent}%</span>
              </div>

              <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                {skill.name}
              </h4>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-gray-800 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${skill.proficiencyPercent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
