"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  ExternalLink,
  Compass,
  FileCheck,
  FileText,
  Building,
  GraduationCap,
  Shield,
  CreditCard,
  Briefcase,
  Zap,
  Award,
  ShoppingBag,
  Globe,
  Mail,
  Smartphone,
  Plane,
  Train,
  Bus,
  Stethoscope,
  HeartPulse,
  Copy,
  Check,
  Bookmark,
  Sparkles,
  X,
  LayoutGrid,
  List as ListIcon,
  ShieldCheck,
  Share2,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import {
  ALL_DORKARI_LINKS,
  DORKARI_CATEGORIES,
  DorkariLinkItem,
} from "@/lib/dorkari-links-data";

// Icon mapping helper
function renderCategoryIcon(name: string, className = "w-5 h-5") {
  switch (name) {
    case "Building":
      return <Building className={className} />;
    case "Plane":
      return <Plane className={className} />;
    case "GraduationCap":
      return <GraduationCap className={className} />;
    case "ShoppingBag":
      return <ShoppingBag className={className} />;
    case "FileCheck":
      return <FileCheck className={className} />;
    case "FileText":
      return <FileText className={className} />;
    case "Shield":
      return <Shield className={className} />;
    case "CreditCard":
      return <CreditCard className={className} />;
    case "Briefcase":
      return <Briefcase className={className} />;
    case "Zap":
      return <Zap className={className} />;
    case "Award":
      return <Award className={className} />;
    case "Globe":
      return <Globe className={className} />;
    case "Mail":
      return <Mail className={className} />;
    case "Smartphone":
      return <Smartphone className={className} />;
    case "Train":
      return <Train className={className} />;
    case "Bus":
      return <Bus className={className} />;
    case "Stethoscope":
      return <Stethoscope className={className} />;
    case "HeartPulse":
      return <HeartPulse className={className} />;
    default:
      return <Compass className={className} />;
  }
}

// Convert numbers to Bengali digits
function toBnDigits(num: number): string {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .split("")
    .map((d) => bnDigits[parseInt(d, 10)] || d)
    .join("");
}

