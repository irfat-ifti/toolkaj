"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Film,
  ArrowLeft,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  Video,
  Loader2,
  Trash2,
  Sparkles,
  Play,
  Zap,
  StopCircle,
  Clock,
  Scissors,
  Lightbulb,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function VideoCompressPage() {
  const { lang, t } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);

  // Compression options
  const [targetQuality, setTargetQuality] = useState<"whatsapp" | "medium" | "low">("whatsapp");
  const [clipMode, setClipMode] = useState<"30s" | "60s" | "180s" | "full">("30s");
  const [encodeSpeed, setEncodeSpeed] = useState<number>(3); // 3x playback speed during encode for 3x faster processing
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [encodedSeconds, setEncodedSeconds] = useState<number>(0);
  const [compressedBlobUrl, setCompressedBlobUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isCompressingRef = useRef<boolean>(false);
  const recorderRef = useRef<MediaRecorder | null>(null);

  // Cached audio nodes to prevent "HTMLMediaElement already connected" InvalidStateError
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const selected = e.target.files[0];
    if (!selected.type.startsWith("video/")) {
      setError(lang === "bn" ? "অনুগ্রহ করে একটি সঠিক ভিডিও ফাইল নির্বাচন করুন" : "Please select a valid video file");
      return;
    }

    setError(null);
    setFile(selected);
    setOriginalSize(selected.size);
    setCompressedBlobUrl(null);

    const url = URL.createObjectURL(selected);
    setVideoSrc(url);
  };

  const getTargetSeconds = () => {
    const total = videoDuration || 10;
    if (clipMode === "30s") return Math.min(30, total);
    if (clipMode === "60s") return Math.min(60, total);
    if (clipMode === "180s") return Math.min(180, total);
    return total;
  };

  const startCompression = async () => {
    if (!file || !videoRef.current) return;
    setIsCompressing(true);
    isCompressingRef.current = true;
    setProgress(0);
    setEncodedSeconds(0);
    setError(null);

    const video = videoRef.current;
    video.currentTime = 0;
    video.muted = false;

    // Dimensions & Bitrate
    let targetWidth = 640;
    let targetHeight = 360;
    let targetBitrate = 450000; // 450 kbps for WhatsApp

    if (targetQuality === "medium") {
      targetWidth = 854;
      targetHeight = 480;
      targetBitrate = 900000; // 900 kbps
    } else if (targetQuality === "low") {
      targetWidth = 480;
      targetHeight = 270;
      targetBitrate = 250000; // 250 kbps
    }

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setError("Canvas is not supported in this browser");
      setIsCompressing(false);
      isCompressingRef.current = false;
      return;
    }

    let combinedStream: MediaStream;
    try {
      const canvasStream = canvas.captureStream(24);

      // Re-use or initialize single AudioContext to prevent InvalidStateError
      try {
        if (!audioContextRef.current) {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          const aCtx = new AudioCtx();
          const source = aCtx.createMediaElementSource(video);
          audioContextRef.current = aCtx;
          sourceNodeRef.current = source;
        }

        if (audioContextRef.current.state === "suspended") {
          await audioContextRef.current.resume();
        }

        const dest = audioContextRef.current.createMediaStreamDestination();
        if (sourceNodeRef.current) {
          sourceNodeRef.current.connect(dest);
          const audioTrack = dest.stream.getAudioTracks()[0];
          if (audioTrack) {
            canvasStream.addTrack(audioTrack);
          }
        }
      } catch (audioErr) {
        console.warn("Audio capture fallback to video only:", audioErr);
      }

      combinedStream = canvasStream;
    } catch (err: any) {
      setError("Canvas/Audio capture error in browser");
      setIsCompressing(false);
      isCompressingRef.current = false;
      return;
    }

    let mimeType = "video/webm;codecs=vp8";
    if (MediaRecorder.isTypeSupported("video/mp4;codecs=avc1")) {
      mimeType = "video/mp4;codecs=avc1";
    } else if (MediaRecorder.isTypeSupported("video/webm;codecs=h264")) {
      mimeType = "video/webm;codecs=h264";
    }

    const recorder = new MediaRecorder(combinedStream, {
      mimeType,
      videoBitsPerSecond: targetBitrate,
    });
    recorderRef.current = recorder;

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const compressedBlob = new Blob(chunks, { type: mimeType.split(";")[0] });
      const compUrl = URL.createObjectURL(compressedBlob);
      setCompressedBlobUrl(compUrl);
      setCompressedSize(compressedBlob.size);
      setIsCompressing(false);
      isCompressingRef.current = false;
      setProgress(100);
      video.pause();
    };

    recorder.start(500);

    video.playbackRate = encodeSpeed;
    await video.play();

    const maxSeconds = getTargetSeconds();

    const interval = setInterval(() => {
      if (!isCompressingRef.current) {
        clearInterval(interval);
        if (recorder.state === "recording") recorder.stop();
        return;
      }

      // Check if finished target duration or video ended
      if (video.ended || video.currentTime >= maxSeconds - 0.2) {
        clearInterval(interval);
        if (recorder.state === "recording") recorder.stop();
        return;
      }

      // Handle buffering seamlessly without aborting
      if (video.paused && !video.ended && video.readyState >= 2) {
        video.play().catch(() => {});
      }

      if (!video.paused) {
        ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
        setEncodedSeconds(Math.round(video.currentTime));
        const percent = Math.min(99, Math.round((video.currentTime / maxSeconds) * 100));
        setProgress(percent);
      }
    }, 1000 / 24);
  };

  const handleStopCompression = () => {
    isCompressingRef.current = false;
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
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
          <Link href="/category/video" className="hover:text-indigo-600">
            {lang === "bn" ? "ভিডিও ও অডিও" : "Video & Audio"}
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            {lang === "bn" ? "ভিডিও কম্প্রেস" : "Compress Video"}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold mb-3">
            <Film className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? "সুপারফাস্ট ভিডিও এনকোডার" : "Superfast Video Encoder"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {lang === "bn" ? "ভিডিও কম্প্রেসার ও সাইজ কমান" : "Compress & Reduce Video Size"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            {lang === "bn"
              ? "WhatsApp বা সোশ্যাল মিডিয়ার জন্য ভিডিও কম্প্রেস করুন। ৩x স্পিড অ্যাক্সিলারেশন এবং লাইভ সেভ ফিচারসহ।"
              : "Compress videos for WhatsApp and social media with 3x acceleration and instant download available anytime."}
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
                {lang === "bn" ? "ভিডিও ফাইল আপলোড করুন" : "Upload Video File"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === "bn" ? "যেকোনো দৈর্ঘ্যের MP4 বা WebM ফাইল • ১০০% সুরক্ষিত ও ব্রাউজারে" : "Any duration MP4 or WebM • 100% Client-Side"}
              </p>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-6">
              {/* File details & Hidden Player */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border flex items-center justify-between">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {lang === "bn" ? "আসল সাইজ: " : "Original: "}
                      {formatBytes(originalSize)}
                      {videoDuration > 0 && ` • মোট দৈর্ঘ্য: ${formatTime(videoDuration)}`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFile(null);
                    setVideoSrc(null);
                    setCompressedBlobUrl(null);
                    setVideoDuration(0);
                  }}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                  title="মুছুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Video Element for rendering */}
              <div className="rounded-2xl overflow-hidden bg-black max-h-72 mx-auto flex items-center justify-center shadow-md">
                {videoSrc && (
                  <video
                    ref={videoRef}
                    src={videoSrc}
                    controls
                    playsInline
                    onLoadedMetadata={(e) => setVideoDuration(e.currentTarget.duration || 0)}
                    className="max-h-72 w-full object-contain"
                  />
                )}
              </div>

              {/* Clip Duration Selector (Crucial for long videos!) */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Scissors className="w-4 h-4 text-indigo-500" />
                    {lang === "bn" ? "কতটুকু কম্প্রেস করতে চান? (দৈর্ঘ্য নির্বাচন করুন)" : "How much to compress? (Duration Selection)"}
                  </span>
                  {videoDuration > 0 && (
                    <span className="text-[11px] font-semibold text-slate-400">
                      ভিডিওর দৈর্ঘ্য: {formatTime(videoDuration)}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    {
                      id: "30s" as const,
                      labelBn: "প্রথম ৩০ সেকেন্ড",
                      labelEn: "First 30s (WhatsApp)",
                      badgeText: "সুপারফাস্ট (~১০ সে.)",
                      hasZap: true,
                    },
                    {
                      id: "60s" as const,
                      labelBn: "প্রথম ১ মিনিট",
                      labelEn: "First 1 Min",
                      badgeText: "দ্রুত (~২০ সে.)",
                      hasZap: true,
                    },
                    {
                      id: "180s" as const,
                      labelBn: "প্রথম ৩ মিনিট",
                      labelEn: "First 3 Mins",
                      badgeText: "স্ট্যান্ডার্ড ক্লিপ",
                      hasZap: false,
                    },
                    {
                      id: "full" as const,
                      labelBn: "সম্পূর্ণ ভিডিও",
                      labelEn: "Full Video",
                      badgeText: videoDuration > 300 ? "দীর্ঘ সময় লাগবে" : "সম্পূর্ণ",
                      hasZap: false,
                    },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setClipMode(c.id)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        clipMode === c.id
                          ? "bg-indigo-600 text-white border-indigo-600 shadow"
                          : "bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      <p className="font-bold text-xs">{lang === "bn" ? c.labelBn : c.labelEn}</p>
                      <p className={`text-[10px] mt-1 font-semibold flex items-center gap-1 ${clipMode === c.id ? "text-indigo-200" : "text-slate-400"}`}>
                        {c.hasZap && <Zap className="w-2.5 h-2.5 text-amber-400 shrink-0" />}
                        <span>{c.badgeText}</span>
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality & Speed Options */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border space-y-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    {lang === "bn" ? "টার্গেট কোয়ালিটি ও সাইজ" : "Target Quality & Size"}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: "whatsapp" as const,
                        title: lang === "bn" ? "হোয়াটসঅ্যাপ ফ্রেন্ডলি" : "WhatsApp / Social",
                        desc: "360p • 450 kbps (~75% ছোট)",
                      },
                      {
                        id: "medium" as const,
                        title: lang === "bn" ? "স্ট্যান্ডার্ড কোয়ালিটি" : "Standard HD",
                        desc: "480p • 900 kbps (~50% ছোট)",
                      },
                      {
                        id: "low" as const,
                        title: lang === "bn" ? "সর্বোচ্চ ছোট" : "Extreme Saver",
                        desc: "270p • 250 kbps (~85% ছোট)",
                      },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setTargetQuality(p.id)}
                        className={`p-3.5 rounded-xl text-left border transition-all ${
                          targetQuality === p.id
                            ? "bg-indigo-50 border-indigo-600 dark:bg-indigo-950/60 dark:border-indigo-400 text-indigo-900 dark:text-indigo-200"
                            : "bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <p className="font-bold text-xs">{p.title}</p>
                        <p className="text-[11px] text-slate-500 mt-1">{p.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Encode Speed / Acceleration */}
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {lang === "bn" ? "এনকোডিং গতি (অ্যাক্সিলারেশন):" : "Encoding Speed Acceleration:"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { speed: 1, label: "1x (Normal)" },
                      { speed: 2, label: "2x (Fast)" },
                      { speed: 3, label: "3x (Super Fast)" },
                      { speed: 4, label: "4x (Turbo)" },
                    ].map((s) => (
                      <button
                        key={s.speed}
                        type="button"
                        onClick={() => setEncodeSpeed(s.speed)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          encodeSpeed === s.speed
                            ? "bg-indigo-600 text-white border-indigo-600 shadow"
                            : "bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {!isCompressing && !compressedBlobUrl && (
                <button
                  onClick={startCompression}
                  className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Film className="w-4 h-4" />
                  <span>
                    {lang === "bn"
                      ? `ভিডিও কম্প্রেস শুরু করুন (${clipMode === "full" ? "সম্পূর্ণ" : clipMode} ক্লিপ)`
                      : `Start Video Compression (${clipMode === "full" ? "Full" : clipMode})`}
                  </span>
                </button>
              )}

              {/* Progress bar and Instant Save Button */}
              {isCompressing && (
                <div className="space-y-4 p-5 rounded-2xl bg-indigo-50/70 dark:bg-slate-800/80 border border-indigo-200 dark:border-indigo-900">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                      {lang === "bn"
                        ? `ভিডিও এনকোড হচ্ছে (${encodeSpeed}x গতিতে • ${encodedSeconds} সেকেন্ড সম্পন্ন)...`
                        : `Encoding at ${encodeSpeed}x (${encodedSeconds}s processed)...`}
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${progress}%` }}
                      className="h-full bg-indigo-600 transition-all duration-200"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{lang === "bn" ? "পুরো ভিডিও শেষ হওয়া পর্যন্ত অপেক্ষা করতে না চাইলে যেকোনো সময় সেভ করতে পারেন:" : "You can stop and download anytime:"}</span>
                    </p>
                    <button
                      type="button"
                      onClick={handleStopCompression}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{lang === "bn" ? "এখনই সেভ ও ডাউনলোড করুন" : "Save & Download Now"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Result Download Card */}
              {compressedBlobUrl && (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-4 animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                      {lang === "bn" ? "ভিডিও সফলভাবে কম্প্রেস সম্পন্ন হয়েছে!" : "Video Compressed Successfully!"}
                    </h3>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                      {lang === "bn"
                        ? `নতুন সাইজ: ${formatBytes(compressedSize)} (${formatBytes(originalSize)} থেকে -${savedPercent}% সাইজ কমেছে)`
                        : `New Size: ${formatBytes(compressedSize)} (Saved -${savedPercent}% from ${formatBytes(originalSize)})`}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <a
                      href={compressedBlobUrl}
                      download={`toolkaj_compressed_${file.name.replace(/\.[^/.]+$/, "")}.webm`}
                      className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>{lang === "bn" ? "কম্প্রেসড ভিডিও ডাউনলোড করুন" : "Download Compressed Video"}</span>
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
