"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { TOOLS_DATA, ToolItem } from "@/lib/tools-data";
import DynamicIcon from "./DynamicIcon";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: "bn" | "en";
}

export default function SearchModal({ isOpen, onClose, lang = "bn" }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent can toggle
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();
  const results: ToolItem[] = trimmed
    ? TOOLS_DATA.filter((tool) => {
        return (
          tool.titleBn.toLowerCase().includes(trimmed) ||
          tool.titleEn.toLowerCase().includes(trimmed) ||
          tool.descBn.toLowerCase().includes(trimmed) ||
          tool.descEn.toLowerCase().includes(trimmed) ||
          tool.category.toLowerCase().includes(trimmed) ||
          tool.keywords.some((k) => k.toLowerCase().includes(trimmed))
        );
      })
    : TOOLS_DATA.filter((t) => t.popular).slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              lang === "bn"
                ? "টুল খুঁজুন... (যেমন: pdf, 300x300, ছবি, youtube, qr, বিজয়)"
                : "Search tools... (e.g. pdf, compress, youtube, qr, bijoy)"
            }
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results area */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {trimmed ? (lang === "bn" ? "অনুসন্ধান ফলাফল" : "Search Results") : (lang === "bn" ? "জনপ্রিয় টুলস" : "Popular Tools")}
          </div>

          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <p className="text-base font-medium">
                {lang === "bn" ? "কোনো টুল পাওয়া যায়নি" : "No tools found matching your query"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {lang === "bn" ? "ভিন্ন শব্দ দিয়ে আবার চেষ্টা করুন।" : "Try searching with other keywords"}
              </p>
            </div>
          ) : (
            results.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50/70 dark:hover:bg-slate-800/80 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <DynamicIcon name={tool.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">
                        {lang === "bn" ? tool.titleBn : tool.titleEn}
                      </span>
                      {tool.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {lang === "bn" ? tool.descBn : tool.descEn}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </Link>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            {lang === "bn" ? "৫০+ ফ্রি অনলাইন টুলস" : "50+ Free Web Tools"}
          </span>
          <span>ToolKaj.com</span>
        </div>
      </div>
    </div>
  );
}
