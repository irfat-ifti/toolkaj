"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  ArrowLeft,
  Upload,
  Download,
  FileImage,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Loader2,
  Sparkles,
  Layers,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import ToolSeoSection from "@/components/ToolSeoSection";

interface RenderedPage {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
}

export default function PdfToImagePage() {
  const { lang } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [pdfLibReady, setPdfLibReady] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [format, setFormat] = useState<"image/png" | "image/jpeg">("image/png");
  const [scale, setScale] = useState<number>(2); // 2x for crisp 300 DPI output
  const [error, setError] = useState<string | null>(null);

  // Check if PDF.js is already available on window
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).pdfjsLib) {
      (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      setPdfLibReady(true);
    }
  }, []);

  const handleScriptLoad = () => {
    if (typeof window !== "undefined" && (window as any).pdfjsLib) {
      (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      setPdfLibReady(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const selected = e.target.files[0];
    if (selected.type !== "application/pdf" && !selected.name.endsWith(".pdf")) {
      setError(lang === "bn" ? "অনুগ্রহ করে একটি সঠিক PDF ফাইল নির্বাচন করুন।" : "Please select a valid PDF document.");
      return;
    }
    setError(null);
    setFile(selected);
    setPages([]);
    setProgress(0);
  };

  const convertPdfToImages = async () => {
    if (!file) return;
    const pdfjs = (window as any).pdfjsLib;
    if (!pdfjs) {
      setError(lang === "bn" ? "PDF ইঞ্জিন লোড হচ্ছে, অনুগ্রহ করে কয়েক সেকেন্ড পর আবার চেষ্টা করুন।" : "PDF engine is loading, please try again in a few seconds.");
      return;
    }

    setIsConverting(true);
    setProgress(5);
    setError(null);
    setPages([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      setTotalPages(numPages);

      const rendered: RenderedPage[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (ctx) {
          // Fill pure white background for JPEGs
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          await page.render({
            canvasContext: ctx,
            viewport,
          }).promise;

          const dataUrl = canvas.toDataURL(format, format === "image/jpeg" ? 0.95 : 1.0);
          rendered.push({
            pageNumber: i,
            dataUrl,
            width: viewport.width,
            height: viewport.height,
          });
        }

        setProgress(Math.round((i / numPages) * 100));
      }

      setPages(rendered);
    } catch (err: any) {
      console.error("PDF conversion error:", err);
      setError(lang === "bn" ? "PDF থেকে ছবি রূপান্তর করতে সমস্যা হয়েছে। ফাইলটি পাসওয়ার্ড সুরক্ষিত কিনা যাচাই করুন।" : "Failed to convert PDF. Ensure the file is not password protected.");
    } finally {
      setIsConverting(false);
    }
  };

  const downloadSingleImage = (page: RenderedPage) => {
    const ext = format === "image/png" ? "png" : "jpg";
    const filename = `${file?.name.replace(/\.[^/.]+$/, "")}_page_${page.pageNumber}.${ext}`;
    const a = document.createElement("a");
    a.href = page.dataUrl;
    a.download = filename;
    a.click();
  };

  const downloadAllImages = () => {
    pages.forEach((page, idx) => {
      setTimeout(() => {
        downloadSingleImage(page);
      }, idx * 250);
    });
  };

  return (
    <div className="w-full py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Load PDF.js */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        onLoad={handleScriptLoad}
        strategy="afterInteractive"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
            {lang === "bn" ? "পিডিএফ টু ইমেজ" : "PDF to Image"}
          </span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === "bn" ? "১০০% ক্লায়েন্ট-সাইড প্রাইভেসি" : "100% Client-Side Privacy"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {lang === "bn" ? "পিডিএফ টু ইমেজ কনভার্টার (PDF to Image)" : "PDF to Image Converter"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            {lang === "bn"
              ? "PDF ফাইলের প্রতিটি পেজকে হাই-রেজোলিউশন (৩০০ DPI) JPG বা PNG ছবিতে রূপান্তর করুন সম্পূর্ণ নিরাপদে।"
              : "Convert every page of your PDF into high-resolution JPG or PNG images with 100% security."}
          </p>
        </div>

        {/* Workspace */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          {/* File Upload Box */}
          {!file ? (
            <label className="border-2 border-dashed border-indigo-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-indigo-50/20 dark:bg-slate-800/40 hover:bg-indigo-50/50 transition-all text-center group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileImage className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base sm:text-lg mb-1">
                {lang === "bn" ? "PDF ফাইল নির্বাচন করুন" : "Select PDF Document"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === "bn" ? "ফাইলটি এখানে টেনে আনুন বা ব্রাউজ করুন" : "Drag & drop your PDF file here or click to browse"}
              </p>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-6">
              {/* Selected File Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
                    <FileImage className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                      {file.name}
                    </h4>
                    <span className="text-xs text-slate-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFile(null);
                    setPages([]);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {lang === "bn" ? "অন্য ফাইল নির্বাচন করুন" : "Change File"}
                </button>
              </div>

              {/* Settings Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {lang === "bn" ? "ছবির ফরম্যাট" : "Image Format"}
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFormat("image/png")}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        format === "image/png"
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      PNG (স্বচ্ছ ও সর্বোচ্চ মান)
                    </button>
                    <button
                      onClick={() => setFormat("image/jpeg")}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        format === "image/jpeg"
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      JPG (ছোট ফাইল সাইজ)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {lang === "bn" ? "রেজোলিউশন কোয়ালিটি" : "Resolution Quality"}
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setScale(1.5)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        scale === 1.5
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      Standard (150 DPI)
                    </button>
                    <button
                      onClick={() => setScale(2.5)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        scale === 2.5
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      High HD (300 DPI)
                    </button>
                  </div>
                </div>
              </div>

              {/* Convert Button */}
              {pages.length === 0 && (
                <button
                  onClick={convertPdfToImages}
                  disabled={isConverting}
                  className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{lang === "bn" ? `রূপান্তর হচ্ছে... (${progress}%)` : `Converting... (${progress}%)`}</span>
                    </>
                  ) : (
                    <>
                      <Layers className="w-4 h-4" />
                      <span>{lang === "bn" ? "ছবিতে রূপান্তর শুরু করুন" : "Start Converting to Images"}</span>
                    </>
                  )}
                </button>
              )}

              {/* Progress bar */}
              {isConverting && (
                <div className="space-y-1">
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${progress}%` }}
                      className="h-full bg-indigo-600 transition-all duration-300"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 block text-center">
                    {progress}% সম্পন্ন হয়েছে...
                  </span>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Results Gallery */}
          {pages.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {lang === "bn" ? `মোট ${pages.length}টি পেজ রূপান্তর সম্পন্ন হয়েছে!` : `Converted ${pages.length} Pages!`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === "bn" ? "নিচে প্রতিটি পেজের প্রিভিউ দেখে এককভাবে বা একসাথে ডাউনলোড করুন।" : "Download pages individually or all at once."}
                  </p>
                </div>

                <button
                  onClick={downloadAllImages}
                  className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === "bn" ? "সবগুলো ছবি ডাউনলোড করুন" : "Download All Images"}</span>
                </button>
              </div>

              {/* Grid of Pages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {pages.map((p) => (
                  <div
                    key={p.pageNumber}
                    className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 group hover:shadow-md transition-all"
                  >
                    <div className="relative aspect-[3/4] bg-white rounded-xl overflow-hidden border shadow-inner flex items-center justify-center">
                      <img
                        src={p.dataUrl}
                        alt={`Page ${p.pageNumber}`}
                        className="w-full h-full object-contain"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/70 text-white text-[10px] font-bold">
                        পেজ {p.pageNumber}
                      </span>
                    </div>

                    <button
                      onClick={() => downloadSingleImage(p)}
                      className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 hover:border-indigo-300 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{lang === "bn" ? `পেজ ${p.pageNumber} ডাউনলোড (${format === "image/png" ? "PNG" : "JPG"})` : `Download Page ${p.pageNumber}`}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SEO On-Page Content, FAQs, and Search Tag Badges */}
        <ToolSeoSection toolSlug="pdf/pdf-to-image" />
      </div>
    </div>
  );
}
