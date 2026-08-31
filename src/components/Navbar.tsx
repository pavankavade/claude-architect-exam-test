"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Headphones, BookOpen, Sparkles, Moon, Sun, Award } from "lucide-react";

export default function Navbar() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("cca_theme");
    if (saved === "light") {
      setIsDark(false);
      document.documentElement.classList.add("light");
    } else {
      setIsDark(true);
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.add("light");
      localStorage.setItem("cca_theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("cca_theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#090e17]/85 border-b border-[#23344e] transition-colors">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-100 text-base leading-tight tracking-tight flex items-center gap-2">
              Claude Certified Architect
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                Practice Audio
              </span>
            </div>
            <div className="text-xs text-slate-400 font-medium">Foundations Exam Simulator • 88 Questions</div>
          </div>
        </Link>

        {/* Nav links & CTA */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/#scenarios"
            className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-sky-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800/50"
          >
            <BookOpen className="w-4 h-4" />
            Scenarios
          </Link>

          <Link
            href="/#faq"
            className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-sky-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800/50"
          >
            <Award className="w-4 h-4" />
            Exam Guide &amp; FAQ
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-[#23344e] bg-[#131d2e] text-slate-300 hover:text-white hover:bg-[#1c2a42] transition-colors"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          <Link
            href="/exam"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-md shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            Start Exam Mode
          </Link>
        </div>
      </div>
    </header>
  );
}
