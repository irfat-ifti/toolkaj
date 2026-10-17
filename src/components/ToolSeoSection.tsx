"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronDown,
  Layers,
  ArrowRight,
  BookOpen,
  Tag,
  Sparkles,
} from "lucide-react";
import { ToolItem, TOOLS_DATA } from "@/lib/tools-data";
import { getSeoData, getToolStructuredData, PageSeoItem } from "@/config/seoRegistry";
import DynamicIcon from "@/components/DynamicIcon";

interface ToolSeoSectionProps {
  tool?: ToolItem;
  toolSlug?: string;
  toolKey?: string;
}

export default function ToolSeoSection({ tool, toolSlug, toolKey }: ToolSeoSectionProps) {
  const identifier = toolSlug || toolKey || tool?.slug || tool?.href || "";
  const seo = getSeoData(identifier);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!seo) {
    return null;
  }

  const schemas = getToolStructuredData(seo);

  // Display 6 to 8 related tools for deep internal link equity pass
  const currentCategory = seo.category || tool?.category;
  const currentSlug = seo.slug || tool?.slug;
  const relatedTools = TOOLS_DATA.filter(
    (t) => t.slug !== currentSlug && (t.category === currentCategory || t.popular)
  ).slice(0, 8);

  const toolTitleBn = tool?.titleBn || seo.h1.split("—")[0].trim() || "টুল";

  return (
    <section className="w-full mt-16 pt-12 border-t border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200">
      {/* Schema.org Structured Data (WebApplication, BreadcrumbList, HowTo, FAQPage) */}
      {schemas.map((schemaObj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaObj) }}
        />
      ))}

      <div className="max-w-5xl mx-auto space-y-12">
        {/* 1. Overview & Key Benefits */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>ব্যবহার সহায়িকা ও নির্দেশিকা</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4 leading-snug">
            {seo.h1}
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
            {seo.subtitle || seo.description}
          </p>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <span>কেন ToolKaj-এর {toolTitleBn} সেরা? (Key Features & Benefits)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {(seo.whyUse || [
              "১০০% সম্পূর্ণ ফ্রি এবং কোনো ধরনের চার্জ বা সাবস্ক্রিপশন ফি নেই।",
              "সরাসরি আপনার ব্রাউজারে ক্লায়েন্ট-সাইড প্রসেসিং—আপনার কোনো ফাইল বা তথ্য সার্ভারে আপলোড হয় না।",
              "কোনো সফটওয়্যার বা অ্যাপ ইনস্টল ছাড়াই মোবাইল ও পিসির যেকোনো ব্রাউজারে দ্রুত কাজ করে।",
              "কোনো ওয়াটারমার্ক বা রেজিস্ট্রেশনের বাধ্যবাধকতা নেই, আনলিমিটেড ব্যবহারযোগ্য।"
            ]).map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Step-by-Step How-To Guide */}
        {seo.howToSteps && seo.howToSteps.length > 0 && (
          <div>
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                টুলটি কীভাবে কাজ করে? (How to Use {toolTitleBn})
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                খুব সহজেই মাত্র কয়েকটি সহজ ধাপে কাজটি দ্রুত সম্পন্ন করুন
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {seo.howToSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-xs flex items-center justify-center mb-3.5 shadow-sm shadow-indigo-500/20">
                      {idx + 1}
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Official Specifications & Limitations (if available) */}
        {(seo.specifications || seo.limitations) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Specifications Table */}
            {seo.specifications && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-500" />
                  <span>প্রযুক্তিগত স্পেসিফিকেশন ও মানদণ্ড</span>
                </h3>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                  {seo.specifications.map((spec, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        {spec.label}
                      </span>
                      <span className="text-slate-900 dark:text-white font-semibold text-right">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Limitations & Guidelines */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  <span>সতর্কতা ও আউটপুট নির্দেশিকা</span>
                </h3>

                <div className="space-y-3">
                  {(seo.limitations || [
                    "সর্বোত্তম ফলাফলের জন্য পরিষ্কার ও সঠিক ফরম্যাটের ইনপুট প্রদান করুন।",
                    "ফাইল প্রসেসিং সরাসরি আপনার ব্রাউজারের মেমোরিতে সম্পন্ন হয়।"
                  ]).map((lim, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                      <span>{lim}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Box */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 text-xs text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>১০০% প্রাইভেট ও ক্লায়েন্ট-সাইড প্রসেসিং—আপনার কোনো ফাইল বা তথ্য সার্ভারে যায় না।</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. Frequently Asked Questions (FAQ) */}
        {seo.faqs && seo.faqs.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
            <div className="max-w-xl mx-auto text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>সাধারণ প্রশ্নোত্তর</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (Frequently Asked Questions - FAQ)
              </h2>
            </div>

            <div className="space-y-3 max-w-3xl mx-auto">
              {seo.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-indigo-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Visible "Popular Search Tags / জনপ্রিয় সার্চ ট্যাগসমূহ" Section */}
        {seo.keywords && seo.keywords.length > 0 && (
          <section
            aria-label="জনপ্রিয় সার্চ ট্যাগসমূহ"
            className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-indigo-500" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                জনপ্রিয় সার্চ ট্যাগ ও কিওয়ার্ডসমূহ (Popular Search Tags)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              ব্যবহারকারীরা সাধারণত নিচের কিওয়ার্ড ও বিষয়গুলো দিয়ে এই অনলাইন টুলটি অনুসন্ধান করে থাকেন:
            </p>
            <div className="flex flex-wrap gap-2">
              {seo.keywords.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-600/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* 6. Related Tools (Internal SEO Linking Grid) */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                অন্যান্য প্রয়োজনীয় টুলস (Related Online Tools)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                আপনার কাজের সুবিধার জন্য আরও কিছু দরকারি ফ্রি ডিজিটাল টুলস
              </p>
            </div>
            <Link
              href="/tools"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>সবগুলো টুলস দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map((relTool) => (
              <Link
                key={relTool.id}
                href={relTool.href}
                className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <DynamicIcon name={relTool.icon} className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1 line-clamp-1">
                    {relTool.titleBn}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {relTool.descBn}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
                  <span>ব্যবহার করুন</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
