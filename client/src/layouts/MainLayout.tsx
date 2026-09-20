import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar.js';
import { DemoSwitcher } from '../components/DemoSwitcher.js';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* 1-Click Role Switcher for Hackathon Live Jury Demo */}
      <DemoSwitcher />

      {/* Main Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm">GramUtthan</span>
              <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded font-mono">
                SIH Problem Statement SIH26043
              </span>
            </div>
            <p className="text-slate-400 text-xs">
              Crowdsourced Social Innovation Network — Government of Jharkhand
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <span>Report → Understand → Match → Resolve → Verify → Reward</span>
            <span className="text-slate-600">|</span>
            <span>Zero Fake Mockups • Multilingual AI Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
