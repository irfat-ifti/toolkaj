"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Download, Check, AlertCircle, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import ToolSeoSection from "@/components/ToolSeoSection";
import { TOOLS_DATA } from "@/lib/tools-data";

const tool = TOOLS_DATA.find((t) => t.slug === "image/govt-job-resizer")!;

export default function GovtJobResizerPage() {
  const [activeTab, setActiveTab] = useState<"photo" | "signature">("photo");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [quality, setQuality] = useState(0.9);
  const [resultDataUrl, setResultDataUrl] = useState<string | null>(null);
  const [resultFileSizeKb, setResultFileSizeKb] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Target specifications
  const targetWidth = 300;
  const targetHeight = activeTab === "photo" ? 300 : 80;
  const maxKb = activeTab === "photo" ? 100 : 60;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
      setScale(1);
      setOffsetX(0);
      setOffsetY(0);
      setResultDataUrl(null);
      setResultFileSizeKb(null);
    };
    reader.readAsDataURL(file);
  };

  const processImage = () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Fill white background (standard for govt jobs)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Draw image with scale and offsets
      const imgAspect = img.width / img.height;
      const targetAspect = targetWidth / targetHeight;

      let drawW, drawH;
      if (imgAspect > targetAspect) {
        drawH = targetHeight * scale;
        drawW = drawH * imgAspect;
      } else {
        drawW = targetWidth * scale;
        drawH = drawW / imgAspect;
      }

      const drawX = (targetWidth - drawW) / 2 + offsetX;
      const drawY = (targetHeight - drawH) / 2 + offsetY;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // Output as JPG with quality compression to stay under maxKb
      let currentQuality = quality;
      let dataUrl = canvas.toDataURL("image/jpeg", currentQuality);
      let sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);

      // Auto decrease quality if exceeds maxKb
      while (sizeKb > maxKb && currentQuality > 0.2) {
        currentQuality -= 0.1;
        dataUrl = canvas.toDataURL("image/jpeg", currentQuality);
        sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
      }

      setResultDataUrl(dataUrl);
      setResultFileSizeKb(sizeKb);
      setIsProcessing(false);
    };
  };

  const handleDownload = () => {
    if (!resultDataUrl) return;
    const a = document.createElement("a");
    a.href = resultDataUrl;
    a.download = activeTab === "photo" ? "applicant_photo_300x300.jpg" : "applicant_signature_300x80.jpg";
    a.click();
  };

  return (
    <div className="w-full py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-indigo-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> হোম
          </Link>
          <span>/</span>
          <Link href="/category/image" className="hover:text-indigo-600">
            ইমেজ টুলস
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            জব ফটো ও সিগনেচার রিসাইজার
          </span>
        </div>

        {/* Title & info banner */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold mb-3">
            <Check className="w-3.5 h-3.5" /> বাংলাদেশ সরকারি চাকরি (Teletalk ও BPSC মানসম্মত)
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            সরকারি চাকরির ফটো ও সিগনেচার রিসাইজার
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            টেলিটক এবং সরকারি চাকরির জন্য ১০০% নির্ভুল ৩০০x৩০০ পিক্সেল ছবি (সর্বোচ্চ ১০০ KB) এবং ৩০০x৮০ পিক্সেল স্বাক্ষর (সর্বোচ্চ ৬০ KB) তৈরি করুন।
          </p>
        </div>

        {/* Main card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8">
            <button
              onClick={() => {
                setActiveTab("photo");
                setResultDataUrl(null);
                setResultFileSizeKb(null);
              }}
              className={`pb-3 px-6 font-bold text-sm sm:text-base transition-colors border-b-2 ${
                activeTab === "photo"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              আবেদনকারীর ছবি (৩০০ x ৩০০ px, &lt;১০০ KB)
            </button>
            <button
              onClick={() => {
                setActiveTab("signature");
                setResultDataUrl(null);
                setResultFileSizeKb(null);
              }}
              className={`pb-3 px-6 font-bold text-sm sm:text-base transition-colors border-b-2 ${
                activeTab === "signature"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              স্বাক্ষর / Signature (৩০০ x ৮০ px, &lt;৬০ KB)
            </button>
          </div>

          {/* Upload Area */}
          {!imageSrc ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 text-center hover:border-indigo-500 hover:bg-indigo-50/20 cursor-pointer transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Upload className="w-7 h-7" />
              </div>
              <p className="font-bold text-base text-slate-800 dark:text-slate-200">
                {activeTab === "photo" ? "ছবি নির্বাচন করুন" : "স্বাক্ষরের ছবি নির্বাচন করুন"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                JPG, PNG, WebP ফরম্যাট সমর্থিত • যেকোনো সাইজের ফাইল সিলেক্ট করতে পারেন
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Preview & Adjustment Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                      অ্যাডজাস্টমেন্ট ও পজিশন
                    </span>
                    <button
                      onClick={() => {
                        setImageSrc(null);
                        setResultDataUrl(null);
                      }}
                      className="text-xs text-rose-500 hover:underline"
                    >
                      ভিন্ন ছবি আপলোড
                    </button>
                  </div>

                  {/* Zoom Slider */}
                  <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        <span>জুম (Zoom)</span>
                        <span>{Math.round(scale * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.05"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        <span>ডানে-বামে সরান (X Offset)</span>
                        <span>{offsetX}px</span>
                      </div>
                      <input
                        type="range"
                        min="-150"
                        max="150"
                        value={offsetX}
                        onChange={(e) => setOffsetX(parseInt(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        <span>উপরে-নিচে সরান (Y Offset)</span>
                        <span>{offsetY}px</span>
                      </div>
                      <input
                        type="range"
                        min="-150"
                        max="150"
                        value={offsetY}
                        onChange={(e) => setOffsetY(parseInt(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>

                    <button
                      onClick={processImage}
                      disabled={isProcessing}
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${isProcessing ? "animate-spin" : ""}`} />
                      <span>{activeTab === "photo" ? "৩০০x৩০০ ছবিতে রূপান্তর করুন" : "৩০০x৮০ স্বাক্ষরে রূপান্তর করুন"}</span>
                    </button>
                  </div>
                </div>

                {/* Live Result Preview */}
                <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500 mb-3">
                    ফাইনাল প্রিভিউ ({targetWidth} x {targetHeight} px)
                  </span>

                  {resultDataUrl ? (
                    <div className="flex flex-col items-center gap-4 animate-fade-in">
                      <div
                        className="border-2 border-indigo-500 shadow-md bg-white overflow-hidden"
                        style={{
                          width: `${targetWidth}px`,
                          height: `${targetHeight}px`,
                        }}
                      >
                        <img
                          src={resultDataUrl}
                          alt="Processed Result"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                          <Check className="w-3.5 h-3.5" />
                          <span>ফাইল সাইজ: {resultFileSizeKb} KB (সীমা: {maxKb} KB)</span>
                        </div>
                      </div>

                      <button
                        onClick={handleDownload}
                        className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>ডাউনলোড করুন (JPG)</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-400 text-xs">
                      বাম পাশের সেটিংস ঠিক করে &quot;রূপান্তর করুন&quot; বাটনে ক্লিক করুন
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rich SEO Content, Step-by-Step Guide, Specifications & FAQs */}
        <ToolSeoSection tool={tool} />
      </div>
    </div>
  );
}
