"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  ExternalLink,
  Compass,
  FileCheck,
  Building,
  GraduationCap,
  Shield,
  CreditCard,
  Briefcase,
} from "lucide-react";

interface DorkariLink {
  id: string;
  nameBn: string;
  nameEn: string;
  category: "nid" | "passport" | "land" | "education" | "tax" | "general";
  categoryBn: string;
  url: string;
  descBn: string;
  official: boolean;
}

const DORKARI_LINKS: DorkariLink[] = [
  // NID & Identity
  {
    id: "nid-wing",
    nameBn: "বাংলাদেশ নির্বাচন কমিশন (NID Wing)",
    nameEn: "National Identity Wing (Services)",
    category: "nid",
    categoryBn: "এনআইডি ও পরিচয়পত্র",
    url: "https://services.nidw.gov.bd",
    descBn: "জাতীয় পরিচয়পত্র ডাউনলোড, তথ্য সংশোধন, স্মার্ট কার্ড স্ট্যাটাস ও নতুন ভোটার নিবন্ধন।",
    official: true,
  },
  {
    id: "birth-reg",
    nameBn: "জন্ম ও মৃত্যু নিবন্ধন পোর্টাল",
    nameEn: "Birth and Death Registration (BDRIS)",
    category: "nid",
    categoryBn: "এনআইডি ও পরিচয়পত্র",
    url: "https://bdris.gov.bd",
    descBn: "নতুন জন্ম নিবন্ধন আবেদন, জন্ম সনদ যাচাই ও তথ্য সংশোধনের সরকারি পোর্টাল।",
    official: true,
  },

  // Passport & Immigration
  {
    id: "e-passport",
    nameBn: "বাংলাদেশ ই-পাসপোর্ট অনলাইন পোর্টাল",
    nameEn: "Bangladesh e-Passport Portal",
    category: "passport",
    categoryBn: "পাসপোর্ট ও ইমিগ্রেশন",
    url: "https://epassport.gov.bd",
    descBn: "অনলাইনে ই-পাসপোর্টের আবেদন ফরম পূরণ, পেমেন্ট ও অ্যাপয়েন্টমেন্ট শিডিউলিং।",
    official: true,
  },
  {
    id: "passport-status",
    nameBn: "পাসপোর্ট আবেদনের বর্তমান অবস্থা যাচাই",
    nameEn: "Check e-Passport Application Status",
    category: "passport",
    categoryBn: "পাসপোর্ট ও ইমিগ্রেশন",
    url: "https://epassport.gov.bd/authorization/application-status",
    descBn: "ডেলিভারি স্লিপ বা আবেদন আইডি দিয়ে পাসপোর্টের প্রিন্ট ও ডেলিভারি স্ট্যাটাস দেখুন।",
    official: true,
  },

  // Land & Property
  {
    id: "e-porcha",
    nameBn: "ভূমি সেবা পোর্টাল (ই-পর্চা)",
    nameEn: "Land Services Portal (e-Porcha)",
    category: "land",
    categoryBn: "ভূমি ও খতিয়ান",
    url: "https://eporcha.gov.bd",
    descBn: "অনলাইনে আরএস, সিএস, বিএস ও এসএ খতিয়ানের নকল বা অনলাইন কপি সংগ্রহ।",
    official: true,
  },
  {
    id: "e-namjari",
    nameBn: "ই-নামজারি (Mutation Online)",
    nameEn: "e-Mutation Service",
    category: "land",
    categoryBn: "ভূমি ও খতিয়ান",
    url: "https://mutation.land.gov.bd",
    descBn: "জমি বা ফ্ল্যাটের নামজারি (মিউটেশন) ও জমা খারিজের জন্য অনলাইনে আবেদন।",
    official: true,
  },
  {
    id: "land-tax",
    nameBn: "ভূমি উন্নয়ন কর পোর্টাল",
    nameEn: "Land Development Tax (LD Tax)",
    category: "land",
    categoryBn: "ভূমি ও খতিয়ান",
    url: "https://ldtax.gov.bd",
    descBn: "জমির দাখিলা ও খাজনা অনলাইনে পরিশোধ এবং জমার রসিদ ডাউনলোড।",
    official: true,
  },

  // Education & Results
  {
    id: "edu-board-results",
    nameBn: "বাংলাদেশ শিক্ষা বোর্ড ফলাফল (SSC/HSC/JSC)",
    nameEn: "Education Board Results",
    category: "education",
    categoryBn: "শিক্ষা ও পরীক্ষা",
    url: "http://www.educationboardresults.gov.bd",
    descBn: "এসএসসি, দাখিল, এইচএসসি ও আলিম পরীক্ষার অফিসিয়াল ফলাফল ও মার্কশিট।",
    official: true,
  },
  {
    id: "eboard-results",
    nameBn: "ই-বোর্ড ফলাফল (মার্কশিট সহ)",
    nameEn: "eBoardResults Web Based System",
    category: "education",
    categoryBn: "শিক্ষা ও পরীক্ষা",
    url: "https://eboardresults.com",
    descBn: "রোল ও রেজিস্ট্রেশন নম্বর দিয়ে বিষয়ভিত্তিক পূর্ণাঙ্গ মার্কশিট দেখার ওয়েবসাইট।",
    official: true,
  },
  {
    id: "nu-results",
    nameBn: "জাতীয় বিশ্ববিদ্যালয় ফলাফল পোর্টাল",
    nameEn: "National University Results",
    category: "education",
    categoryBn: "শিক্ষা ও পরীক্ষা",
    url: "http://results.nu.ac.bd",
    descBn: "ডিগ্রী, অনার্স, মাস্টার্স ও প্রফেশনাল কোর্সের পরীক্ষার ফলাফল।",
    official: true,
  },

  // Tax & Business
  {
    id: "e-tin",
    nameBn: "ই-টিআইএন রেজিস্ট্রেশন (NBR)",
    nameEn: "e-TIN Registration (Incometax BD)",
    category: "tax",
    categoryBn: "ট্যাক্স ও বাণিজ্য",
    url: "https://secure.incometax.gov.bd/TINHome",
    descBn: "অনলাইনে নতুন ১২ ডিজিটের ই-টিআইএন সনদ তৈরি ও পুরাতন টিন রি-রেজিস্ট্রেশন।",
    official: true,
  },
  {
    id: "e-return",
    nameBn: "অনলাইন আয়কর রিটার্ন দাখিল (e-Return)",
    nameEn: "e-Return Online Tax Submission",
    category: "tax",
    categoryBn: "ট্যাক্স ও বাণিজ্য",
    url: "https://etaxnbr.gov.bd",
    descBn: "ঘরে বসেই অনলাইনে ব্যক্তিগত ও বাণিজ্যিক আয়কর রিটার্ন জমা দেওয়ার সরকারি পোর্টাল।",
    official: true,
  },
  {
    id: "brta-service",
    nameBn: "বিআরটিএ সেবা পোর্টাল (ড্রাইভিং লাইসেন্স ও ফিটনেস)",
    nameEn: "BRTA Service Portal (BSP)",
    category: "general",
    categoryBn: "সাধারণ ও নাগরিক",
    url: "https://bsp.brta.gov.bd",
    descBn: "ড্রাইভিং লাইসেন্স আবেদন, লার্নার লাইসেন্স, গাড়ির রেজিস্ট্রেশন ও ট্যাক্স টোকেন।",
    official: true,
  },
  {
    id: "police-clearance",
    nameBn: "অনলাইন পুলিশ ক্লিয়ারেন্স সার্টিফিকেট",
    nameEn: "Online Police Clearance",
    category: "general",
    categoryBn: "সাধারণ ও নাগরিক",
    url: "https://pcc.police.gov.bd",
    descBn: "বিদেশে গমন বা চাকরির জন্য পুলিশ ক্লিয়ারেন্স সার্টিফিকেটের অনলাইন আবেদন।",
    official: true,
  },
  {
    id: "bpsc-teletalk",
    nameBn: "বাংলাদেশ সরকারি কর্ম কমিশন (বিপিএসসি)",
    nameEn: "BPSC Teletalk Recruitment",
    category: "general",
    categoryBn: "সাধারণ ও নাগরিক",
    url: "http://bpsc.teletalk.com.bd",
    descBn: "বিসিএস ও নন-ক্যাডার সরকারি চাকরির অনলাইন আবেদন ও প্রবেশপত্র ডাউনলোড।",
    official: true,
  },
  {
    id: "eticket-railway",
    nameBn: "বাংলাদেশ রেলওয়ে ই-টিকিটিং",
    nameEn: "Bangladesh Railway e-Ticketing",
    category: "general",
    categoryBn: "সাধারণ ও নাগরিক",
    url: "https://eticket.railway.gov.bd",
    descBn: "অনলাইনে ট্রেনের ট্রাভেল টিকিট বুকিং ও সিট নির্বাচন।",
    official: true,
  },
];

