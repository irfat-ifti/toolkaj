"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Video, Download, Copy, Check, ExternalLink, Image as ImageIcon } from "lucide-react";

export default function YouTubeThumbnailPage() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const extractVideoId = (input: string): string | null => {
    if (!input) return null;
    const clean = input.trim();

    // Standard watch URL: youtube.com/watch?v=xyz
    const watchMatch = clean.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (watchMatch && watchMatch[1]) {
      return watchMatch[1];
    }
    // Direct ID input
    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
      return clean;
    }
    return null;
  };

  const handleFetch = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(url);
    if (id) {
      setVideoId(id);
    } else {
      alert("সঠিক ইউটিউব ভিডিও লিংক প্রদান করুন (যেমন: https://www.youtube.com/watch?v=dQw4w9WgXcQ)");
    }
  };

  const thumbnailQualities = videoId
    ? [
        {
          label: "আল্ট্রা এইচডি (1080p HD)",
          sub: "maxresdefault.jpg (1920x1080)",
          url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          badge: "Highest Quality",
        },
        {
          label: "হাই কোয়ালিটি (720p)",
          sub: "hqdefault.jpg (480x360)",
          url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          badge: "Popular",
        },
        {
          label: "মিডিয়াম কোয়ালিটি (480p)",
          sub: "mqdefault.jpg (320x180)",
          url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
          badge: "Fast Load",
        },
        {
          label: "স্ট্যান্ডার্ড সাইজ (360p)",
          sub: "sddefault.jpg (640x480)",
          url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
          badge: "Standard",
        },
      ]
    : [];

  const handleDownload = async (imgUrl: string, label: string) => {
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `youtube_thumbnail_${videoId}_${label.toLowerCase().replace(/\s+/g, "_")}.jpg`;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Direct fallback if cors
      window.open(imgUrl, "_blank");
    }
  };

  const copyUrl = (imgUrl: string) => {
    navigator.clipboard.writeText(imgUrl);
    setCopiedLink(imgUrl);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="w-full py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-indigo-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> হোম
          </Link>
          <span>/</span>
          <Link href="/category/social" className="hover:text-indigo-600">
            সোশ্যাল মিডিয়া
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            ইউটিউব থাম্বনেইল ডাউনলোডার
          </span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-xs font-semibold mb-3">
            <Video className="w-4 h-4 text-rose-600 fill-current" /> HD 1080p কোয়ালিটি ডাউনলোডার
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            ইউটিউব থাম্বনেইল ডাউনলোডার (YouTube Thumbnail Downloader)
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            যেকোনো YouTube ভিডিও বা Shorts-এর মূল থাম্বনেইল 1080p, 720p রেজোলিউশনে সরাসরি ডাউনলোড করুন এক ক্লিকে।
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm mb-10">
          <form onSubmit={handleFetch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Video className="w-5 h-5 text-rose-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="ইউটিউব ভিডিওর লিংক এখানে পেস্ট করুন... (যেমন: https://youtu.be/...)"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <button
              type="submit"
              className="py-3.5 px-8 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all shrink-0"
            >
              থাম্বনেইল বের করুন
            </button>
          </form>
        </div>

        {/* Thumbnail Results Grid */}
        {thumbnailQualities.length > 0 && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-rose-500" />
                <span>উপলব্ধ থাম্বনেইলসমূহ (Video ID: {videoId})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {thumbnailQualities.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden group">
                    <img
                      src={item.url}
                      alt={item.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 text-white backdrop-blur-sm">
                      {item.badge}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="mb-4">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {item.label}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownload(item.url, item.label)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>ডাউনলোড (JPG)</span>
                      </button>
                      <button
                        onClick={() => copyUrl(item.url)}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold"
                        title="লিংক কপি করুন"
                      >
                        {copiedLink === item.url ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold"
                        title="নতুন ট্যাবে ফুল প্রিভিউ"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
