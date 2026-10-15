"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Crop,
  ArrowLeft,
  Upload,
  Download,
  RotateCw,
  FlipHorizontal,
  Lock,
  Unlock,
  CheckCircle2,
  Trash2,
  Sparkles,
  Maximize2,
  Image as ImageIcon,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface Preset {
  labelBn: string;
  labelEn: string;
  width: number;
  height: number;
}

const PRESETS: Preset[] = [
  { labelBn: "পাসপোর্ট সাইজ (35x45mm)", labelEn: "Passport (35x45mm)", width: 413, height: 531 },
  { labelBn: "স্ট্যাম্প সাইজ (20x25mm)", labelEn: "Stamp (20x25mm)", width: 236, height: 295 },
  { labelBn: "চাকরির ছবি (৩০০x৩০০)", labelEn: "Govt Job Photo (300x300)", width: 300, height: 300 },
  { labelBn: "চাকরির স্বাক্ষর (৩০০x৮০)", labelEn: "Job Signature (300x80)", width: 300, height: 80 },
  { labelBn: "ইউটিউব থাম্বনেইল (16:9)", labelEn: "YouTube Thumbnail (1280x720)", width: 1280, height: 720 },
  { labelBn: "স্কয়ার পোস্ট (1:1)", labelEn: "Square (1080x1080)", width: 1080, height: 1080 },
  { labelBn: "ফেসবুক কভার", labelEn: "Facebook Cover (820x312)", width: 820, height: 312 },
];

