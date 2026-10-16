"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, ShieldCheck, Heart, Users } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { TOOLS_DATA } from "@/lib/tools-data";
import ToolSeoSection from "@/components/ToolSeoSection";
import DashboardClient from "@/components/DashboardClient";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function InstagramBoosterPage() {
  const { lang } = useApp();
  const tool = TOOLS_DATA.find((t) => t.slug === "social/instagram-booster")!;

  return (
    <div className="w-full py-8 sm:py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-indigo-600 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {lang === "bn" ? "হোম" : "Home"}
          </Link>
          <span>/</span>
          <Link href="/category/social" className="hover:text-indigo-600 transition-colors">
            {lang === "bn" ? "সোশ্যাল মিডিয়া" : "Social Media"}
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            {lang === "bn" ? "ইনস্টাগ্রাম অটোলাইকার ও ফলোয়ার" : "Instagram Booster"}
          </span>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-amber-500/10 border border-pink-200 dark:border-pink-900/50 text-pink-700 dark:text-pink-300 text-xs font-bold shadow-sm">
            <InstagramIcon className="w-4 h-4 text-pink-600" />
            <span>১০০% ফ্রি ও নিরাপদ পেয়ার-টু-পেয়ার এক্সচেঞ্জ</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {lang === "bn" ? "ইনস্টাগ্রাম অটোলাইকার ও ফলোয়ার এক্সচেঞ্জ" : "Instagram Likes & Follower Exchange"}
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            {lang === "bn"
              ? "কোনো পাসওয়ার্ড ছাড়াই কেবল ইউজারনেম দিয়ে আসল ইনস্টাগ্রাম ব্যবহারকারীদের সাথে পোস্ট লাইক ও ফলোয়ার বিনিময় করুন। কঠোর ওনারশিপ গার্ডসহ সম্পূর্ণ বিনামূল্যে।"
              : "Grow authentic Instagram post likes and real followers with zero passwords. Passwordless login, concurrency locking, and strict ownership verification."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-900">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>পাসওয়ার্ড ফ্রি</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 font-semibold border border-rose-200 dark:border-rose-900">
              <Heart className="w-3.5 h-3.5 text-rose-600" />
              <span>আসল পোস্ট লাইক</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-900">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>রিয়েল ফলোয়ার</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>১০ বোনাস ক্রেডিট</span>
            </span>
          </div>
        </div>

        {/* Dashboard Client Component */}
        <DashboardClient />

        {/* 100/100 SEO & Rich Structured Content Section */}
        {tool && <ToolSeoSection tool={tool} />}
      </div>
    </div>
  );
}
