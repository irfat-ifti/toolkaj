"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Music,
  ArrowLeft,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  Video,
  Loader2,
  Play,
  Pause,
  Trash2,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function VideoToAudioPage() {
  const { lang, t } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioSize, setAudioSize] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Helper: encode AudioBuffer into standard WAV Blob
  const audioBufferToWav = (buffer: AudioBuffer): Blob => {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    let result: Float32Array;
    if (numChannels === 2) {
      const left = buffer.getChannelData(0);
      const right = buffer.getChannelData(1);
      result = new Float32Array(left.length + right.length);
      for (let i = 0; i < left.length; i++) {
        result[i * 2] = left[i];
        result[i * 2 + 1] = right[i];
      }
    } else {
      result = buffer.getChannelData(0);
    }

    const dataLength = result.length * (bitDepth / 8);
    const bufferArray = new ArrayBuffer(44 + dataLength);
    const view = new DataView(bufferArray);

    // Write WAV header
    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, 36 + dataLength, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
    view.setUint16(32, numChannels * (bitDepth / 8), true);
    view.setUint16(34, bitDepth, true);
    writeString(36, "data");
    view.setUint32(40, dataLength, true);

    // Write PCM samples
    let offset = 44;
    for (let i = 0; i < result.length; i++) {
      const s = Math.max(-1, Math.min(1, result[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }

    return new Blob([view], { type: "audio/wav" });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const selected = e.target.files[0];
    if (!selected.type.startsWith("video/")) {
      setError(lang === "bn" ? "অনুগ্রহ করে একটি ভিডিও ফাইল সিলেক্ট করুন" : "Please select a valid video file");
      return;
    }

    setError(null);
    setFile(selected);
    setAudioUrl(null);

    try {
      setIsProcessing(true);
      setProgressText(lang === "bn" ? "ভিডিও ডেটা রিড করা হচ্ছে..." : "Reading video file...");

      const arrayBuffer = await selected.arrayBuffer();
      setProgressText(lang === "bn" ? "অডিও ট্র্যাক আলাদা করা হচ্ছে..." : "Decoding audio track...");

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      setProgressText(lang === "bn" ? "অডিও ফরম্যাট তৈরি হচ্ছে..." : "Encoding WAV audio...");
      const wavBlob = audioBufferToWav(decodedBuffer);
      const url = URL.createObjectURL(wavBlob);

      setAudioUrl(url);
      setAudioDuration(decodedBuffer.duration);
      setAudioSize(wavBlob.size);
      setIsProcessing(false);
      audioCtx.close();
    } catch (err: any) {
      console.error(err);
      setError(
        lang === "bn"
          ? "ভিডিওটিতে কোনো সক্রিয় অডিও ট্র্যাক পাওয়া যায়নি বা ফরম্যাট সমর্থিত নয়।"
          : "Could not find an audio track or format is unsupported."
      );
      setIsProcessing(false);
    }
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = Math.floor(sec % 60);
    return `${mins}:${remainingSec < 10 ? "0" : ""}${remainingSec}`;
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
            {lang === "bn" ? "ভিডিও থেকে অডিও" : "Video to Audio"}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold mb-3">
            <Music className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? "এইচডি অডিও এক্সট্র্যাক্ট" : "HD Audio Extraction"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {lang === "bn" ? "ভিডিও থেকে অডিও কনভার্টার" : "Extract Audio from Video"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            {lang === "bn"
              ? "যেকোনো MP4, WebM বা ভিডিও ফাইল থেকে অডিও অংশ আলাদা করে পরিষ্কার সাউন্ড ট্র্যাক ডাউনলোড করুন।"
              : "Extract crystal clear audio tracks from any video file with instant in-browser playback & download."}
          </p>
        </div>

        {/* Workspace */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          {!file ? (
            <label className="border-2 border-dashed border-indigo-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-indigo-50/30 dark:bg-slate-800/40 hover:bg-indigo-50/60 transition-all text-center group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Video className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base sm:text-lg mb-1">
                {lang === "bn" ? "ভিডিও ফাইল নির্বাচন করুন" : "Select a video file"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === "bn" ? "MP4, WebM, MOV ফরম্যাট সমর্থিত • ১০০% অফলাইন" : "MP4, WebM, MOV supported • 100% client side"}
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
              {/* File Info */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFile(null);
                    setAudioUrl(null);
                  }}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                  title="মুছুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {isProcessing && (
                <div className="p-8 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {progressText}
                  </p>
                </div>
              )}

              {/* Audio Result & Player */}
              {audioUrl && !isProcessing && (
                <div className="p-6 rounded-2xl bg-indigo-50/60 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 space-y-5 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                        {lang === "bn" ? "অডিও প্রস্তুত" : "Audio Ready"}
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                        {file.name.replace(/\.[^/.]+$/, "")}.wav
                      </h4>
                      <p className="text-xs text-slate-500">
                        {formatSeconds(audioDuration)} • {(audioSize / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>

                    <button
                      onClick={togglePlayback}
                      className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                  </div>

                  {/* Hidden standard player */}
                  <audio
                    ref={audioPlayerRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    controls
                    className="w-full mt-2"
                  />

                  {/* Download button */}
                  <div className="pt-2">
                    <a
                      href={audioUrl}
                      download={`toolkaj_audio_${file.name.replace(/\.[^/.]+$/, "")}.wav`}
                      className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <Download className="w-4 h-4" />
                      <span>{lang === "bn" ? "অডিও ডাউনলোড করুন (.wav)" : "Download Audio (.wav)"}</span>
                    </a>
                  </div>
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
