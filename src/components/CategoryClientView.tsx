"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ToolItem } from "@/lib/tools-data";
import ToolCard from "@/components/ToolCard";
import DynamicIcon from "@/components/DynamicIcon";
import { useApp } from "@/context/AppContext";

interface CategoryClientViewProps {
  cat: {
    id: string;
    nameBn: string;
    nameEn: string;
    icon: string;
    count?: number;
  };
  tools: ToolItem[];
}

export default function CategoryClientView({ cat, tools }: CategoryClientViewProps) {
  const { lang } = useApp();

  return (
    <div className="w-full py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-indigo-600 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {lang === "bn" ? "হোম" : "Home"}
          </Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-indigo-600 transition-colors">
            {lang === "bn" ? "টুলস" : "Tools"}
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            {lang === "bn" ? cat.nameBn : cat.nameEn}
          </span>
        </div>

        {/* Category Header */}
        <div className="flex items-center gap-4 mb-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center shrink-0 shadow-sm">
            <DynamicIcon name={cat.icon} className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {lang === "bn" ? cat.nameBn : cat.nameEn}{" "}
              <span className="text-sm font-medium text-slate-400 block sm:inline">
                ({lang === "bn" ? cat.nameEn : cat.nameBn})
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {lang === "bn"
                ? `মোট ${tools.length}টি অনলাইন টুল রয়েছে এই ক্যাটাগরিতে`
                : `Showing ${tools.length} online tools in this category`}
            </p>
          </div>
        </div>

        {/* Grid of Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} lang={lang} />
          ))}
        </div>
      </div>
    </div>
  );
}
