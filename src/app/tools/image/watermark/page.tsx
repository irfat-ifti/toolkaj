"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Stamp,
  ArrowLeft,
  Upload,
  Download,
  Trash2,
  Sparkles,
  Type,
  Grid,
  Palette,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

type Position = "tl" | "tc" | "tr" | "ml" | "center" | "mr" | "bl" | "bc" | "br" | "tile";

export default function ImageWatermarkPage() {
  const { lang, t } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState("© TOOLKAJ COPYRIGHT");
  const [fontSize, setFontSize] = useState<number>(36);
  const [opacity, setOpacity] = useState<number>(50);
  const [color, setColor] = useState<string>("#ffffff");
  const [position, setPosition] = useState<Position>("br");
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const selected = e.target.files[0];
    if (!selected.type.startsWith("image/")) return;

    setFile(selected);
    const url = URL.createObjectURL(selected);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      imgRef.current = img;
      renderWatermark(img, watermarkText, fontSize, opacity, color, position);
    };
  };

  const renderWatermark = (
    img: HTMLImageElement,
    text: string,
    fSize: number,
    op: number,
    col: string,
    pos: Position
  ) => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw base image
    ctx.drawImage(img, 0, 0);

    ctx.save();
    ctx.globalAlpha = op / 100;
    ctx.fillStyle = col;
    ctx.font = `bold ${fSize}px sans-serif`;
    ctx.textBaseline = "middle";

    const padding = 30;

    if (pos === "tile") {
      // Diagonal tiled watermark pattern across whole image
      ctx.rotate((-30 * Math.PI) / 180);
      const stepX = fSize * 8;
      const stepY = fSize * 4;
      for (let x = -img.width; x < img.width * 2; x += stepX) {
        for (let y = -img.height; y < img.height * 2; y += stepY) {
          ctx.fillText(text, x, y);
        }
      }
    } else {
      // 9 grid points
      const metrics = ctx.measureText(text);
      const textWidth = metrics.width;
      let x = padding;
      let y = padding + fSize / 2;

      if (pos === "tc" || pos === "center" || pos === "bc") {
        x = (canvas.width - textWidth) / 2;
      } else if (pos === "tr" || pos === "mr" || pos === "br") {
        x = canvas.width - textWidth - padding;
      }

      if (pos === "ml" || pos === "center" || pos === "mr") {
        y = canvas.height / 2;
      } else if (pos === "bl" || pos === "bc" || pos === "br") {
        y = canvas.height - padding - fSize / 2;
      }

      // Drop shadow for crisp readability on any background
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      ctx.fillText(text, x, y);
    }

    ctx.restore();

    canvas.toBlob((blob) => {
      if (blob) {
        if (processedUrl) URL.revokeObjectURL(processedUrl);
        setProcessedUrl(URL.createObjectURL(blob));
      }
    }, "image/png");
  };

  const updateWatermark = (
    newText = watermarkText,
    newSize = fontSize,
    newOp = opacity,
    newCol = color,
    newPos = position
  ) => {
    setWatermarkText(newText);
    setFontSize(newSize);
    setOpacity(newOp);
    setColor(newCol);
    setPosition(newPos);

    if (imgRef.current) {
      renderWatermark(imgRef.current, newText, newSize, newOp, newCol, newPos);
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
          <Link href="/category/image" className="hover:text-indigo-600">
            {lang === "bn" ? "ইমেজ টুলস" : "Image Tools"}
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            {lang === "bn" ? "ইমেজ ওয়াটারমার্ক" : "Image Watermark"}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold mb-3">
            <Stamp className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? "কপিরাইট ও সিকিউরিটি" : "Copyright & Branding"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {lang === "bn" ? "ছবিতে ওয়াটারমার্ক যুক্ত করুন" : "Add Watermark to Images"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            {lang === "bn"
              ? "কপিরাইট রক্ষা ও ব্র্যান্ডিং করতে ছবিতে কাস্টম টেক্সট, অপাসিটি এবং ডায়াগোনাল টাইল ওয়াটারমার্ক বসান।"
              : "Protect copyright and brand your photos with custom text, adjustable opacity, and tiled patterns."}
          </p>
        </div>

        {/* Main Workspace */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          {!file ? (
            <label className="border-2 border-dashed border-indigo-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-indigo-50/30 dark:bg-slate-800/40 hover:bg-indigo-50/60 transition-all text-center group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base sm:text-lg mb-1">
                {lang === "bn" ? "ছবি নির্বাচন করুন" : "Select Photo"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === "bn" ? "যেকোনো JPG, PNG বা WebP ছবি ড্রপ বা সিলেক্ট করুন" : "Upload any JPG, PNG or WebP image"}
              </p>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          ) : (
            <div className="space-y-6">
              {/* Controls Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "ওয়াটারমার্ক টেক্সট" : "Watermark Text"}
                  </label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => updateWatermark(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "টেক্সটের রঙ" : "Color"}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => updateWatermark(undefined, undefined, undefined, e.target.value)}
                      className="w-10 h-9 p-0.5 rounded-lg border cursor-pointer bg-white"
                    />
                    <span className="text-xs font-mono font-bold">{color}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>{lang === "bn" ? "ফন্ট সাইজ" : "Font Size"}</span>
                    <span>{fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={14}
                    max={120}
                    value={fontSize}
                    onChange={(e) => updateWatermark(undefined, parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>{lang === "bn" ? "স্বচ্ছতা (Opacity)" : "Opacity"}</span>
                    <span>{opacity}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={opacity}
                    onChange={(e) => updateWatermark(undefined, undefined, parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "অবস্থান (Position)" : "Position"}
                  </label>
                  <select
                    value={position}
                    onChange={(e) => updateWatermark(undefined, undefined, undefined, undefined, e.target.value as Position)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border text-xs font-bold"
                  >
                    <option value="br">নিচে ডানে (Bottom Right)</option>
                    <option value="bc">নিচে মাঝে (Bottom Center)</option>
                    <option value="bl">নিচে বামে (Bottom Left)</option>
                    <option value="center">একদম কেন্দ্রে (Center)</option>
                    <option value="tr">উপরে ডানে (Top Right)</option>
                    <option value="tl">উপরে বামে (Top Left)</option>
                    <option value="tile">সম্পূর্ণ ছবি জুড়ে টাইল (Diagonal Pattern)</option>
                  </select>
                </div>
              </div>

              {/* Preview Container */}
              <div className="p-6 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center space-y-4">
                <div className="max-w-md max-h-96 overflow-hidden rounded-xl shadow-lg border border-slate-300 dark:border-slate-600 bg-white p-2 flex items-center justify-center">
                  {processedUrl && (
                    <img
                      src={processedUrl}
                      alt="Watermarked preview"
                      className="max-h-80 max-w-full object-contain rounded"
                    />
                  )}
                </div>

                {/* Download Actions */}
                <div className="pt-2 flex flex-wrap gap-3">
                  {processedUrl && (
                    <a
                      href={processedUrl}
                      download="toolkaj_watermark.png"
                      className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>{lang === "bn" ? "ওয়াটারমার্ক যুক্ত ছবি ডাউনলোড" : "Download Watermarked Image"}</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setProcessedUrl(null);
                    }}
                    className="px-5 py-3.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{lang === "bn" ? "নতুন ছবি" : "Change Image"}</span>
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
