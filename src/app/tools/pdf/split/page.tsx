"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Split,
  ArrowLeft,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
  Trash2,
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useApp } from "@/context/AppContext";
import ToolSeoSection from "@/components/ToolSeoSection";

export default function SplitPdfPage() {
  const { lang, t } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageRange, setPageRange] = useState<string>("1");
  const [isProcessing, setIsProcessing] = useState(false);
  const [splitBlobUrl, setSplitBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const selected = e.target.files[0];
    if (selected.type !== "application/pdf" && !selected.name.endsWith(".pdf")) {
      setError(lang === "bn" ? "শুধুমাত্র PDF ফাইল আপলোড করুন" : "Please select a valid PDF file");
      return;
    }

    try {
      setError(null);
      setSplitBlobUrl(null);
      const buffer = await selected.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = doc.getPageCount();
      setFile(selected);
      setTotalPages(count);
      setPageRange(count > 1 ? `1-${Math.min(2, count)}` : "1");
    } catch (err: any) {
      setError(lang === "bn" ? "PDF পড়তে ব্যর্থ হয়েছে। ফাইলটি সুরক্ষিত কিনা দেখুন।" : "Could not read PDF. Make sure it is not password protected.");
    }
  };

  const parsePages = (str: string, max: number): number[] => {
    const pages = new Set<number>();
    const parts = str.split(",");
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes("-")) {
        const [startStr, endStr] = trimmed.split("-");
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(max, end); i++) {
            pages.add(i - 1); // 0-based
          }
        }
      } else {
        const p = parseInt(trimmed);
        if (!isNaN(p) && p >= 1 && p <= max) {
          pages.add(p - 1);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file) return;
    const indices = parsePages(pageRange, totalPages);
    if (indices.length === 0) {
      setError(lang === "bn" ? "অনুগ্রহ করে সঠিক পেজ নম্বর বা রেঞ্জ লিখুন (যেমন: 1-3 অথবা 1, 4)" : "Please enter valid page numbers (e.g. 1-3 or 1, 4)");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const buffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();

      const copied = await newDoc.copyPages(srcDoc, indices);
      copied.forEach((p) => newDoc.addPage(p));

      const newPdfBytes = await newDoc.save();
      const blob = new Blob([newPdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setSplitBlobUrl(url);
      setIsProcessing(false);
    } catch (err: any) {
      console.error(err);
      setError(lang === "bn" ? "স্প্লিট করার সময় সমস্যা হয়েছে" : "Failed to extract pages from PDF");
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-indigo-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> {lang === "bn" ? "হোম" : "Home"}
          </Link>
          <span>/</span>
          <Link href="/category/pdf" className="hover:text-indigo-600">
            {lang === "bn" ? "পিডিএফ টুলস" : "PDF Tools"}
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            {lang === "bn" ? "পিডিএফ স্প্লিট" : "Split PDF"}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold mb-3">
            <Split className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? "পেজ এক্সট্র্যাক্টর" : "Page Extractor"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {lang === "bn" ? "পিডিএফ স্প্লিট ও পেজ আলাদা করুন" : "Split & Extract Pages from PDF"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            {lang === "bn"
              ? "একটি বড় PDF ফাইল থেকে আপনার প্রয়োজনীয় পেজগুলো (যেমন: ১-৩ বা নির্দিষ্ট পেজ) আলাদা করে নতুন PDF বানান।"
              : "Extract specific pages or page ranges from a PDF document with zero quality loss."}
          </p>
        </div>

        {/* Main Workspace */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          {!file ? (
            <label className="border-2 border-dashed border-indigo-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-indigo-50/30 dark:bg-slate-800/40 hover:bg-indigo-50/60 transition-all text-center group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base sm:text-lg mb-1">
                {lang === "bn" ? "একটি PDF ফাইল নির্বাচন করুন" : "Select a PDF file"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === "bn" ? "বা ড্র্যাগ করে ফাইলটি এখানে ছাড়ুন" : "Or drag and drop the PDF here"}
              </p>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-6">
              {/* File details card */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                      {lang === "bn" ? `মোট ${totalPages}টি পেজ আছে` : `Total ${totalPages} pages found`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFile(null);
                    setSplitBlobUrl(null);
                  }}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                  title="ফাইল পরিবর্তন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Range settings */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  {lang === "bn"
                    ? `কোন কোন পেজ আলাদা করবেন? (১ থেকে ${totalPages} এর মধ্যে)`
                    : `Which pages to extract? (Range 1 to ${totalPages})`}
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    placeholder="e.g. 1-3, 5"
                    className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      onClick={() => setPageRange("1")}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200"
                    >
                      {lang === "bn" ? "১ম পেজ" : "Page 1"}
                    </button>
                    {totalPages >= 2 && (
                      <button
                        onClick={() => setPageRange(`1-${Math.min(3, totalPages)}`)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200"
                      >
                        1-{Math.min(3, totalPages)}
                      </button>
                    )}
                    <button
                      onClick={() => setPageRange(`1-${totalPages}`)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200"
                    >
                      {lang === "bn" ? "সব পেজ" : "All Pages"}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  {lang === "bn"
                    ? "টিপস: একাধিক পেজ আলাদা করতে কমা ও হাইফেন ব্যবহার করুন। যেমন: 1-3, 5, 8-10"
                    : "Tip: Use comma and hyphens for multiple pages. Example: 1-3, 5, 8-10"}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={handleSplit}
                disabled={isProcessing}
                className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{lang === "bn" ? "স্প্লিট করা হচ্ছে..." : "Extracting pages..."}</span>
                  </>
                ) : (
                  <>
                    <Split className="w-4 h-4" />
                    <span>{lang === "bn" ? "পেজগুলো আলাদা করুন" : "Split & Extract Now"}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Download card */}
          {splitBlobUrl && (
            <div className="mt-8 p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 mb-1">
                {lang === "bn" ? "নির্বাচিত পেজ সফলভাবে আলাদা হয়েছে!" : "Pages Extracted Successfully!"}
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                <a
                  href={splitBlobUrl}
                  download={`toolkaj_split_${pageRange.replace(/[^0-9-]/g, "_")}.pdf`}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === "bn" ? "স্প্লিট করা PDF ডাউনলোড করুন" : "Download Extracted PDF"}</span>
                </a>
                <a
                  href={splitBlobUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-bold text-sm"
                >
                  {lang === "bn" ? "প্রিভিউ দেখুন" : "Preview PDF"}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* SEO On-Page Content, FAQs, and Search Tag Badges */}
        <ToolSeoSection toolSlug="pdf/split" />
      </div>
    </div>
  );
}
