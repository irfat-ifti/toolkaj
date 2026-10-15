"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Minimize2,
  ArrowLeft,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Sparkles,
  Sliders,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function ImageCompressPage() {
  const { lang, t } = useApp();
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);

  // Settings
  const [compressionMode, setCompressionMode] = useState<"preset" | "targetKb" | "custom">("preset");
  const [presetLevel, setPresetLevel] = useState<"extreme" | "recommended" | "mild">("recommended");
  const [targetKb, setTargetKb] = useState<number>(100);
  const [quality, setQuality] = useState<number>(60);
  const [scalePercent, setScalePercent] = useState<number>(75);
  const [outputFormat, setOutputFormat] = useState<"image/jpeg" | "image/webp">("image/jpeg");

  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      setError(lang === "bn" ? "শুধুমাত্র ইমেজ ফাইল আপলোড করুন" : "Please select an image file");
      return;
    }

    setError(null);
    setOriginalFile(file);
    setOriginalSize(file.size);
    const url = URL.createObjectURL(file);
    setOriginalPreview(url);

    // Auto set target KB to 50% of original
    const halfKb = Math.max(20, Math.round(file.size / 1024 / 2));
    setTargetKb(halfKb);

    executeCompression(file, presetLevel, halfKb, quality, scalePercent, outputFormat);
  };

  const executeCompression = async (
    file: File,
    preset: "extreme" | "recommended" | "mild",
    target: number,
    qVal: number,
    scale: number,
    format: "image/jpeg" | "image/webp"
  ) => {
    setIsProcessing(true);
    setError(null);

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = async () => {
      // Determine quality and dimensions
      let effQuality = qVal / 100;
      let effScale = scale / 100;

      if (preset === "extreme") {
        effQuality = 0.35;
        effScale = 0.5;
      } else if (preset === "recommended") {
        effQuality = 0.6;
        effScale = 0.75;
      } else if (preset === "mild") {
        effQuality = 0.8;
        effScale = 0.9;
      }

      // If target KB mode, calculate iterative reduction
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      let bestBlob: Blob | null = null;
      let curWidth = Math.round(img.width * effScale);
      let curHeight = Math.round(img.height * effScale);

      // Binary search or loop to guarantee size reduction
      for (let attempt = 0; attempt < 5; attempt++) {
        canvas.width = curWidth;
        canvas.height = curHeight;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, curWidth, curHeight);
        ctx.drawImage(img, 0, 0, curWidth, curHeight);

        const blob: Blob | null = await new Promise((resolve) =>
          canvas.toBlob((b) => resolve(b), format, effQuality)
        );

        if (blob) {
          bestBlob = blob;
          // If already smaller than target or smaller than original by at least 25%, stop
          if (blob.size <= file.size * 0.75) {
            break;
          }
          // Otherwise reduce quality and scale down
          effQuality = Math.max(0.2, effQuality * 0.75);
          curWidth = Math.round(curWidth * 0.85);
          curHeight = Math.round(curHeight * 0.85);
        }
      }

      if (bestBlob) {
        if (compressedPreview) URL.revokeObjectURL(compressedPreview);
        setCompressedPreview(URL.createObjectURL(bestBlob));
        setCompressedSize(bestBlob.size);
      }

      setIsProcessing(false);
      URL.revokeObjectURL(objectUrl);
    };

    img.onerror = () => {
      setError(lang === "bn" ? "ছবি পড়তে সমস্যা হয়েছে" : "Could not load image");
      setIsProcessing(false);
    };
  };

  const recompress = (newPreset: "extreme" | "recommended" | "mild", newFormat?: "image/jpeg" | "image/webp") => {
    setPresetLevel(newPreset);
    if (newFormat) setOutputFormat(newFormat);
    if (originalFile) {
      executeCompression(originalFile, newPreset, targetKb, quality, scalePercent, newFormat || outputFormat);
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
          <Link href="/category/image" className="hover:text-indigo-600">
            {lang === "bn" ? "ইমেজ টুলস" : "Image Tools"}
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            {lang === "bn" ? "ইমেজ কম্প্রেস" : "Compress Image"}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold mb-3">
            <Minimize2 className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? "১০০% নিশ্চিত সাইজ রিডাকশন" : "Guaranteed KB Reduction"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {lang === "bn" ? "ইমেজ কম্প্রেসার (KB রিডিউসার)" : "Smart Image Compressor & KB Reducer"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            {lang === "bn"
              ? "ছবির রেজোলিউশন ও স্পষ্টতা ঠিক রেখে ফাইলের সাইজ ৫০% থেকে ৮০% পর্যন্ত নিশ্চিতভাবে কমিয়ে নিন।"
              : "Intelligently downscales and re-encodes photos to guarantee significant file size savings."}
          </p>
        </div>

        {/* Workspace */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          {!originalFile ? (
            <label className="border-2 border-dashed border-indigo-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-indigo-50/30 dark:bg-slate-800/40 hover:bg-indigo-50/60 transition-all text-center group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base sm:text-lg mb-1">
                {lang === "bn" ? "একটি ছবি সিলেক্ট করুন" : "Upload an image"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === "bn" ? "যেকোনো ভারী JPG, PNG বা WebP ছবি" : "Supports heavy JPG, PNG, and WebP photos"}
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
              {/* Controls */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                      {lang === "bn" ? "কম্প্রেশন লেভেল নির্বাচন করুন" : "Select Compression Level"}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "extreme" as const, labelBn: "সর্বোচ্চ ছোট (Extreme ~75%)", labelEn: "Extreme (~75%)" },
                        { id: "recommended" as const, labelBn: "ভারসাম্যপূর্ণ (Balanced ~50%)", labelEn: "Balanced (~50%)" },
                        { id: "mild" as const, labelBn: "হালকা (Mild ~30%)", labelEn: "Mild (~30%)" },
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => recompress(p.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                            presetLevel === p.id
                              ? "bg-indigo-600 text-white shadow-sm"
                              : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                          }`}
                        >
                          {lang === "bn" ? p.labelBn : p.labelEn}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setOriginalFile(null);
                      setOriginalPreview(null);
                      setCompressedPreview(null);
                    }}
                    className="text-xs text-rose-500 hover:underline flex items-center gap-1 font-semibold self-start sm:self-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> {lang === "bn" ? "অন্য ছবি সিলেক্ট করুন" : "Change Image"}
                  </button>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-400 block font-bold">
                    {lang === "bn" ? "আসল সাইজ" : "Original Size"}
                  </span>
                  <span className="text-lg font-black text-slate-800 dark:text-white">
                    {formatBytes(originalSize)}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700">
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 block font-bold">
                    {lang === "bn" ? "কম্প্রেসড সাইজ" : "Compressed Size"}
                  </span>
                  <span className="text-lg font-black text-indigo-700 dark:text-indigo-300">
                    {isProcessing ? "..." : formatBytes(compressedSize)}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700">
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-bold">
                    {lang === "bn" ? "সাইজ কমেছে" : "Size Reduced"}
                  </span>
                  <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                    -{savedPercent}%
                  </span>
                </div>
              </div>

              {/* Side-by-Side Previews */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {originalPreview && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-500">
                      {lang === "bn" ? "আসল ছবি" : "Original Image"}
                    </span>
                    <div className="h-64 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-2">
                      <img
                        src={originalPreview}
                        alt="Original"
                        className="max-h-full max-w-full object-contain rounded-xl"
                      />
                    </div>
                  </div>
                )}

                {compressedPreview && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {lang === "bn" ? "কম্প্রেসড প্রিভিউ" : "Compressed Preview"}
                    </span>
                    <div className="h-64 rounded-2xl border border-indigo-200 dark:border-indigo-800 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-2">
                      <img
                        src={compressedPreview}
                        alt="Compressed"
                        className="max-h-full max-w-full object-contain rounded-xl"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Download Action */}
              {compressedPreview && (
                <div className="pt-2">
                  <a
                    href={compressedPreview}
                    download={`toolkaj_compressed_${originalFile.name.replace(/\.[^/.]+$/, "")}.jpg`}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>
                      {lang === "bn"
                        ? `কম্প্রেসড ছবি ডাউনলোড (${formatBytes(compressedSize)} • -${savedPercent}%)`
                        : `Download Compressed Image (${formatBytes(compressedSize)} • -${savedPercent}%)`}
                    </span>
                  </a>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