export default function ImageResizeCropPage() {
  const { lang, t } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // Dimensions & Transformation
  const [width, setWidth] = useState<number>(413);
  const [height, setHeight] = useState<number>(531);
  const [lockRatio, setLockRatio] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<number>(413 / 531);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<"image/jpeg" | "image/png">("image/jpeg");
  const [quality, setQuality] = useState<number>(90);

  // Result
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const selected = e.target.files[0];
    if (!selected.type.startsWith("image/")) return;

    setFile(selected);
    const url = URL.createObjectURL(selected);
    setImageSrc(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      imgRef.current = img;
      setWidth(img.width);
      setHeight(img.height);
      setAspectRatio(img.width / img.height);
      generateResult(img, img.width, img.height, 0, false, outputFormat, quality);
    };
  };

  const handlePresetSelect = (preset: Preset) => {
    setWidth(preset.width);
    setHeight(preset.height);
    setAspectRatio(preset.width / preset.height);
    if (imgRef.current) {
      generateResult(imgRef.current, preset.width, preset.height, rotation, flipH, outputFormat, quality);
    }
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockRatio) {
      const newH = Math.round(val / aspectRatio);
      setHeight(newH);
      if (imgRef.current) {
        generateResult(imgRef.current, val, newH, rotation, flipH, outputFormat, quality);
      }
    } else {
      if (imgRef.current) {
        generateResult(imgRef.current, val, height, rotation, flipH, outputFormat, quality);
      }
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockRatio) {
      const newW = Math.round(val * aspectRatio);
      setWidth(newW);
      if (imgRef.current) {
        generateResult(imgRef.current, newW, val, rotation, flipH, outputFormat, quality);
      }
    } else {
      if (imgRef.current) {
        generateResult(imgRef.current, width, val, rotation, flipH, outputFormat, quality);
      }
    }
  };

  const handleRotate = () => {
    const newRot = (rotation + 90) % 360;
    setRotation(newRot);
    if (imgRef.current) {
      generateResult(imgRef.current, width, height, newRot, flipH, outputFormat, quality);
    }
  };

  const handleFlip = () => {
    const newFlip = !flipH;
    setFlipH(newFlip);
    if (imgRef.current) {
      generateResult(imgRef.current, width, height, rotation, newFlip, outputFormat, quality);
    }
  };

  const generateResult = (
    img: HTMLImageElement,
    w: number,
    h: number,
    rot: number,
    flip: boolean,
    fmt: string,
    qual: number
  ) => {
    setIsProcessing(true);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, w);
    canvas.height = Math.max(1, h);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();

    // Fill white background for JPEGs
    if (fmt === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rot !== 0) ctx.rotate((rot * Math.PI) / 180);
    if (flip) ctx.scale(-1, 1);

    ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.restore();

    canvas.toBlob(
      (blob) => {
        if (blob) {
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl(URL.createObjectURL(blob));
          setResultSize(blob.size);
        }
        setIsProcessing(false);
      },
      fmt,
      qual / 100
    );
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="w-full py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
            {lang === "bn" ? "ইমেজ রিসাইজ ও ক্রপ" : "Image Resize & Crop"}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold mb-3">
            <Crop className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? "পাসপোর্ট ও কাস্টম সাইজ" : "Passport & Custom Dimensions"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {lang === "bn" ? "ইমেজ রিসাইজ ও ক্রপ টুল" : "Image Resize & Crop Tool"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            {lang === "bn"
              ? "পাসপোর্ট (35x45mm), চাকরির ফরম (300x300), সোশ্যাল মিডিয়া ও কাস্টম পিক্সেলে ছবি নির্ভুলভাবে রিসাইজ ও রোটেট করুন।"
              : "Resize and adjust images to official passport, govt job formats, social media aspect ratios, or custom pixels."}
          </p>
        </div>

        {/* Main Workspace */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-8">
          {!file ? (
            <label className="border-2 border-dashed border-indigo-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-indigo-50/30 dark:bg-slate-800/40 hover:bg-indigo-50/60 transition-all text-center group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base sm:text-lg mb-1">
                {lang === "bn" ? "ছবি নির্বাচন করুন" : "Upload Your Image"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === "bn" ? "যেকোনো JPG, PNG বা WebP ছবি ড্রপ বা সিলেক্ট করুন" : "Drop or browse any JPG, PNG, or WebP photo"}
              </p>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          ) : (
            <div className="space-y-6">
              {/* Presets Grid */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  {lang === "bn" ? "জনপ্রিয় সাইজ প্রিসেটসমূহ:" : "Standard Size Presets:"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetSelect(p)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        width === p.width && height === p.height
                          ? "bg-indigo-600 text-white border-indigo-600 shadow"
                          : "bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {lang === "bn" ? p.labelBn : p.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dimensions & Transformation Toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 items-end">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "প্রস্থ (Width px)" : "Width (px)"}
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value) || 10)}
                    min={10}
                    max={10000}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "উচ্চতা (Height px)" : "Height (px)"}
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value) || 10)}
                    min={10}
                    max={10000}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLockRatio(!lockRatio)}
                    title={lockRatio ? "Unlock Aspect Ratio" : "Lock Aspect Ratio"}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      lockRatio
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    {lockRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    <span>{lockRatio ? (lang === "bn" ? "লক" : "Locked") : (lang === "bn" ? "আনলক" : "Unlocked")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRotate}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 font-bold"
                    title="Rotate 90 degrees"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleFlip}
                    className={`p-2.5 rounded-xl border font-bold transition-all ${
                      flipH
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                    }`}
                    title="Flip Horizontally"
                  >
                    <FlipHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "ফরম্যাট" : "Format"}
                  </label>
                  <select
                    value={outputFormat}
                    onChange={(e) => {
                      const fmt = e.target.value as "image/jpeg" | "image/png";
                      setOutputFormat(fmt);
                      if (imgRef.current) {
                        generateResult(imgRef.current, width, height, rotation, flipH, fmt, quality);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  >
                    <option value="image/jpeg">JPG / JPEG</option>
                    <option value="image/png">PNG (Lossless)</option>
                  </select>
                </div>
              </div>

              {/* Live Preview Container */}
              <div className="p-6 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center space-y-4">
                <div className="max-w-md max-h-96 overflow-hidden rounded-xl shadow-lg border border-slate-300 dark:border-slate-600 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] p-2 flex items-center justify-center">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Resized output"
                      className="max-h-80 max-w-full object-contain rounded"
                    />
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span>
                    {lang === "bn" ? "আউটপুট রেজোলিউশন:" : "Resolution:"} <strong>{width} × {height} px</strong>
                  </span>
                  <span>•</span>
                  <span>
                    {lang === "bn" ? "ফাইলের সাইজ:" : "File Size:"} <strong>{formatBytes(resultSize)}</strong>
                  </span>
                </div>

                {/* Download Actions */}
                <div className="pt-2 flex flex-wrap gap-3">
                  {previewUrl && (
                    <a
                      href={previewUrl}
                      download={`resized_${width}x${height}.${outputFormat === "image/png" ? "png" : "jpg"}`}
                      className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>{lang === "bn" ? "ছবি ডাউনলোড করুন" : "Download Resized Image"}</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setImageSrc(null);
                      setPreviewUrl(null);
                    }}
                    className="px-5 py-3.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{lang === "bn" ? "নতুন ছবি নিন" : "Change Image"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