export default function DorkariLinksPage() {
  const { lang } = useApp();
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load saved favorites from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("toolkaj_fav_links");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch {
      // fallback
    }
  }, []);

  // Save favorites to localStorage
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      try {
        localStorage.setItem("toolkaj_fav_links", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Copy link handler
  const handleCopy = (url: string, title: string, id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setToastMessage(lang === "bn" ? `"${title}" লিংকটি কপি করা হয়েছে!` : `Copied "${title}" link!`);
    setTimeout(() => setCopiedId(null), 2000);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: ALL_DORKARI_LINKS.length,
      sorkari: ALL_DORKARI_LINKS.filter((l) => l.category === "sorkari").length,
      visa: ALL_DORKARI_LINKS.filter((l) => l.category === "visa").length,
      education: ALL_DORKARI_LINKS.filter((l) => l.category === "education").length,
      services: ALL_DORKARI_LINKS.filter((l) => l.category === "services").length,
      favorites: favorites.length,
    };
    return counts;
  }, [favorites]);

  // Filtering logic
  const filteredLinks = useMemo(() => {
    return ALL_DORKARI_LINKS.filter((item) => {
      // Category match
      let matchesCat = true;
      if (selectedCat === "favorites") {
        matchesCat = favorites.includes(item.id);
      } else if (selectedCat !== "all") {
        matchesCat = item.category === selectedCat;
      }

      if (!matchesCat) return false;

      // Query match
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;

      const titleBnMatch = item.titleBn.toLowerCase().includes(q);
      const titleEnMatch = item.titleEn.toLowerCase().includes(q);
      const descBnMatch = item.descBn.toLowerCase().includes(q);
      const descEnMatch = item.descEn.toLowerCase().includes(q);
      const domainMatch = item.domain.toLowerCase().includes(q);
      const tagsMatch = item.tags.some((t) => t.toLowerCase().includes(q));

      return titleBnMatch || titleEnMatch || descBnMatch || descEnMatch || domainMatch || tagsMatch;
    });
  }, [selectedCat, searchQuery, favorites]);

  return (
    <div className="w-full py-8 md:py-12 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link
            href="/"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {lang === "bn" ? "হোম" : "Home"}
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">
            {lang === "bn" ? "নাগরিক ডিরেক্টরি" : "Citizen Directory"}
          </span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">
            {lang === "bn" ? "দরকারি লিংকসমূহ" : "Essential Links"}
          </span>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 mb-8 shadow-xl border border-indigo-500/20">
          {/* Subtle Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
              <span>
                {lang === "bn"
                  ? "৭৯+ ভেরিফায়েড সরকারি ও নাগরিক সেবা পোর্টাল"
                  : "79+ Verified Bangladesh Citizen & Govt Portals"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3 leading-tight">
              {lang === "bn" ? (
                <>
                  দরকারি <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">সরকারি ও নাগরিক</span> লিংকসমূহ
                </>
              ) : (
                <>
                  Essential <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">Govt & Citizen</span> Web Directory
                </>
              )}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              {lang === "bn"
                ? "এনআইডি, ই-পাসপোর্ট, জন্ম ও মৃত্যু নিবন্ধন, জমির খতিয়ান, আয়কর রিটার্ন, শিক্ষাবোর্ড রেজাল্ট, ভিসা ও প্রবাসীদের প্রয়োজনীয় সকল অফিসিয়াল পোর্টাল লিংক এক জায়গায়।"
                : "Official, verified links for Bangladesh NID, e-Passport, Birth & Death Registration, Land e-Porcha, Tax e-Return, Board Results, and Expatriate Services."}
            </p>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <Building className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">{lang === "bn" ? "৩৮টি" : "38"}</div>
                  <div className="text-[11px] text-slate-300">{lang === "bn" ? "সরকারি পোর্টাল" : "Govt Portals"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <Plane className="w-4 h-4 text-sky-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">{lang === "bn" ? "১৫টি" : "15"}</div>
                  <div className="text-[11px] text-slate-300">{lang === "bn" ? "ভিসা ও বিদেশ" : "Visa & Abroad"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">{lang === "bn" ? "১৪টি" : "14"}</div>
                  <div className="text-[11px] text-slate-300">{lang === "bn" ? "শিক্ষা ও রেজাল্ট" : "Education & Result"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">{lang === "bn" ? "১২টি" : "12"}</div>
                  <div className="text-[11px] text-slate-300">{lang === "bn" ? "টিকেট ও সেবা" : "Daily & Services"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search, Categories & View Control Bar */}
        <div className="sticky top-20 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === "bn"
                    ? "যেকোনো সেবা বা লিংক খুঁজুন... (যেমন: জন্ম নিবন্ধন, nid, পাসপোর্ট, খতিয়ান, ssc রেজাল্ট, ট্রেনের টিকিট)"
                    : "Search 79+ citizen portals & links... (e.g. nid, passport, khatian, result, railway)"
                }
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View Mode Toggle & Counter */}
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {lang === "bn" ? (
                  <>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {toBnDigits(filteredLinks.length)}
                    </span>
                    টি লিংক প্রদর্শিত
                  </>
                ) : (
                  <>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {filteredLinks.length}
                    </span>{" "}
                    links shown
                  </>
                )}
              </div>

              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setViewMode("grid")}
                  title={lang === "bn" ? "গ্রিড ভিউ" : "Grid View"}
                  className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  title={lang === "bn" ? "লিস্ট ভিউ" : "List View"}
                  className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === "list"
                      ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
            {DORKARI_CATEGORIES.map((cat) => {
              const isSelected = selectedCat === cat.id;
              const count = categoryCounts[cat.id] ?? 0;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 scale-[1.02]"
                      : "bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/50"
                  }`}
                >
                  {cat.id === "all" && <Compass className="w-3.5 h-3.5" />}
                  {cat.id === "sorkari" && <Building className="w-3.5 h-3.5" />}
                  {cat.id === "visa" && <Plane className="w-3.5 h-3.5" />}
                  {cat.id === "education" && <GraduationCap className="w-3.5 h-3.5" />}
                  {cat.id === "services" && <ShoppingBag className="w-3.5 h-3.5" />}
                  {cat.id === "favorites" && <Bookmark className="w-3.5 h-3.5" />}

                  <span>{lang === "bn" ? cat.labelBn : cat.labelEn}</span>

                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {lang === "bn" ? toBnDigits(count) : count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Section */}
        {filteredLinks.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center my-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center mb-4">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
              {lang === "bn" ? "কোনো লিংক পাওয়া যায়নি" : "No links found"}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              {selectedCat === "favorites"
                ? lang === "bn"
                  ? "আপনার এখনও কোনো ফেভারিট লিংক সেভ করা নেই। লিংকের পাশে থাকা স্টার আইকনে ক্লিক করে পছন্দের লিংকগুলো এখানে সংরক্ষণ করুন।"
                  : "You have not bookmarked any links yet. Click the bookmark icon on any card to save it here."
                : lang === "bn"
                ? `"${searchQuery}" এর সাথে মিলে এমন কোনো সরকারি সেবা বা লিংক পাওয়া যায়নি। বানান পরিবর্তন করে চেষ্টা করুন।`
                : `No portals found matching "${searchQuery}". Please check the keyword and try again.`}
            </p>
            {(searchQuery || selectedCat !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCat("all");
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                {lang === "bn" ? "সব লিংক দেখুন" : "View All 79 Links"}
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          /* ================= GRID VIEW ================= */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLinks.map((item) => {
              const isFav = favorites.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="group relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Category Badge + Serial + Actions */}
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                          #{lang === "bn" ? toBnDigits(item.sl) : item.sl}
                        </span>

                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            item.category === "sorkari"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50"
                              : item.category === "visa"
                              ? "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/50"
                              : item.category === "education"
                              ? "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border border-violet-200/50 dark:border-violet-800/50"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50"
                          }`}
                        >
                          {lang === "bn" ? item.categoryBn : item.categoryEn}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleCopy(item.url, item.titleBn, item.id, e)}
                          title={lang === "bn" ? "লিংক কপি করুন" : "Copy URL"}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          onClick={(e) => toggleFavorite(item.id, e)}
                          title={isFav ? (lang === "bn" ? "সেভ বাতিল" : "Remove bookmark") : (lang === "bn" ? "সেভ করুন" : "Bookmark")}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isFav
                              ? "text-amber-500 bg-amber-50 dark:bg-amber-950/50"
                              : "text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 ${isFav ? "fill-amber-500" : ""}`} />
                        </button>
                      </div>
                    </div>

                    {/* Title & Icon */}
                    <div className="flex items-start gap-3 mb-2.5">
                      <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200">
                        {renderCategoryIcon(item.iconName, "w-5 h-5")}
                      </div>

                      <div>
                        <h2 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                          {item.titleBn}
                        </h2>
                        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                          {item.titleEn}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                      {lang === "bn" ? item.descBn : item.descEn}
                    </p>
                  </div>

                  {/* Bottom: Domain & Visit Button */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[170px]" title={item.domain}>
                      {item.official ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="অফিসিয়াল পোর্টাল" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" title="বিশ্বস্ত সেবা" />
                      )}
                      <span className="truncate font-mono">{item.domain}</span>
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-slate-700 hover:text-white dark:text-slate-300 dark:hover:text-white text-xs font-semibold transition-all group/btn shrink-0"
                    >
                      <span>{lang === "bn" ? "পোর্টাল খুলুন" : "Open Link"}</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ================= COMPACT LIST VIEW ================= */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">{lang === "bn" ? "সেবার নাম" : "Service Name"}</th>
                    <th className="py-3 px-4 hidden md:table-cell">{lang === "bn" ? "ক্যাটাগরি" : "Category"}</th>
                    <th className="py-3 px-4 hidden lg:table-cell">{lang === "bn" ? "বিবরণ" : "Description"}</th>
                    <th className="py-3 px-4">{lang === "bn" ? "অফিসিয়াল ডোমেন" : "Domain"}</th>
                    <th className="py-3 px-4 text-right">{lang === "bn" ? "অ্যাকশন" : "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredLinks.map((item) => {
                    const isFav = favorites.includes(item.id);

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                      >
                        <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                          {lang === "bn" ? toBnDigits(item.sl) : item.sl}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                              {renderCategoryIcon(item.iconName, "w-4 h-4")}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {item.titleBn}
                              </div>
                              <div className="text-[11px] text-slate-400 dark:text-slate-500">
                                {item.titleEn}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 hidden md:table-cell">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.category === "sorkari"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : item.category === "visa"
                                ? "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300"
                                : item.category === "education"
                                ? "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                            }`}
                          >
                            {lang === "bn" ? item.categoryBn : item.categoryEn}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 hidden lg:table-cell text-slate-600 dark:text-slate-400 max-w-xs truncate">
                          {lang === "bn" ? item.descBn : item.descEn}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                            {item.domain}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={(e) => handleCopy(item.url, item.titleBn, item.id, e)}
                              title={lang === "bn" ? "লিংক কপি" : "Copy"}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              {copiedId === item.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={(e) => toggleFavorite(item.id, e)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isFav
                                  ? "text-amber-500 bg-amber-50 dark:bg-amber-950/50"
                                  : "text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                              }`}
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${isFav ? "fill-amber-500" : ""}`} />
                            </button>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
                            >
                              <span>{lang === "bn" ? "খুলুন" : "Open"}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Citizen Safety & Trust Disclaimer Box */}
        <div className="mt-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/50">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                {lang === "bn"
                  ? "নাগরিক তথ্যের নিরাপত্তা ও সুরক্ষার নিশ্চয়তা"
                  : "Citizen Information Security & Official Verification"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === "bn"
                  ? "ToolKaj শুধুমাত্র অফিসিয়াল বাংলাদেশ সরকারি (.gov.bd) ও বিশ্বস্ত প্রতিষ্ঠানগুলোর সঠিক ও ভেরিফায়েড ওয়েব লিংক এক জায়গায় সাজিয়ে ডিরেক্টরি হিসেবে প্রদান করে। কোনো লিংকে ক্লিক করলে আপনি সরাসরি সংশ্লিষ্ট প্রতিষ্ঠানের অফিসিয়াল মূল সার্ভারে প্রবেশ করবেন। ToolKaj ব্যবহারকারীদের কোনো ব্যক্তিগত তথ্য, পাসওয়ার্ড বা ফর্মের ডাটা কখনোই সংরক্ষণ বা ট্র্যাক করে না।"
                  : "ToolKaj provides verified gateway links directly redirecting to official Bangladesh government (.gov.bd) and authentic partner websites. ToolKaj never stores, collects, or accesses any user credentials, form inputs, or personal information."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl text-xs font-semibold border border-white/10 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
