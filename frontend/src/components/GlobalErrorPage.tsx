import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';

export default function GlobalErrorPage({
  title = "Unexpected System Error",
  message = "An error occurred while processing your request. Please try refreshing or return to the main homepage.",
  code = "500"
}: {
  title?: string;
  message?: string;
  code?: string;
}) {
  return (
    <div className="min-h-screen bg-[#0d0f14] text-[#e8eaf0] flex items-center justify-center p-6">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-gray-800 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
          <AlertOctagon className="w-8 h-8" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-mono font-bold">
            ERROR {code}
          </span>
          <h1 className="text-2xl font-bold text-white mt-3">{title}</h1>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">{message}</p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Page
          </button>
          <Link
            to="/"
            className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-purple-500 transition-all shadow-lg shadow-purple-600/20"
          >
            <Home className="w-4 h-4" /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
