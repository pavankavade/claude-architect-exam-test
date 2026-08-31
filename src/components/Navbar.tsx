"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Headphones, BookOpen, Sparkles, Moon, Sun, Award, Bookmark } from "lucide-react";

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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#090e17]/90 border-b border-[#23344e] transition-colors">
      <div className="max-w-[1520px] mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-slate-100 text-xs sm:text-base leading-tight tracking-tight flex items-center gap-1.5 truncate">
              <span className="truncate">Claude Certified Architect</span>
              <span className="hidden xs:inline text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                Audio
              </span>
            </div>
            <div className="text-[10px] sm:text-xs text-slate-400 font-medium truncate hidden sm:block">
              Foundations Exam Simulator • 88 Questions
            </div>
          </div>
        </Link>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <Link
            href="/#scenarios"
            className="text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-[#162236] transition-colors hidden md:flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>Scenarios</span>
          </Link>

          <Link
            href="/#faq"
            className="text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-[#162236] transition-colors hidden md:flex items-center gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
            <span>FAQ</span>
          </Link>

          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl bg-[#131d2e] border border-[#23344e] text-slate-300 hover:text-white hover:border-sky-500 transition-colors"
            title="Toggle light/dark theme"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />}
          </button>

          <Link
            href="/exam"
            className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-md shadow-sky-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Start Exam</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
