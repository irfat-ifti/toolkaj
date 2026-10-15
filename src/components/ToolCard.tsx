"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Pin, ArrowUpRight } from "lucide-react";
import { ToolItem } from "@/lib/tools-data";
import DynamicIcon from "./DynamicIcon";
import { useApp } from "@/context/AppContext";

interface ToolCardProps {
  tool: ToolItem;
  lang?: "bn" | "en";
  isPinned?: boolean;
  onPinChange?: () => void;
}

export default function ToolCard({ tool, lang: propLang, isPinned: propIsPinned, onPinChange }: ToolCardProps) {
  const { lang: appLang } = useApp();
  const lang = propLang || appLang;
  const [internalPinned, setInternalPinned] = useState(false);

  const isPinned = propIsPinned !== undefined ? propIsPinned : internalPinned;

  useEffect(() => {
    if (propIsPinned === undefined && typeof window !== "undefined") {
      const pins = JSON.parse(localStorage.getItem("toolkaj_pinned_tools") || "[]");
      setInternalPinned(pins.includes(tool.id));
    }
  }, [tool.id, propIsPinned]);

  const togglePin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined") {
      const pins: string[] = JSON.parse(localStorage.getItem("toolkaj_pinned_tools") || "[]");
      let updated: string[];
      if (pins.includes(tool.id)) {
        updated = pins.filter((id) => id !== tool.id);
        setInternalPinned(false);
      } else {
        updated = [...pins, tool.id];
        setInternalPinned(true);
      }
      localStorage.setItem("toolkaj_pinned_tools", JSON.stringify(updated));
      if (onPinChange) onPinChange();
    }
  };

  return (
    <div className="relative group bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top accent gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Header row with icon and pin button */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-950/60 dark:via-purple-950/50 dark:to-pink-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/80 dark:border-indigo-900/50 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:shadow-indigo-500/20 group-hover:border-indigo-400/50 transition-all duration-300">
            <DynamicIcon name={tool.icon} className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.badge && (
              <span className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-950/60 dark:to-orange-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
                {tool.badge}
              </span>
            )}
            <button
              onClick={togglePin}
              title={isPinned ? "পিন থেকে সরান" : "হাতের কাছে পিন করুন"}
              className={`p-1.5 rounded-xl text-xs transition-all ${
                isPinned
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent"
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${isPinned ? "rotate-45 fill-current" : ""}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <Link href={tool.href} className="focus:outline-none">
          <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1.5 flex items-center justify-between">
            <span>{lang === "bn" ? tool.titleBn : tool.titleEn}</span>
            <ArrowUpRight className="w-4 h-4 text-indigo-500 dark:text-indigo-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {lang === "bn" ? tool.descBn : tool.descEn}
        </p>
      </div>

      {/* Footer info & CTA */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
          {lang === "bn" ? tool.categoryBn : tool.categoryEn}
        </span>
        <Link
          href={tool.href}
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform"
        >
          <span>{lang === "bn" ? "ব্যবহার করুন" : "Open Tool"}</span>
          <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
