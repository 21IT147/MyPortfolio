import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Menu, X, BookOpen, User, Briefcase, Code, FolderGit2, Mail } from 'lucide-react';
import { getAuthToken } from '@/lib/api';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getAuthToken());
  }, []);

  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg group-hover:scale-105 transition-transform">
              K
            </div>
            <span className="font-bold text-lg tracking-tight text-white group-hover:text-blue-400 transition-colors">
              Keval Sheth<span className="text-blue-500">.dev</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#about" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-400" /> About
            </a>
            <a href="#skills" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
              <Code className="w-4 h-4 text-blue-400" /> Skills
            </a>
            <a href="#experience" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-400" /> Experience
            </a>
            <a href="#projects" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
              <FolderGit2 className="w-4 h-4 text-blue-400" /> Projects
            </a>
            <Link to="/notes" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" /> Notes Hub
            </Link>
            <a href="#contact" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-400" /> Contact
            </a>

            {/* Admin Action Button */}
            {isLoggedIn ? (
              <Link
                to="/admin/dashboard"
                className="px-3.5 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30 transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" /> Admin Dashboard
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="px-3.5 py-1.5 rounded-lg bg-gray-800/80 border border-gray-700/60 text-gray-300 hover:text-white hover:border-blue-500/50 transition-all text-xs font-semibold flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Admin Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden glass-panel border-t border-gray-800 px-4 pt-3 pb-6 space-y-3">
          <a href="#about" onClick={() => setIsOpen(false)} className="block py-2 text-gray-300 hover:text-blue-400 font-medium">About</a>
          <a href="#skills" onClick={() => setIsOpen(false)} className="block py-2 text-gray-300 hover:text-blue-400 font-medium">Skills</a>
          <a href="#experience" onClick={() => setIsOpen(false)} className="block py-2 text-gray-300 hover:text-blue-400 font-medium">Experience</a>
          <a href="#projects" onClick={() => setIsOpen(false)} className="block py-2 text-gray-300 hover:text-blue-400 font-medium">Projects</a>
          <Link to="/notes" onClick={() => setIsOpen(false)} className="block py-2 text-amber-300 hover:text-amber-400 font-medium">Notes Hub</Link>
          <a href="#contact" onClick={() => setIsOpen(false)} className="block py-2 text-gray-300 hover:text-blue-400 font-medium">Contact</a>
          <div className="pt-2 border-t border-gray-800">
            {isLoggedIn ? (
              <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="block text-center py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold">
                Admin Dashboard
              </Link>
            ) : (
              <Link to="/admin/login" onClick={() => setIsOpen(false)} className="block text-center py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg text-sm font-semibold">
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
