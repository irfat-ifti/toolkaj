"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function AboutPage() {
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
            {lang === "bn" ? "আমাদের সম্পর্কে" : "About Us"}
          </span>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-8 sm:p-12 shadow-sm space-y-6">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {lang === "bn" ? "ToolKaj (টুলকাজ) সম্পর্কে" : "About ToolKaj"}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
            {lang === "bn" ? (
              <>
                <strong>ToolKaj</strong> হলো একটি আধুনিক, দ্রুতগামী এবং সর্বজনীন ওয়েব ইউটিলিটি প্ল্যাটফর্ম। প্রতিদিন সাধারণ মানুষ, শিক্ষার্থী ও পেশাজীবীদের বিভিন্ন ধরনের ফাইল কনভার্সন, ফটো এডিটিং, সরকারি চাকরির ফরম্যাটিং এবং ক্যালকুলেটরের প্রয়োজন হয়। আমাদের লক্ষ্য সেই সমস্ত দরকারি টুলস এক জায়গায় এনে সম্পূর্ণ বিনামূল্যে ব্যবহারকারীদের কাছে পৌঁছে দেওয়া।
              </>
            ) : (
              <>
                <strong>ToolKaj</strong> is a modern, privacy-first all-in-one web utility platform. Designed for students, professionals, and daily users, it provides essential tools like PDF manipulation, photo cropping (Teletalk 300x300), Bengali font conversions, and video compression — all directly inside your browser with zero server uploads and 100% free access.
              </>
            )}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700">
              <Zap className="w-6 h-6 text-indigo-600 mb-2" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                {lang === "bn" ? "গতি ও কর্মদক্ষতা" : "High Speed & Efficiency"}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {lang === "bn"
                  ? "সব টুলস সরাসরি ব্রাউজারে চালিত হয়, তাই কোনো আপলোড বা ডাউনলোডের দীর্ঘসূত্রতা নেই।"
                  : "All tools run locally inside your browser with instant client-side execution."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mb-2" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                {lang === "bn" ? "১০০% গোপনীয়তা" : "100% Privacy Guarantee"}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {lang === "bn"
                  ? "আপনার মূল্যবান ফাইল বা ব্যক্তিগত তথ্য কোনো সার্ভারে সংরক্ষণ বা দেখা হয় না।"
                  : "Your confidential files and images never leave your machine or get stored anywhere."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-700">
              <Sparkles className="w-6 h-6 text-purple-600 mb-2" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                {lang === "bn" ? "সর্বদা বিনামূল্যে" : "Forever Free"}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {lang === "bn"
                  ? "কোনো সাবস্ক্রিপশন, ক্রেডিট কার্ড বা লগইনের প্রয়োজন নেই। আনলিমিটেড ব্যবহার করুন।"
                  : "No subscription plans, hidden credits, or signups. Unlimited usage for everyone."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
