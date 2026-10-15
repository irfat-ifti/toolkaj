"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Layers,
  Compass,
} from "lucide-react";
import SearchModal from "./SearchModal";
import { CATEGORIES } from "@/lib/tools-data";
import { useApp } from "@/context/AppContext";
import Logo from "./Logo";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { lang, setLang, theme, toggleTheme } = useApp();
  const isDarkMode = theme === "dark";

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            {/* Brand Logo */}
            <Logo size="md" lang={lang} />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  pathname === "/"
                    ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-400"
                    : "text-slate-700 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {lang === "bn" ? "হোম" : "Home"}
              </Link>

              {/* Categories dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsCategoryDropdownOpen(false), 200)}
                  className="px-3 py-1.5 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 transition-colors"
                >
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <span>{lang === "bn" ? "ক্যাটাগরি" : "Categories"}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isCategoryDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-fade-in">
                    {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.id}`}
                        onClick={() => setIsCategoryDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
                      >
                        <span>{lang === "bn" ? cat.nameBn : cat.nameEn}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                          {cat.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/tools"
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  pathname === "/tools"
                    ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-400"
                    : "text-slate-700 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {lang === "bn" ? "সব টুলস" : "All Tools"}
              </Link>

              <Link
                href="/tools/citizen/dorkari-links"
                className="px-3 py-1.5 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
              >
                <Compass className="w-4 h-4 text-emerald-500" />
                <span>{lang === "bn" ? "দরকারি লিংক (BD)" : "Essential Links"}</span>
              </Link>
            </nav>

            {/* Quick Search Bar trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center sm:justify-between p-2 sm:px-4 sm:py-2.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/80 text-slate-500 text-xs sm:text-sm font-medium transition-all sm:w-full sm:max-w-xs group shrink-0"
              aria-label="Search tools"
            >
              <span className="flex items-center gap-2 truncate">
                <Search className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform shrink-0" />
                <span className="hidden sm:inline truncate">
                  {lang === "bn" ? "টুল খুঁজুন..." : "Search tools..."}
                </span>
              </span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                Ctrl K
              </kbd>
            </button>

            {/* Actions: Lang, Theme & Mobile button */}
            <div className="flex items-center gap-2">
              {/* Language Switch */}
              <div className="flex items-center p-0.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                <button
                  onClick={() => setLang("bn")}
                  className={`px-2.5 py-1 rounded-full transition-colors ${
                    lang === "bn"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  বাং
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`px-2.5 py-1 rounded-full transition-colors ${
                    lang === "en"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              {/* Mobile hamburger button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Open navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-xl">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl font-semibold text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800"
            >
              {lang === "bn" ? "হোম পেজ" : "Home"}
            </Link>
            <Link
              href="/tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl font-semibold text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800"
            >
              {lang === "bn" ? "সবগুলো টুলস" : "All Tools"}
            </Link>
            <Link
              href="/tools/citizen/dorkari-links"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800"
            >
              {lang === "bn" ? "দরকারি লিংক (BD)" : "Essential BD Links"}
            </Link>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="block px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                {lang === "bn" ? "ক্যাটাগরি" : "Categories"}
              </span>
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {lang === "bn" ? cat.nameBn : cat.nameEn}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        lang={lang}
      />
    </>
  );
}
