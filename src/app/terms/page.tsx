"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function TermsPage() {
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
            {lang === "bn" ? "শর্তাবলী" : "Terms"}
          </span>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-8 sm:p-12 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {lang === "bn" ? "ব্যবহারের শর্তাবলী (Terms & Conditions)" : "Terms of Service"}
              </h1>
              <p className="text-xs text-slate-400">
                {lang === "bn" ? "কার্যকরী তারিখ: অক্টোবর ২০২৬" : "Effective Date: October 2026"}
              </p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === "bn" ? "১. সেবার শর্ত" : "1. Terms of Acceptance"}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === "bn"
                ? "ToolKaj প্ল্যাটফর্মের যেকোনো সেবা ব্যবহার করার মাধ্যমে আপনি এই শর্তাবলীতে সম্মতি প্রদান করছেন। সমস্ত টুলস ব্যক্তিগত ও পেশাগত কাজের সহায়ক হিসেবে 'যেমন আছে তেমনই' (as-is) সরবরাহ করা হয়েছে।"
                : "By accessing and using ToolKaj, you agree to be bound by these terms. All utilities and tools are provided 'as-is' for personal, educational, and professional productivity."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === "bn" ? "২. সঠিক ও নৈতিক ব্যবহার" : "2. Lawful & Ethical Use"}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === "bn"
                ? "ব্যবহারকারী কোনো অনৈতিক, ক্ষতিকর বা আইনবহির্ভূত কাজে (যেমন: ভুয়া পরিচয়পত্র তৈরি বা কাউকে হয়রানি করার উদ্দেশ্যে) আমাদের টুলস ব্যবহার করতে পারবেন না।"
                : "You agree not to use ToolKaj for unlawful, fraudulent, or harmful purposes, including creating falsified identification documents or unauthorized media manipulation."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === "bn" ? "৩. দায়বদ্ধতার সীমাবদ্ধতা" : "3. Limitation of Liability"}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === "bn"
                ? "ToolKaj কোনো ব্যবহারকারীর ভুল ইনপুট বা ত্রুটিপূর্ণ ফাইলের কারণে সৃষ্ট সমস্যার জন্য কোনো আর্থিক বা আইনি দায় বহন করবে না।"
                : "ToolKaj and its maintainers shall not be liable for any direct or indirect losses resulting from client-side conversion errors, file mismatches, or third-party service interruptions."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
