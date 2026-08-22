import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-gray-800/80 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
      <div>
        © {new Date().getFullYear()} Keval Sheth. Driven by Spring Boot Gradle & React.js SPA.
      </div>

      <div className="flex items-center gap-6">
        <a href="#home" className="hover:text-blue-400 transition-colors">Home</a>
        <Link to="/notes" className="hover:text-amber-400 transition-colors">Notes Hub</Link>
        <Link to="/admin/login" className="hover:text-purple-400 transition-colors">Admin Portal</Link>
      </div>
    </footer>
  );
}
