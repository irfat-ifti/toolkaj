"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FilePlus2,
  ArrowLeft,
  Upload,
  Trash2,
  ArrowUp,
  ArrowDown,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { useApp } from "@/context/AppContext";
import ToolSeoSection from "@/components/ToolSeoSection";

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount?: number;
}

export default function MergePdfPage() {
  const { lang, t } = useApp();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);
  const [mergedSize, setMergedSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setError(null);
    setMergedBlobUrl(null);
    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        setError(lang === "bn" ? "শুধুমাত্র PDF ফাইল আপলোড করুন" : "Please select valid PDF files only");
        continue;
      }

      let pages = 0;
      try {
        const buffer = await file.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        pages = doc.getPageCount();
      } catch (err) {
        console.warn("Could not read page count", err);
      }

      newFiles.push({
        id: Math.random().toString(36).substring(7),
        file,
        name: file.name,
        size: file.size,
        pageCount: pages,
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setMergedBlobUrl(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index - 1];
    newFiles[index - 1] = temp;
    setFiles(newFiles);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index + 1];
    newFiles[index + 1] = temp;
    setFiles(newFiles);
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      setError(lang === "bn" ? "মার্জ করার জন্য কমপক্ষে ২টি PDF ফাইল প্রয়োজন" : "Please select at least 2 PDF files to merge");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const mergedPdf = await PDFDocument.create();

      for (const item of files) {
        const buffer = await item.file.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setMergedBlobUrl(url);
      setMergedSize(blob.size);
      setIsProcessing(false);
    } catch (err: any) {
      console.error(err);
      setError(lang === "bn" ? "PDF মার্জ করতে সমস্যা হয়েছে। ফাইলটি পাসওয়ার্ড সুরক্ষিত কিনা যাচাই করুন।" : "Failed to merge PDFs. Please make sure the files are not password-protected.");
      setIsProcessing(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
            {lang === "bn" ? "পিডিএফ মার্জ" : "Merge PDF"}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold mb-3">
            <FilePlus2 className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? "১০০% নিরাপদ ও অফলাইন" : "100% Client-Side Secure"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {lang === "bn" ? "পিডিএফ মার্জ ও জোড়া লাগানো" : "Merge Multiple PDF Files"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            {lang === "bn"
              ? "একাধিক PDF ফাইল একসাথে যুক্ত করে একটি ফাইলে রূপান্তর করুন। ড্র্যাগ করে পছন্দমতো সিরিয়াল সাজিয়ে নিন।"
              : "Combine multiple PDF documents into a single organized file in seconds. Rearrange pages as needed."}
          </p>
        </div>

        {/* Main Workspace */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          {/* Upload Area */}
          <label className="border-2 border-dashed border-indigo-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-indigo-50/30 dark:bg-slate-800/40 hover:bg-indigo-50/60 transition-all text-center group">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base sm:text-lg mb-1">
              {lang === "bn" ? "PDF ফাইলসমূহ সিলেক্ট করুন" : "Choose PDF files"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              {lang === "bn"
                ? "বা ফাইলগুলো টেনে এখানে ছেড়ে দিন। আনলিমিটেড ফাইল মার্জ করা যায়।"
                : "Or drag & drop them here. No limits on file count or size."}
            </p>
            <input
              type="file"
              accept=".pdf,application/pdf"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Files List */}
          {files.length > 0 && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {lang === "bn" ? `যুক্ত ফাইলসমূহ (${files.length}টি)` : `Selected Files (${files.length})`}
                </h4>
                <button
                  onClick={() => setFiles([])}
                  className="text-xs text-rose-500 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" /> {lang === "bn" ? "সব মুছুন" : "Clear All"}
                </button>
              </div>

              <div className="space-y-2">
                {files.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                        {index + 1}
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {formatBytes(item.size)} {item.pageCount ? `• ${item.pageCount} ${lang === "bn" ? "পেজ" : "pages"}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        title="উপরে নিন"
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveDown(index)}
                        disabled={index === files.length - 1}
                        title="নিচে নিন"
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFile(item.id)}
                        title="সরান"
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={mergePdfs}
                  disabled={isProcessing || files.length < 2}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{lang === "bn" ? "মার্জ করা হচ্ছে..." : "Merging PDFs..."}</span>
                    </>
                  ) : (
                    <>
                      <FilePlus2 className="w-4 h-4" />
                      <span>{lang === "bn" ? "পিডিএফ মার্জ করুন" : "Merge PDFs Now"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Success Download Card */}
          {mergedBlobUrl && (
            <div className="mt-8 p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 mb-1">
                {lang === "bn" ? "পিডিএফ সফলভাবে মার্জ সম্পন্ন হয়েছে!" : "PDFs Merged Successfully!"}
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mb-4">
                {lang === "bn"
                  ? `ফাইল সাইজ: ${formatBytes(mergedSize || 0)} • ক্লায়েন্ট-সাইডে সম্পূর্ণ তৈরি`
                  : `Total file size: ${formatBytes(mergedSize || 0)} • Processed completely locally`}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={mergedBlobUrl}
                  download="toolkaj_merged.pdf"
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === "bn" ? "মার্জ করা PDF ডাউনলোড করুন" : "Download Merged PDF"}</span>
                </a>
                <a
                  href={mergedBlobUrl}
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
        <ToolSeoSection toolSlug="pdf/merge" />
      </div>
    </div>
  );
}
