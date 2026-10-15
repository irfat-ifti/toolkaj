"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function PrivacyPolicyPage() {
  const { lang } = useApp();

  return (
    <div className="w-full py-16 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-indigo-600 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {lang === "bn" ? "হোম" : "Home"}
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            {lang === "bn" ? "গোপনীয়তা নীতি" : "Privacy Policy"}
          </span>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-8 sm:p-12 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {lang === "bn" ? "গোপনীয়তা নীতিমালা (Privacy Policy)" : "Privacy Policy"}
              </h1>
              <p className="text-xs text-slate-400">
                {lang === "bn" ? "সর্বশেষ আপডেট: অক্টোবর ২০২৬" : "Last updated: October 2026"}
              </p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === "bn" ? "১. ফাইল সুরক্ষা ও লোকাল প্রসেসিং" : "1. File Safety & 100% Client-Side Processing"}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === "bn"
                ? "ToolKaj ব্যবহারকারীদের গোপনীয়তাকে সর্বোচ্চ অগ্রাধিকার দেয়। আমাদের সমস্ত কনভার্সন এবং প্রসেসিং টুলস (যেমন: PDF কম্প্রেস, ইমেজ রিসাইজ, এনআইডি ফরম্যাট) ক্লায়েন্ট সাইড ওয়েব এপিআই (HTML5 Canvas ও WebAssembly) দ্বারা চালিত। আপনার আপলোড করা ফাইল কোনো দূরবর্তী সার্ভারে পাঠানো বা স্থায়ীভাবে সংরক্ষণ করা হয় না।"
                : "ToolKaj puts user privacy first. All file processing, image compression, PDF joins, and media manipulations execute directly inside your browser. Your files and photos are never uploaded, analyzed, or stored on remote servers."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === "bn" ? "২. বেনামী তথ্যের ব্যবহার" : "2. Anonymous Analytics"}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === "bn"
                ? "আমরা প্ল্যাটফর্মের সার্বিক পারফরম্যান্স বিশ্লেষণ করতে Google Analytics / Firebase Analytics-এর মাধ্যমে সাধারণ ট্রাফিক পরিসংখ্যান (যেমন: কোন টুলটি বেশি ব্যবহৃত হচ্ছে) সংগ্রহ করতে পারি। এতে কোনো ব্যক্তিগত তথ্য বা নথির অংশ থাকে না।"
                : "We may monitor basic aggregated anonymous usage statistics via Firebase / Google Analytics (such as total pageviews or tool popularity) to improve user experience. No personal identifying information or file content is ever captured."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === "bn" ? "৩. কুকিজ ও লোকাল স্টোরেজ" : "3. LocalStorage Preferences"}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === "bn"
                ? "আপনার থিম পছন্দ (Dark/Light mode), পিন করা প্রিয় টুলস এবং ভাষা সেটিং মনে রাখার জন্য ব্রাউজারের লোকাল স্টোরেজ (LocalStorage) ব্যবহার করা হয়।"
                : "Browser LocalStorage is used exclusively on your device to persist your theme preference (Dark/Light mode), pinned favorite tools, and selected interface language."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
