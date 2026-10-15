"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Stamp,
  ArrowLeft,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
  Trash2,
} from "lucide-react";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import { useApp } from "@/context/AppContext";

export default function WatermarkPdfPage() {
  const { lang, t } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [watermarkText, setWatermarkText] = useState<string>("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState<number>(45);
  const [opacity, setOpacity] = useState<number>(0.3);
  const [color, setColor] = useState<string>("gray");
  const [isProcessing, setIsProcessing] = useState(false);
  const [stampedBlobUrl, setStampedBlobUrl] = useState<string | null>(null);
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
      setStampedBlobUrl(null);
      const buffer = await selected.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setFile(selected);
      setTotalPages(doc.getPageCount());
    } catch (err: any) {
      setError(lang === "bn" ? "PDF পড়তে ব্যর্থ হয়েছে" : "Could not read PDF");
    }
  };

  const getRgbColor = (c: string) => {
    switch (c) {
      case "red":
        return rgb(0.9, 0.1, 0.1);
      case "blue":
        return rgb(0.1, 0.4, 0.9);
      case "green":
        return rgb(0.1, 0.7, 0.2);
      case "amber":
        return rgb(0.9, 0.6, 0.1);
      case "black":
        return rgb(0.1, 0.1, 0.1);
      default:
        return rgb(0.5, 0.5, 0.5);
    }
  };

  const handleApplyWatermark = async () => {
    if (!file || !watermarkText.trim()) return;

    try {
      setIsProcessing(true);
      setError(null);

      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const pages = doc.getPages();
      const colorVal = getRgbColor(color);

      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        // Center calculation with rotation
        page.drawText(watermarkText, {
          x: width / 2 - (textWidth / 2) * 0.7,
          y: height / 2 - (textHeight / 2) * 0.7,
          size: fontSize,
          font,
          color: colorVal,
          opacity,
          rotate: degrees(45),
        });
      }

      const bytes = await doc.save();
      const blob = new Blob([bytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setStampedBlobUrl(url);
      setIsProcessing(false);
    } catch (err: any) {
      console.error(err);
      setError(lang === "bn" ? "ওয়াটারমার্ক যোগ করতে ব্যর্থ হয়েছে" : "Failed to stamp watermark on PDF");
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
            {lang === "bn" ? "পিডিএফ ওয়াটারমার্ক" : "PDF Watermark"}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold mb-3">
            <Stamp className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? "কপিরাইট সুরক্ষা" : "Copyright Protection"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {lang === "bn" ? "পিডিএফ ওয়াটারমার্ক স্ট্যাম্পার" : "Add Watermark to PDF"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            {lang === "bn"
              ? "আপনার PDF ফাইলের প্রতিটি পেজে আড়াআড়ি কাস্টম টেক্সট ওয়াটারমার্ক (যেমন: CONFIDENTIAL, DRAFT, দলিল) যুক্ত করুন।"
              : "Stamp custom text watermarks diagonally across all pages of your PDF document."}
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
                {lang === "bn" ? "বা ড্র্যাগ করে ফাইলটি এখানে ছেড়ে দিন" : "Or drag and drop the PDF here"}
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
                      {lang === "bn" ? `মোট ${totalPages}টি পেজ` : `Total ${totalPages} pages`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFile(null);
                    setStampedBlobUrl(null);
                  }}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                  title="ফাইল মুছুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Watermark Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "ওয়াটারমার্ক টেক্সট" : "Watermark Text"}
                  </label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="e.g. CONFIDENTIAL / DO NOT COPY"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? `ফন্ট সাইজ: ${fontSize}px` : `Font Size: ${fontSize}px`}
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? `অস্বচ্ছতা (Opacity): ${Math.round(opacity * 100)}%` : `Opacity: ${Math.round(opacity * 100)}%`}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "রং নির্বাচন করুন" : "Color"}
                  </label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  >
                    <option value="gray">{lang === "bn" ? "ধূসর (Gray)" : "Gray"}</option>
                    <option value="red">{lang === "bn" ? "লাল (Red)" : "Red"}</option>
                    <option value="blue">{lang === "bn" ? "নীল (Blue)" : "Blue"}</option>
                    <option value="amber">{lang === "bn" ? "হলুদ/অ্যাম্বার (Amber)" : "Amber"}</option>
                    <option value="black">{lang === "bn" ? "কালো (Black)" : "Black"}</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleApplyWatermark}
                disabled={isProcessing || !watermarkText.trim()}
                className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{lang === "bn" ? "ওয়াটারমার্ক যোগ হচ্ছে..." : "Applying watermark..."}</span>
                  </>
                ) : (
                  <>
                    <Stamp className="w-4 h-4" />
                    <span>{lang === "bn" ? "ওয়াটারমার্ক যুক্ত করুন" : "Add Watermark Now"}</span>
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
          {stampedBlobUrl && (
            <div className="mt-8 p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 mb-1">
                {lang === "bn" ? "ওয়াটারমার্ক সফলভাবে যুক্ত হয়েছে!" : "Watermark Applied Successfully!"}
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                <a
                  href={stampedBlobUrl}
                  download="toolkaj_watermarked.pdf"
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === "bn" ? "ওয়াটারমার্ক করা PDF ডাউনলোড করুন" : "Download Watermarked PDF"}</span>
                </a>
                <a
                  href={stampedBlobUrl}
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
      </div>
    </div>
  );
}
