"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Volume2,
  ArrowLeft,
  Upload,
  Gauge,
  Play,
  Pause,
  Trash2,
  Sparkles,
  Download,
  Loader2,
  CheckCircle2,
  StopCircle,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import ToolSeoSection from "@/components/ToolSeoSection";

export default function VideoSpeedVolumePage() {
  const { lang, t } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [volumeBoost, setVolumeBoost] = useState<number>(100); // 100% to 300%

  // Export & Download
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const isExportingRef = useRef<boolean>(false);
  const recorderRef = useRef<MediaRecorder | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const selected = e.target.files[0];
    if (!selected.type.startsWith("video/")) return;

    setFile(selected);
    const url = URL.createObjectURL(selected);
    setVideoUrl(url);
    setExportedUrl(null);
    setExportError(null);
  };

  /**
   * Helper to initialize Web Audio API once per HTMLMediaElement
   */
  const getOrCreateAudioNodes = () => {
    if (!videoRef.current) return null;

    if (!audioContextRef.current) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const source = ctx.createMediaElementSource(videoRef.current);
        const gainNode = ctx.createGain();

        source.connect(gainNode);
        gainNode.connect(ctx.destination);

        audioContextRef.current = ctx;
        sourceNodeRef.current = source;
        gainNodeRef.current = gainNode;
      } catch (err) {
        console.warn("Could not create Web Audio nodes:", err);
      }
    }

    return {
      ctx: audioContextRef.current,
      source: sourceNodeRef.current,
      gain: gainNodeRef.current,
    };
  };

  const handleSpeedChange = (spd: number) => {
    setPlaybackSpeed(spd);
    if (videoRef.current) {
      videoRef.current.playbackRate = spd;
    }
  };

  const handleVolumeChange = (vol: number) => {
    setVolumeBoost(vol);
    if (!videoRef.current) return;

    const audioNodes = getOrCreateAudioNodes();
    if (audioNodes && audioNodes.gain) {
      if (audioNodes.ctx && audioNodes.ctx.state === "suspended") {
        audioNodes.ctx.resume();
      }
      audioNodes.gain.gain.value = vol / 100;
    } else {
      videoRef.current.volume = Math.min(1, vol / 100);
    }
  };

  /**
   * Export Modified Video with adjusted speed and boosted volume
   */
  const handleExport = async () => {
    if (!file || !videoRef.current) return;
    const video = videoRef.current;

    setIsExporting(true);
    isExportingRef.current = true;
    setExportProgress(0);
    setExportError(null);
    setExportedUrl(null);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 360;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context unavailable");

      const canvasStream = canvas.captureStream(30);

      // Re-use existing audio nodes to prevent "HTMLMediaElement already connected" error
      const audioNodes = getOrCreateAudioNodes();
      let combinedStream = canvasStream;

      if (audioNodes && audioNodes.ctx && audioNodes.gain) {
        if (audioNodes.ctx.state === "suspended") {
          await audioNodes.ctx.resume();
        }
        audioNodes.gain.gain.value = volumeBoost / 100;

        const audioDest = audioNodes.ctx.createMediaStreamDestination();
        audioNodes.gain.connect(audioDest);

        const tracks = [...canvasStream.getVideoTracks(), ...audioDest.stream.getAudioTracks()];
        combinedStream = new MediaStream(tracks);
      }

      let mimeType = "video/webm;codecs=vp8,opus";
      if (MediaRecorder.isTypeSupported("video/mp4;codecs=avc1,mp4a.40.2")) {
        mimeType = "video/mp4;codecs=avc1,mp4a.40.2";
      } else if (MediaRecorder.isTypeSupported("video/webm")) {
        mimeType = "video/webm";
      }

      const recorder = new MediaRecorder(combinedStream, { mimeType });
      recorderRef.current = recorder;
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType.split(";")[0] });
        const downloadUrl = URL.createObjectURL(blob);
        setExportedUrl(downloadUrl);
        setIsExporting(false);
        isExportingRef.current = false;
        setExportProgress(100);
        video.pause();
      };

      recorder.start(500);

      video.currentTime = 0;
      video.playbackRate = playbackSpeed;
      await video.play();

      const duration = video.duration || 10;
      const interval = setInterval(() => {
        if (!isExportingRef.current) {
          clearInterval(interval);
          if (recorder.state === "recording") recorder.stop();
          return;
        }

        if (video.ended || video.currentTime >= duration - 0.1) {
          clearInterval(interval);
          if (recorder.state === "recording") {
            recorder.stop();
          }
        } else {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const pct = Math.min(99, Math.round((video.currentTime / duration) * 100));
          setExportProgress(pct);
        }
      }, 1000 / 30);
    } catch (err: any) {
      console.error("Export error:", err);
      setExportError(err.message || "Export failed");
      setIsExporting(false);
      isExportingRef.current = false;
    }
  };

  const handleStopExport = () => {
    isExportingRef.current = false;
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
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
          <Link href="/category/video" className="hover:text-indigo-600">
            {lang === "bn" ? "ভিডিও ও অডিও" : "Video & Audio"}
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            {lang === "bn" ? "ভিডিও স্পিড ও ভলিউম" : "Speed & Volume Booster"}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold mb-3">
            <Volume2 className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? "গতি ও সাউন্ড বুস্টার" : "Playback & Audio Amplifier"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {lang === "bn" ? "ভিডিও স্পিড ও ভলিউম বুস্টার" : "Video Speed & Volume Booster"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            {lang === "bn"
              ? "ভিডিওর গতি ০.২৫x থেকে ৪x পর্যন্ত পরিবর্তন করুন, সাউন্ড ৩০০% পর্যন্ত বাড়ান এবং পরিবর্তিত ভিডিও ডাউনলোড করুন।"
              : "Amplify video sound up to 300%, adjust speed up to 4x, and export the modified video directly."}
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
                {lang === "bn" ? "ভিডিও আপলোড করুন" : "Upload Video"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === "bn" ? "যেকোনো MP4 বা WebM ফাইল সিলেক্ট করুন" : "Choose any MP4 or WebM video file"}
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
              {/* Video Player */}
              <div className="rounded-2xl overflow-hidden bg-black aspect-video max-h-96 mx-auto flex items-center justify-center shadow-lg">
                {videoUrl && (
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Speed Box */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <Gauge className="w-4 h-4" />
                      {lang === "bn" ? `প্লেব্যাক স্পিড: ${playbackSpeed}x` : `Playback Speed: ${playbackSpeed}x`}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">০.২৫x - ৪.০x</span>
                  </div>
                  <input
                    type="range"
                    min="0.25"
                    max="4"
                    step="0.25"
                    value={playbackSpeed}
                    onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex flex-wrap gap-2 text-xs">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => handleSpeedChange(spd)}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                          playbackSpeed === spd
                            ? "bg-indigo-600 text-white"
                            : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border"
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Volume Box */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4" />
                      {lang === "bn" ? `সাউন্ড ভলিউম: ${volumeBoost}%` : `Volume Booster: ${volumeBoost}%`}
                    </span>
                    {volumeBoost > 100 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        {lang === "bn" ? "অডিও বুস্টেড!" : "Amplified!"}
                      </span>
                    )}
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="300"
                    step="10"
                    value={volumeBoost}
                    onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                  <div className="flex flex-wrap gap-2 text-xs">
                    {[100, 150, 200, 250, 300].map((vol) => (
                      <button
                        key={vol}
                        onClick={() => handleVolumeChange(vol)}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                          volumeBoost === vol
                            ? "bg-purple-600 text-white"
                            : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border"
                        }`}
                      >
                        {vol}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress and Export Status */}
              {isExporting && (
                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-300">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                      {lang === "bn" ? "নতুন স্পিড ও ভলিউমে ভিডিও এক্সপোর্ট হচ্ছে..." : "Processing & exporting video..."}
                    </span>
                    <span>{exportProgress}%</span>
                  </div>
                  <div className="w-full bg-indigo-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleStopExport}
                      className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <StopCircle className="w-3.5 h-3.5" />
                      <span>{lang === "bn" ? "যতটুকু রেন্ডার হয়েছে সেভ করুন" : "Finish & Save Now"}</span>
                    </button>
                  </div>
                </div>
              )}

              {exportError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400">
                  {exportError}
                </div>
              )}

              {/* Export and Download Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap gap-3">
                  {!exportedUrl ? (
                    <button
                      type="button"
                      onClick={handleExport}
                      disabled={isExporting}
                      className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
                    >
                      {isExporting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{lang === "bn" ? `এক্সপোর্ট হচ্ছে (${exportProgress}%)` : `Exporting (${exportProgress}%)`}</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>{lang === "bn" ? "পরিবর্তিত ভিডিও এক্সপোর্ট ও ডাউনলোড" : "Export & Download Modified Video"}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <a
                      href={exportedUrl}
                      download={`modified_speed_${playbackSpeed}x_vol_${volumeBoost}pct.webm`}
                      className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{lang === "bn" ? "ভিডিও ডাউনলোড করুন (রেডি!)" : "Download Video (Ready!)"}</span>
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setVideoUrl(null);
                    setExportedUrl(null);
                  }}
                  className="text-xs text-rose-500 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" /> {lang === "bn" ? "অন্য ভিডিও সিলেক্ট করুন" : "Upload Another Video"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SEO Knowledge & FAQ Section */}
        <ToolSeoSection toolSlug="video/speed-volume" />
      </div>
    </div>
  );
}
