"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Eraser,
  ArrowLeft,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Pipette,
  Trash2,
  Paintbrush,
  Undo2,
  ZoomIn,
  Grid,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function BackgroundRemoverPage() {
  const { lang, t } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);

  // Settings
  const [targetColor, setTargetColor] = useState<{ r: number; g: number; b: number }>({ r: 255, g: 255, b: 255 });
  const [tolerance, setTolerance] = useState<number>(32);
  const [bgReplacement, setBgReplacement] = useState<"transparent" | "white" | "blue" | "gray" | "red">("transparent");
  const [isProcessing, setIsProcessing] = useState(false);
  const [toolMode, setToolMode] = useState<"wand" | "brush" | "restore">("wand");
  const [brushSize, setBrushSize] = useState<number>(20);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const isDrawing = useRef(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const selected = e.target.files[0];
    if (!selected.type.startsWith("image/")) return;

    setFile(selected);
    const url = URL.createObjectURL(selected);
    setOriginalUrl(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      imgRef.current = img;

      // Sample border corner pixel to get initial background color
      const offscreen = document.createElement("canvas");
      offscreen.width = img.width;
      offscreen.height = img.height;
      const oCtx = offscreen.getContext("2d");
      if (oCtx) {
        oCtx.drawImage(img, 0, 0);
        const pixel = oCtx.getImageData(0, 0, 1, 1).data;
        const sampled = { r: pixel[0], g: pixel[1], b: pixel[2] };
        setTargetColor(sampled);
        runEdgeFloodFill(img, sampled, tolerance, bgReplacement);
      }
    };
  };

  /**
   * Edge-Connected BFS Flood Fill:
   * Starts from borders only so interior elements (teeth, white shirts, eyes) are NOT removed!
   */
  const runEdgeFloodFill = (
    img: HTMLImageElement,
    color: { r: number; g: number; b: number },
    tol: number,
    replaceMode: string,
    seedX?: number,
    seedY?: number
  ) => {
    setIsProcessing(true);
    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const width = canvas.width;
    const height = canvas.height;

    const maxDist = (tol / 100) * 441.67;
    const visited = new Uint8Array(width * height);
    const queue: number[] = [];

    const isMatch = (idx: number) => {
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const dist = Math.sqrt(
        Math.pow(r - color.r, 2) + Math.pow(g - color.g, 2) + Math.pow(b - color.b, 2)
      );
      return dist <= maxDist;
    };

    if (seedX !== undefined && seedY !== undefined) {
      // User clicked a specific point to remove
      const seedIdx = seedY * width + seedX;
      queue.push(seedIdx);
      visited[seedIdx] = 1;
    } else {
      // Seed all 4 borders
      for (let x = 0; x < width; x++) {
        const topIdx = x;
        const botIdx = (height - 1) * width + x;
        if (isMatch(topIdx * 4)) {
          visited[topIdx] = 1;
          queue.push(topIdx);
        }
        if (isMatch(botIdx * 4)) {
          visited[botIdx] = 1;
          queue.push(botIdx);
        }
      }

      for (let y = 0; y < height; y++) {
        const leftIdx = y * width;
        const rightIdx = y * width + (width - 1);
        if (!visited[leftIdx] && isMatch(leftIdx * 4)) {
          visited[leftIdx] = 1;
          queue.push(leftIdx);
        }
        if (!visited[rightIdx] && isMatch(rightIdx * 4)) {
          visited[rightIdx] = 1;
          queue.push(rightIdx);
        }
      }
    }

    // BFS Expansion
    let head = 0;
    while (head < queue.length) {
      const curr = queue[head++];
      const cx = curr % width;
      const cy = Math.floor(curr / width);

      // Check 4 cardinal neighbors
      const neighbors = [
        cx > 0 ? curr - 1 : -1,
        cx < width - 1 ? curr + 1 : -1,
        cy > 0 ? curr - width : -1,
        cy < height - 1 ? curr + width : -1,
      ];

      for (let n of neighbors) {
        if (n !== -1 && !visited[n]) {
          if (isMatch(n * 4)) {
            visited[n] = 1;
            queue.push(n);
          }
        }
      }
    }

    // Apply replacement on visited background pixels
    for (let i = 0; i < visited.length; i++) {
      if (visited[i] === 1) {
        const pIdx = i * 4;
        if (replaceMode === "transparent") {
          data[pIdx + 3] = 0; // Transparent
        } else if (replaceMode === "white") {
          data[pIdx] = 255;
          data[pIdx + 1] = 255;
          data[pIdx + 2] = 255;
          data[pIdx + 3] = 255;
        } else if (replaceMode === "blue") {
          data[pIdx] = 41;
          data[pIdx + 1] = 128;
          data[pIdx + 2] = 185;
          data[pIdx + 3] = 255;
        } else if (replaceMode === "gray") {
          data[pIdx] = 241;
          data[pIdx + 1] = 245;
          data[pIdx + 2] = 249;
          data[pIdx + 3] = 255;
        } else if (replaceMode === "red") {
          data[pIdx] = 192;
          data[pIdx + 1] = 57;
          data[pIdx + 2] = 43;
          data[pIdx + 3] = 255;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        if (processedUrl) URL.revokeObjectURL(processedUrl);
        setProcessedUrl(URL.createObjectURL(blob));
      }
      setIsProcessing(false);
    }, "image/png");
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !imgRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = Math.floor((e.clientX - rect.left) * scaleX);
    const clickY = Math.floor((e.clientY - rect.top) * scaleY);

    if (toolMode === "wand") {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const pixel = ctx.getImageData(clickX, clickY, 1, 1).data;
        const sampled = { r: pixel[0], g: pixel[1], b: pixel[2] };
        setTargetColor(sampled);
        runEdgeFloodFill(imgRef.current, sampled, tolerance, bgReplacement, clickX, clickY);
      }
    }
  };

  const reprocess = (newTol: number, newReplace: "transparent" | "white" | "blue" | "gray" | "red") => {
    setTolerance(newTol);
    setBgReplacement(newReplace);
    if (imgRef.current) {
      runEdgeFloodFill(imgRef.current, targetColor, newTol, newReplace);
    }
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
            {lang === "bn" ? "ব্যাকগ্রাউন্ড রিমুভার" : "Background Remover"}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold mb-3">
            <Eraser className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? "স্মার্ট এজ-ডিটেকশন" : "Edge-Aware Flood Fill"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {lang === "bn" ? "স্মার্ট ছবির ব্যাকগ্রাউন্ড রিমুভার" : "Smart Image Background Remover"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            {lang === "bn"
              ? "নিখুঁতভাবে বাইরের ব্যাকগ্রাউন্ড মুছে স্বচ্ছ PNG বানান অথবা পাসপোর্ট ব্লু, সাদা কিংবা পছন্দসই রঙ দিন।"
              : "Cleanly remove exterior background into transparent PNG, or replace with official passport blue or white."}
          </p>
        </div>

        {/* Main Workspace */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          {!file ? (
            <label className="border-2 border-dashed border-indigo-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer bg-indigo-50/30 dark:bg-slate-800/40 hover:bg-indigo-50/60 transition-all text-center group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base sm:text-lg mb-1">
                {lang === "bn" ? "ছবি আপলোড করুন" : "Upload Your Image"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === "bn" ? "যেকোনো পোর্ট্রেট বা প্রোডাক্ট ছবি নির্বাচন করুন" : "Select any portrait or product photo (JPG, PNG, WebP)"}
              </p>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          ) : (
            <div className="space-y-6">
              {/* Toolbar Controls */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                {/* Background Replacement Color */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-1">
                    {lang === "bn" ? "ব্যাকগ্রাউন্ড:" : "Background:"}
                  </span>
                  <button
                    type="button"
                    onClick={() => reprocess(tolerance, "transparent")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      bgReplacement === "transparent"
                        ? "bg-indigo-600 text-white border-indigo-600 shadow"
                        : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>{lang === "bn" ? "স্বচ্ছ (Transparent)" : "Transparent"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => reprocess(tolerance, "blue")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      bgReplacement === "blue"
                        ? "bg-blue-600 text-white border-blue-600 shadow"
                        : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-500 border border-white/60 shadow-sm shrink-0" />
                    <span>{lang === "bn" ? "পাসপোর্ট ব্লু" : "Passport Blue"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => reprocess(tolerance, "white")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      bgReplacement === "white"
                        ? "bg-slate-800 text-white border-slate-800 shadow"
                        : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white border border-slate-300 shadow-sm shrink-0" />
                    <span>{lang === "bn" ? "সাদা (White)" : "White"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => reprocess(tolerance, "gray")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      bgReplacement === "gray"
                        ? "bg-slate-600 text-white border-slate-600 shadow"
                        : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-400 border border-white/60 shadow-sm shrink-0" />
                    <span>{lang === "bn" ? "স্টুডিও গ্রে" : "Studio Gray"}</span>
                  </button>
                </div>

                {/* Tolerance Slider */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {lang === "bn" ? "সহনশীলতা (Tolerance):" : "Tolerance:"} {tolerance}%
                  </span>
                  <input
                    type="range"
                    min={5}
                    max={75}
                    value={tolerance}
                    onChange={(e) => reprocess(parseInt(e.target.value), bgReplacement)}
                    className="w-28 sm:w-36 accent-indigo-600"
                  />
                </div>
              </div>

              {/* Interactive Preview Canvas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Original */}
                <div className="space-y-2 text-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    {lang === "bn" ? "মূল ছবি" : "Original Image"}
                  </span>
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-center max-h-80 overflow-hidden">
                    {originalUrl && (
                      <img src={originalUrl} alt="Original" className="max-h-72 object-contain rounded-xl" />
                    )}
                  </div>
                </div>

                {/* Processed Canvas Output */}
                <div className="space-y-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                      {lang === "bn" ? "ফলাফল (ক্লিক করে অতিরিক্ত দাগ মুছুন)" : "Result (Click to erase spots)"}
                    </span>
                  </div>
                  <div
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center max-h-80 overflow-hidden relative cursor-crosshair"
                    style={{
                      backgroundImage:
                        bgReplacement === "transparent"
                          ? "linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)"
                          : undefined,
                      backgroundSize: "20px 20px",
                      backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                    }}
                  >
                    <canvas
                      ref={canvasRef}
                      onClick={handleCanvasClick}
                      className="max-h-72 max-w-full object-contain rounded-xl shadow"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-wrap justify-center gap-4">
                {processedUrl && (
                  <a
                    href={processedUrl}
                    download="toolkaj_bg_removed.png"
                    className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>{lang === "bn" ? "স্বচ্ছ PNG ছবি ডাউনলোড করুন" : "Download Transparent PNG"}</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setOriginalUrl(null);
                    setProcessedUrl(null);
                  }}
                  className="px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{lang === "bn" ? "নতুন ছবি নিন" : "Upload Another"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
