"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pin,
  TrendingUp,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { TOOLS_DATA, CATEGORIES, ToolItem } from "@/lib/tools-data";
import ToolCard from "@/components/ToolCard";
import DynamicIcon from "@/components/DynamicIcon";
import { HOME_FAQS } from "@/lib/seo-config";
import { useApp } from "@/context/AppContext";
import { LogoIcon } from "@/components/Logo";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { lang, t } = useApp();
  const [pinnedToolIds, setPinnedToolIds] = useState<string[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const categoryScrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollState = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollCategories = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const offset = direction === "left" ? -300 : 300;
      categoryScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
      setTimeout(checkScrollState, 350);
    }
  };

  useEffect(() => {
    // Initial pins
    loadPinnedTools();

    // Check scroll capability
    checkScrollState();
    const el = categoryScrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScrollState, { passive: true });
      window.addEventListener("resize", checkScrollState);
      return () => {
        el.removeEventListener("scroll", checkScrollState);
        window.removeEventListener("resize", checkScrollState);
      };
    }
  }, []);

  const loadPinnedTools = () => {
    if (typeof window !== "undefined") {
      const pins = JSON.parse(localStorage.getItem("toolkaj_pinned_tools") || "[]");
      setPinnedToolIds(pins);
    }
  };

  // Filter tools
  const filteredTools = TOOLS_DATA.filter((tool) => {
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch =
      tool.titleBn.toLowerCase().includes(q) ||
      tool.titleEn.toLowerCase().includes(q) ||
      tool.descBn.toLowerCase().includes(q) ||
      tool.descEn.toLowerCase().includes(q) ||
      tool.keywords.some((k) => k.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const pinnedTools = TOOLS_DATA.filter((t) => pinnedToolIds.includes(t.id));
  const featuredTools = TOOLS_DATA.filter((t) => t.featured);

  return (
    <div className="w-full">
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 via-purple-50/30 to-white dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-950 py-16 sm:py-24 border-b border-slate-200/60 dark:border-slate-800">
        {/* Glow ambient background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/15 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-purple-400/15 dark:bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-indigo-200/80 dark:border-indigo-800/80 shadow-sm mb-6 animate-fade-in group hover:border-indigo-400 transition-colors">
            <LogoIcon size={18} className="shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              {lang === "bn" ? "ToolKaj (টুলকাজ) — ৫০+ ফ্রি অনলাইন টুলস কোনো লগইন ছাড়াই" : "ToolKaj — 50+ Free Web Tools — No Login Required"}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-[1.15]">
            {lang === "bn" ? (
              <>
                আপনার সব ডিজিটাল কাজ ও অনলাইন টুলস{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                  এক জায়গায়
                </span>
              </>
            ) : (
              <>
                All Your Daily Digital Tools & Tasks{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                  in One Place
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {lang === "bn"
              ? "PDF কম্প্রেস, এনআইডি ফরম্যাট, সরকারি চাকরির ছবি রিসাইজ (৩০০x৩০০), বিজয় ইউনিকোড কনভার্ট, ইউটিউব থাম্বনেইল ডাউনলোড ও আরও অনেক কিছু — ১০০% নিরাপদ ও ফ্রি।"
              : "Compress PDF, resize govt job photos (300x300), convert Bijoy to Unicode, download HD YouTube thumbnails, generate QR codes, and more directly in your browser."}
          </p>

          {/* Large Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative flex items-center shadow-lg rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2">
              <Search className="w-5 h-5 text-indigo-500 ml-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === "bn"
                    ? "কী কাজ করতে চান লিখুন... (যেমন: pdf compress, 300x300, ছবি, cv, youtube)"
                    : "Search tools... (e.g. compress pdf, govt job, cv, bijoy, youtube)"
                }
                className="w-full bg-transparent px-3 py-2 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-3 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {lang === "bn" ? "মুছুন" : "Clear"}
                </button>
              )}
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{lang === "bn" ? "১০০% ব্রাউজার প্রসেসিং" : "100% Client-Side Processing"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-500" />
              <span>{lang === "bn" ? "গোপনীয় ও নিরাপদ" : "Secure & Private"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{lang === "bn" ? "তাৎক্ষণিক ডাউনলোড" : "Instant Processing"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- PINNED TOOLS (IF ANY) --- */}
      {pinnedTools.length > 0 && (
        <section className="py-8 bg-indigo-50/40 dark:bg-slate-900/40 border-b border-indigo-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Pin className="w-4 h-4 text-indigo-600 dark:text-indigo-400 rotate-45" />
                <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                  {lang === "bn" ? "আপনার পিন করা টুলস" : "Your Pinned Tools"}
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                {pinnedTools.length} {lang === "bn" ? "টি টুল পিন করা আছে" : "tools pinned"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pinnedTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  lang={lang}
                  isPinned={true}
                  onPinChange={loadPinnedTools}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- FEATURED SPOTLIGHT TOOLS --- */}
      {!searchQuery && selectedCategory === "all" && (
        <section className="py-12 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {lang === "bn" ? "জনপ্রিয় ও প্রয়োজনীয় টুলস" : "Featured Most Popular Tools"}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {lang === "bn"
                    ? "প্রতিদিন হাজারো ব্যবহারকারীর সবচেয়ে বেশি কাজে লাগা টুলসমূহ"
                    : "Top utilities used by thousands of daily users"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  lang={lang}
                  isPinned={pinnedToolIds.includes(tool.id)}
                  onPinChange={loadPinnedTools}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- ALL TOOLS BROWSER & CATEGORY TABS --- */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900/60" id="all-tools">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {lang === "bn" ? "সবগুলো ক্যাটাগরি ও টুলস" : "Explore All Categories & Tools"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {lang === "bn"
                ? "যেকোনো ক্যাটাগরিতে ক্লিক করে আপনার পছন্দের টুলটি বেছে নিন"
                : "Filter by category to find the exact tool you need"}
            </p>
          </div>

          {/* Slideable Category Filter Bar with Nav Chevrons */}
          <div className="relative max-w-5xl mx-auto mb-8 px-1 sm:px-4">
            {/* Left Arrow Button */}
            <button
              type="button"
              onClick={() => scrollCategories("left")}
              className={`absolute -left-1 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 dark:bg-slate-800/95 shadow-md border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 active:scale-95 transition-all focus:outline-none ${
                !canScrollLeft ? "opacity-0 pointer-events-none scale-75" : "opacity-100 scale-100"
              }`}
              aria-label="Previous categories"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Scrollable Container (pure horizontal scroll, never clips the left items) */}
            <div
              ref={categoryScrollRef}
              className="overflow-x-auto scroll-smooth no-scrollbar py-2 px-6 sm:px-8 touch-pan-x"
            >
              <div className="flex items-center gap-2.5 w-max justify-start">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
                      selectedCategory === cat.id
                        ? "bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30 scale-105"
                        : "bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-900"
                    }`}
                  >
                    <DynamicIcon name={cat.icon} className="w-4 h-4" />
                    <span>{lang === "bn" ? cat.nameBn : cat.nameEn}</span>
                    {cat.count && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          selectedCategory === cat.id
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {cat.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Arrow Button */}
            <button
              type="button"
              onClick={() => scrollCategories("right")}
              className={`absolute -right-1 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 dark:bg-slate-800/95 shadow-md border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 active:scale-95 transition-all focus:outline-none ${
                !canScrollRight ? "opacity-0 pointer-events-none scale-75" : "opacity-100 scale-100"
              }`}
              aria-label="Next categories"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Filter count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              {lang === "bn"
                ? `মোট ${filteredTools.length}টি টুল পাওয়া গেছে`
                : `Showing ${filteredTools.length} tools`}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {lang === "bn" ? "ফিল্টার রিসেট করুন" : "Reset Filter"}
              </button>
            )}
          </div>

          {/* Tools Grid */}
          {filteredTools.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
              <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
                {lang === "bn" ? "কোনো টুল খুঁজে পাওয়া যায়নি!" : "No tools found!"}
              </p>
              <p className="text-sm text-slate-500 mt-2">
                {lang === "bn"
                  ? "অন্য শব্দ বা ক্যাটাগরি দিয়ে চেষ্টা করুন।"
                  : "Try searching with a different keyword or selecting 'All Tools'."}
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow hover:bg-indigo-700"
              >
                {lang === "bn" ? "সব টুলস দেখুন" : "View All Tools"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  lang={lang}
                  isPinned={pinnedToolIds.includes(tool.id)}
                  onPinChange={loadPinnedTools}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- WHY TOOLKAJ (Features comparison) --- */}
      <section className="py-16 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              {lang === "bn" ? "কেন ToolKaj বেছে নেবেন" : "Why Choose ToolKaj"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              {lang === "bn" ? "সহজ ব্যবহার, কোনো ঝামেলা নেই" : "Fast, Secure & Always Free"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {lang === "bn"
                ? "আমাদের প্ল্যাটফর্ম আধুনিক ওয়েব প্রযুক্তিতে তৈরি যা কোনো সার্ভার আপলোড ছাড়াই দ্রুততম সময়ে কাজ সম্পন্ন করে।"
                : "Engineered with client-side Web APIs for zero latency and absolute document privacy."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                {lang === "bn" ? "শতভাগ গোপনীয়তা" : "100% Privacy Guarantee"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === "bn"
                  ? "আপনার সংবেদনশীল ছবি, এনআইডি বা ডকুমেন্ট কোনো রিমোট সার্ভারে আপলোড হয় না। ব্রাউজার বন্ধ করলেই মেমোরি খালি হয়ে যায়।"
                  : "All processing occurs directly within your browser. Sensitive documents never leave your machine."}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-purple-50/50 dark:bg-slate-900 border border-purple-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                {lang === "bn" ? "তাৎক্ষণিক স্পিড" : "Zero Wait Time"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === "bn"
                  ? "কোনো কিউ বা আপলোড-ডাউনলোড বিলম্ব নেই। ফাইল সিলেক্ট করার সাথে সাথেই কয়েক মিলি-সেকেন্ডে প্রসেস শেষ হয়ে যায়।"
                  : "No upload queues or bandwidth throttling. High speed operations powered by your own CPU."}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-slate-900 border border-emerald-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center mb-4">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                {lang === "bn" ? "প্রিন্ট ও অফিস রেডি" : "Print & Office Standard"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === "bn"
                  ? "বাংলাদেশ সরকারের টেলিটক চাকরির নিয়ম (৩০০x৩০০ ছবি ও ৩০০x৮০ স্বাক্ষর) এবং এনআইডি প্রিন্ট মাপের সাথে শতভাগ নিখুঁত।"
                  : "Tailored to official Bangladesh standard formats (Teletalk 300x300 photo, NID A4 PDF templates)."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION (Crucial for Google Rich Snippets SEO) --- */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
              {lang === "bn" ? "সাধারণ জিজ্ঞাসা (FAQ)" : "Frequently Asked Questions"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              {lang === "bn"
                ? "টুলকাজ সম্পর্কে সবচেয়ে বেশি জিজ্ঞাসিত প্রশ্নের সমাধান"
                : "Answers to common questions about ToolKaj"}
            </p>
          </div>

          <div className="space-y-3">
            {HOME_FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
                  >
                    <span>{lang === "bn" ? (faq.qBn || faq.q) : (faq.qEn || faq.q)}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-indigo-600" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/60 pt-3">
                      {lang === "bn" ? (faq.aBn || faq.a) : (faq.aEn || faq.a)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION / FREE GUARANTEE --- */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">
            {lang === "bn" ? "আজই শুরু করুন — সম্পূর্ণ বিনামূল্যে" : "Start Using ToolKaj Today — 100% Free"}
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 max-w-xl mx-auto mb-8">
            {lang === "bn"
              ? "কোনো সাবস্ক্রিপশন নেই, কোনো গোপন চার্জ নেই। আপনার প্রয়োজনীয় টুলটি বেছে নিন এবং এখনই কাজ শুরু করুন।"
              : "No subscription fees or hidden limits. Choose your tool and boost your productivity now."}
          </p>
          <a
            href="#all-tools"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-indigo-600 font-bold text-sm shadow-xl hover:bg-indigo-50 hover:scale-105 transition-all"
          >
            <span>{lang === "bn" ? "টুলস দেখুন" : "Browse Tools"}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
