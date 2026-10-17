"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  RefreshCw,
  ArrowLeft,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Loader2,
  Trash2,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import ToolSeoSection from "@/components/ToolSeoSection";

export default function ImageConverterPage() {
  const { lang, t } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/png");
  const [quality, setQuality] = useState<number>(90);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const selected = e.target.files[0];
    if (!selected.type.startsWith("image/")) return;

    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    performConversion(selected, targetFormat, quality);
  };

  const performConversion = (
    inputFile: File,
    fmt: "image/jpeg" | "image/png" | "image/webp",
    q: number
  ) => {
    setIsProcessing(true);
    const img = new Image();
    const objectUrl = URL.createObjectURL(inputFile);
    img.src = objectUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (fmt === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (convertedUrl) URL.revokeObjectURL(convertedUrl);
            setConvertedUrl(URL.createObjectURL(blob));
            setConvertedSize(blob.size);
          }
          setIsProcessing(false);
          URL.revokeObjectURL(objectUrl);
        },
        fmt,
        q / 100
      );
    };
  };

  const formatExt = targetFormat.replace("image/", "").replace("jpeg", "jpg");

  return (
    <div className="w-full py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-indigo-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> {lang === "bn" ? "হোম" : "Home"}
          </Link>
          <span>/</span>
          <Link href="/category/image" className="hover:text-indigo-600">
            {lang === "bn" ? "ইমেজ টুলস" : "Image Tools"}
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            {lang === "bn" ? "ইমেজ কনভার্টার" : "Image Converter"}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold mb-3">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? "ফরম্যাট রূপান্তর" : "Format Conversion"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {lang === "bn" ? "অল-ইন-ওয়ান ইমেজ কনভার্টার" : "All-in-One Image Format Converter"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            {lang === "bn"
              ? "যেকোনো ছবি এক ক্লিকে JPG, PNG বা আধুনিক WebP ফরম্যাটে রূপান্তর করে নিন কোনো ডেটা খরচ ছাড়াই।"
              : "Convert photos seamlessly between JPG, PNG, and next-gen WebP formats directly in your browser."}
          </p>
        </div>

        {/* Workspace */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          {!file ? (
            <label className="border-2 border-dashed border-indigo-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-indigo-50/30 dark:bg-slate-800/40 hover:bg-indigo-50/60 transition-all text-center group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base sm:text-lg mb-1">
                {lang === "bn" ? "ছবি আপলোড করুন" : "Upload an image"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === "bn" ? "যেকোনো JPG, PNG, WebP, GIF, বা BMP ছবি" : "Any JPG, PNG, WebP, or BMP file"}
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-6">
              {/* Options */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                      {lang === "bn" ? "টার্গেট ফরম্যাট সিলেক্ট করুন" : "Select Target Format"}
                    </label>
                    <div className="flex gap-2">
                      {[
                        { label: "PNG", val: "image/png" as const },
                        { label: "JPG", val: "image/jpeg" as const },
                        { label: "WebP (Lightweight)", val: "image/webp" as const },
                      ].map((fmt) => (
                        <button
                          key={fmt.val}
                          onClick={() => {
                            setTargetFormat(fmt.val);
                            performConversion(file, fmt.val, quality);
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                            targetFormat === fmt.val
                              ? "bg-indigo-600 text-white shadow-sm"
                              : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border"
                          }`}
                        >
                          {fmt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                      {lang === "bn" ? `কোয়ালিটি: ${quality}%` : `Quality: ${quality}%`}
                    </label>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={quality}
                      onChange={(e) => {
                        const q = parseInt(e.target.value);
                        setQuality(q);
                        performConversion(file, targetFormat, q);
                      }}
                      className="w-40 sm:w-48 accent-indigo-600"
                    />
                  </div>
                </div>
              </div>

              {/* Converted Preview & Download */}
              {convertedUrl && (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center animate-fade-in space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                      {lang === "bn"
                        ? `ছবিটি সফলভাবে .${formatExt.toUpperCase()} এ কনভার্ট হয়েছে!`
                        : `Converted successfully to .${formatExt.toUpperCase()}!`}
                    </h3>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                      {lang === "bn"
                        ? `সাইজ: ${(convertedSize / 1024).toFixed(1)} KB`
                        : `Output size: ${(convertedSize / 1024).toFixed(1)} KB`}
                    </p>
                  </div>

                  <div className="max-w-xs mx-auto h-48 rounded-xl overflow-hidden border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 flex items-center justify-center p-2">
                    <img
                      src={convertedUrl}
                      alt="Converted"
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                  </div>

                  <div className="flex flex-wrap justify-center gap-3">
                    <a
                      href={convertedUrl}
                      download={`toolkaj_converted_${file.name.replace(/\.[^/.]+$/, "")}.${formatExt}`}
                      className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>{lang === "bn" ? "কনভার্ট করা ছবি ডাউনলোড করুন" : "Download Converted Image"}</span>
                    </a>
                    <button
                      onClick={() => {
                        setFile(null);
                        setPreviewUrl(null);
                        setConvertedUrl(null);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                    >
                      {lang === "bn" ? "নতুন ছবি" : "Convert Another"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SEO On-Page Content, FAQs, and Search Tag Badges */}
        <ToolSeoSection toolSlug="image/convert" />
      </div>
    </div>
  );
}
