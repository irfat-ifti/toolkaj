"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileDown,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Sparkles,
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useApp } from "@/context/AppContext";

export default function CompressPdfPage() {
  const { lang, t } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedBlobUrl, setCompressedBlobUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== "application/pdf" && !selected.name.endsWith(".pdf")) {
      setError(lang === "bn" ? "অনুগ্রহ করে একটি সঠিক PDF ফাইল নির্বাচন করুন।" : "Please select a valid PDF file");
      return;
    }

    setError(null);
    setFile(selected);
    setOriginalSize(selected.size);
    setCompressedBlobUrl(null);

    compressPdf(selected);
  };

  const compressPdf = async (pdfFile: File) => {
    setIsCompressing(true);
    setError(null);

    try {
      const buffer = await pdfFile.arrayBuffer();
      // Load source document
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      // Create a clean new document with optimized stream packaging
      const newDoc = await PDFDocument.create();
      const pageIndices = srcDoc.getPageIndices();
      const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
      copiedPages.forEach((page) => newDoc.addPage(page));

      // Save with binary object streams enabled (reduces uncompressed overhead)
      const compressedBytes = await newDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      const blob = new Blob([compressedBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setCompressedBlobUrl(url);
      setCompressedSize(blob.size);
      setIsCompressing(false);
    } catch (err: any) {
      console.error(err);
      setError(
        lang === "bn"
          ? "PDF কম্প্রেস করতে সমস্যা হয়েছে। ফাইলটি পাসওয়ার্ড সুরক্ষিত কিনা যাচাই করুন।"
          : "Could not compress PDF. Please make sure the file is not password-protected."
      );
      setIsCompressing(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const savedPercent =
    originalSize && compressedSize
      ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
      : 0;

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
            {lang === "bn" ? "পিডিএফ কম্প্রেস" : "Compress PDF"}
          </span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === "bn" ? "স্ট্রিম অপ্টিমাইজেশন" : "Binary Stream Optimization"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {lang === "bn" ? "পিডিএফ ফাইলের সাইজ কমান (Compress PDF)" : "Compress PDF File Size"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            {lang === "bn"
              ? "উচ্চ রেজোলিউশন ও টেক্সট স্পষ্ট রেখে আপনার PDF ফাইলের অপ্রয়োজনীয় মেটাডাটা ও অবজেক্ট স্ট্রিম অপ্টিমাইজ করুন।"
              : "Reduce PDF document file size with lossless Flate stream compression and object tree clean-up."}
          </p>
        </div>

        {/* Main Workspace */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 text-center hover:border-indigo-500 hover:bg-indigo-50/20 cursor-pointer transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFile}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base sm:text-lg mb-1">
                {lang === "bn" ? "PDF ফাইল আপলোড করুন" : "Upload a PDF document"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === "bn" ? "বা ড্র্যাগ করে ফাইলটি এখানে ছেড়ে দিন" : "Or drag and drop the PDF here"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* File Info */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border flex items-center justify-between">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <FileDown className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {lang === "bn" ? "আসল সাইজ: " : "Original size: "}
                      {formatBytes(originalSize)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFile(null);
                    setCompressedBlobUrl(null);
                  }}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                  title="মুছুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {isCompressing && (
                <div className="p-8 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {lang === "bn" ? "PDF স্ট্রিম অপ্টিমাইজ ও কম্প্রেস করা হচ্ছে..." : "Compressing PDF streams..."}
                  </p>
                </div>
              )}

              {/* Result Card */}
              {compressedBlobUrl && !isCompressing && (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-4 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                      {lang === "bn" ? "পিডিএফ সফলভাবে কম্প্রেস হয়েছে!" : "PDF Compressed Successfully!"}
                    </h3>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                      {lang === "bn"
                        ? `নতুন সাইজ: ${formatBytes(compressedSize)} (${formatBytes(originalSize)} থেকে ছোট হয়েছে)`
                        : `New Size: ${formatBytes(compressedSize)} (reduced from ${formatBytes(originalSize)})`}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <a
                      href={compressedBlobUrl}
                      download={`toolkaj_compressed_${file.name}`}
                      className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>{lang === "bn" ? "কম্প্রেসড PDF ডাউনলোড করুন" : "Download Compressed PDF"}</span>
                    </a>
                    <a
                      href={compressedBlobUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-3 rounded-xl bg-white dark:bg-slate-800 border text-emerald-700 dark:text-emerald-300 font-bold text-sm"
                    >
                      {lang === "bn" ? "প্রিভিউ দেখুন" : "Preview PDF"}
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