import { useApp } from "@/context/AppContext";

export default function DorkariLinksPage() {
  const { lang } = useApp();
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", labelBn: "সব লিংক", labelEn: "All Links" },
    { id: "nid", labelBn: "এনআইডি ও জন্ম সনদ", labelEn: "NID & Birth Reg" },
    { id: "passport", labelBn: "পাসপোর্ট", labelEn: "Passport" },
    { id: "land", labelBn: "ভূমি ও খতিয়ান", labelEn: "Land Records" },
    { id: "education", labelBn: "শিক্ষা ও রেজাল্ট", labelEn: "Education & Results" },
    { id: "tax", labelBn: "ট্যাক্স ও ই-টিআইএন", labelEn: "Tax & TIN" },
    { id: "general", labelBn: "বিআরটিএ ও অন্যান্য", labelEn: "BRTA & Services" },
  ];

  const filtered = DORKARI_LINKS.filter((item) => {
    const matchesCat = selectedCat === "all" || item.category === selectedCat;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;

    return (
      matchesCat &&
      (item.nameBn.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        item.descBn.toLowerCase().includes(q) ||
        item.categoryBn.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-indigo-600 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {lang === "bn" ? "হোম" : "Home"}
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            {lang === "bn" ? "দরকারি লিংক (BD Citizen Directory)" : "BD Citizen Portal Directory"}
          </span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />{" "}
            {lang === "bn" ? "সরকারি ও নাগরিক সেবা ডিরেক্টরি" : "Official Govt & Citizen Directory"}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {lang === "bn" ? "দরকারি সরকারি লিংকসমূহ" : "Essential Bangladesh Government Links"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            {lang === "bn"
              ? "এনআইডি, ই-পাসপোর্ট, জন্ম ও মৃত্যু নিবন্ধন, জমির খতিয়ান, আয়কর রিটার্ন এবং শিক্ষা বোর্ডের ভেরিফায়েড অফিশিয়াল পোর্টাল লিংক এক জায়গায়।"
              : "Verified official links for NID, e-Passport, Birth Registration, Land Deeds (Khatian), Tax e-Return, and Education Boards."}
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-8 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-indigo-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === "bn"
                  ? "যেকোনো লিংক বা সেবা খুঁজুন... (যেমন: nid, passport, খতিয়ান, ssc result, brta)"
                  : "Search citizen links & services... (e.g. nid, passport, tax, result, brta)"
              }
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCat(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                  selectedCat === c.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {lang === "bn" ? c.labelBn : c.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {lang === "bn" ? link.categoryBn : link.category.toUpperCase()}
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1.5">
                  {lang === "bn" ? link.nameBn : link.nameEn}
                </h3>
                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-2">
                  {lang === "bn" ? link.nameEn : link.nameBn}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {link.descBn}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>{lang === "bn" ? "অফিসিয়াল পোর্টাল খুলুন" : "Open Official Portal"}</span>
                <span>&rarr;</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
