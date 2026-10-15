"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart } from "lucide-react";
import { SITE_CONFIG } from "@/lib/seo-config";
import { CATEGORIES } from "@/lib/tools-data";
import { useApp } from "@/context/AppContext";
import Logo from "./Logo";

export default function Footer() {
  const { lang, t } = useApp();

  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Logo size="md" lang={lang} />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-sm">
              {t("footerAbout")}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 rounded-xl px-3.5 py-2 w-fit">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{t("privacyNotice")}</span>
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              {lang === "bn" ? "টুল ক্যাটাগরি" : "Tool Categories"}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {CATEGORIES.filter((c) => c.id !== "all").slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.id}`}
                    className="hover:text-white transition-colors"
                  >
                    {lang === "bn" ? cat.nameBn : cat.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tools Col */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              {lang === "bn" ? "জনপ্রিয় টুলস" : "Popular Tools"}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/tools/image/govt-job-resizer" className="hover:text-white transition-colors">
                  {lang === "bn" ? "জব ছবি রিসাইজ (৩০০x৩০০)" : "Govt Job Photo Resizer"}
                </Link>
              </li>
              <li>
                <Link href="/tools/text/bijoy-unicode" className="hover:text-white transition-colors">
                  {lang === "bn" ? "বিজয় টু ইউনিকোড" : "Bijoy to Unicode"}
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf/merge" className="hover:text-white transition-colors">
                  {lang === "bn" ? "পিডিএফ মার্জ" : "PDF Merge"}
                </Link>
              </li>
              <li>
                <Link href="/tools/social/youtube-thumbnail" className="hover:text-white transition-colors">
                  {lang === "bn" ? "ইউটিউব থাম্বনেইল" : "YouTube Thumbnail"}
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf/nid-to-pdf" className="hover:text-white transition-colors">
                  {lang === "bn" ? "এনআইডি টু পিডিএফ" : "NID to PDF"}
                </Link>
              </li>
              <li>
                <Link href="/tools/citizen/ats-cv-maker" className="hover:text-white transition-colors">
                  {lang === "bn" ? "ATS সিভি মেকার" : "ATS CV Maker"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Info Col */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              {lang === "bn" ? "কোম্পানি ও নীতিমালা" : "Company & Legal"}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {t("termsOfService")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t("contactUs")}
                </Link>
              </li>
              <li>
                <Link href="/tools/citizen/dorkari-links" className="hover:text-white transition-colors">
                  {lang === "bn" ? "দরকারি সরকারি লিংক" : "Essential Citizen Portals"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name} — {t("allRightsReserved")}</p>
          <p className="flex items-center gap-1.5">
            {lang === "bn" ? "তৈরি করা হয়েছে" : "Crafted with"} <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> {lang === "bn" ? "ভালোবাসার সাথে" : "for everyone"}
          </p>
        </div>
      </div>
    </footer>
  );
}
