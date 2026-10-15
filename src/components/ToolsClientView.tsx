"use client";

import React from "react";
import Link from "next/link";
import { TOOLS_DATA, CATEGORIES } from "@/lib/tools-data";
import ToolCard from "@/components/ToolCard";
import { ArrowLeft, Sparkles, ArrowRight } from "lucide-react";
import DynamicIcon from "@/components/DynamicIcon";
import { useApp } from "@/context/AppContext";

export default function ToolsClientView() {
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
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            {lang === "bn" ? "সব টুলস" : "All Tools"}
          </span>
        </div>

        {/* Title */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />{" "}
            {lang === "bn" ? "৫০+ ফ্রি টুলস" : "50+ Free Web Tools"}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {lang === "bn" ? "সবগুলো অনলাইন টুলস ডিরেক্টরি" : "All Online Tools Directory"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
            {lang === "bn"
              ? "নিচে ক্যাটাগরিভিত্তিক সব টুলস সাজানো রয়েছে। কোনো সাইন-আপ বা ইনস্টলেশন ছাড়াই আপনার ব্রাউজার থেকে সরাসরি ব্যবহার করুন।"
              : "Explore our comprehensive directory of 50+ free web utilities organized by category. 100% browser-based and secure."}
          </p>
        </div>

        {/* Category grouped view */}
        <div className="space-y-12">
          {CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
            const catTools = TOOLS_DATA.filter((t) => t.category === cat.id);
            if (catTools.length === 0) return null;

            return (
              <div key={cat.id} className="border-t border-slate-200 dark:border-slate-800 pt-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center shrink-0">
                      <DynamicIcon name={cat.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {lang === "bn" ? cat.nameBn : cat.nameEn}{" "}
                        <span className="text-xs font-normal text-slate-400">
                          ({lang === "bn" ? cat.nameEn : cat.nameBn})
                        </span>
                      </h2>
                      <span className="text-xs text-slate-500">
                        {lang === "bn" ? `${catTools.length}টি অনলাইন টুল` : `${catTools.length} online tools`}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/category/${cat.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>{lang === "bn" ? "ক্যাটাগরি পেজ" : "View Category"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {catTools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} lang={lang} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
