"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Sparkles, Copy, Check, Share2, Play, Flame, Send, PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";
import { useApp } from "@/context/AppContext";
import ToolSeoSection from "@/components/ToolSeoSection";

const DODGE_TEXTS = [
  "No",
  "Nope!",
  "Missed me!",
  "Try again!",
  "Think again!",
  "Wrong button!",
  "Are you sure?",
  "Just say YES!",
  "Can't catch me!",
];

export default function HeartTracePage() {
  const { lang, t } = useApp();
  const [senderName, setSenderName] = useState("Someone Special");
  const [receiverName, setReceiverName] = useState("My Love");
  const [question, setQuestion] = useState("Will you be mine forever?");
  const [acceptanceMessage, setAcceptanceMessage] = useState(
    "Yay! You just made me the happiest person in the world!"
  );
  const [shareableUrl, setShareableUrl] = useState("");
  const [copied, setCopied] = useState(false);

  // Play mode (when viewing a created proposal link)
  const [isViewing, setIsViewing] = useState(false);
  const [answeredYes, setAnsweredYes] = useState(false);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noText, setNoText] = useState("No");

  const arenaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const to = params.get("to");
      const from = params.get("from");
      const q = params.get("q");
      const ans = params.get("ans");

      if (to && from) {
        setIsViewing(true);
        setReceiverName(decodeURIComponent(to));
        setSenderName(decodeURIComponent(from));
        if (q) setQuestion(decodeURIComponent(q));
        if (ans) setAcceptanceMessage(decodeURIComponent(ans));
      }
    }
  }, []);

  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    const base = typeof window !== "undefined" ? window.location.origin : "https://toolkaj.vercel.app";
    const link = `${base}/tools/social/heart-trace?to=${encodeURIComponent(
      receiverName.trim()
    )}&from=${encodeURIComponent(senderName.trim())}&q=${encodeURIComponent(
      question.trim()
    )}&ans=${encodeURIComponent(acceptanceMessage.trim())}`;

    setShareableUrl(link);
  };

  const copyLink = () => {
    if (!shareableUrl) return;
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /**
   * 100% Uncatchable No Button:
   * Leaps away instantly with a large displacement (160px - 260px) in a random direction.
   */
  const dodgeNoButton = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const arenaWidth = arenaRef.current ? arenaRef.current.clientWidth : 320;
    const maxX = Math.max(120, arenaWidth / 2 - 60);
    const maxY = 130;

    // Pick a new position at least 150px away from the current position
    let newX = 0;
    let newY = 0;
    let attempts = 0;

    do {
      const angle = Math.random() * Math.PI * 2;
      const distance = 140 + Math.random() * 120;
      newX = Math.cos(angle) * distance;
      newY = Math.sin(angle) * distance;
      attempts++;
    } while (
      attempts < 10 &&
      (Math.abs(newX - noPos.x) < 100 || Math.abs(newX) > maxX || Math.abs(newY) > maxY)
    );

    // Clamp inside arena bounds
    newX = Math.max(-maxX, Math.min(maxX, newX));
    newY = Math.max(-maxY, Math.min(maxY, newY));

    setNoPos({ x: Math.round(newX), y: Math.round(newY) });
    setDodgeCount((prev) => prev + 1);
    setNoText(DODGE_TEXTS[(dodgeCount + 1) % DODGE_TEXTS.length]);
  };

  const handleYesClick = () => {
    setAnsweredYes(true);
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#ec4899", "#f43f5e", "#fb7185", "#ffd700"],
    });
  };

  return (
    <div className="w-full py-12 bg-gradient-to-b from-rose-50/60 via-pink-50/40 to-slate-50 dark:from-slate-950 dark:to-slate-900 min-h-screen relative overflow-hidden">
      {/* Floating Decorative Hearts */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-30 dark:opacity-20">
        <Heart className="absolute top-10 left-10 w-8 h-8 text-rose-300 animate-pulse" />
        <Heart className="absolute top-40 right-20 w-12 h-12 text-pink-400 animate-bounce" />
        <Heart className="absolute bottom-20 left-1/4 w-10 h-10 text-rose-400 animate-pulse" />
        <Heart className="absolute top-1/2 right-10 w-6 h-6 text-rose-300 animate-bounce" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb */}
        {!isViewing && (
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-rose-600 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> {lang === "bn" ? "হোম" : "Home"}
            </Link>
            <span>/</span>
            <Link href="/category/social" className="hover:text-rose-600">
              {lang === "bn" ? "সোশ্যাল মিডিয়া" : "Social Media"}
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              {lang === "bn" ? "হার্টট্রেস - প্রপোজাল লিংক" : "HeartTrace Proposal Link"}
            </span>
          </div>
        )}

        {/* View Mode (The Recipient opens this link!) */}
        {isViewing ? (
          <div className="max-w-md mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl border-2 border-rose-200 dark:border-rose-950 p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-fade-in relative overflow-hidden">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center shadow-lg shadow-rose-200 dark:shadow-none animate-pulse">
              <Heart className="w-12 h-12 fill-current" />
            </div>

            {!answeredYes ? (
              <>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-rose-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>A Special Question for {receiverName}</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                    {question}
                  </h1>
                  <p className="text-xs font-semibold text-slate-400">
                    With endless affection from <strong className="text-rose-500">{senderName}</strong>
                  </p>
                </div>

                {/* The Romantic Arena with Evasive Button */}
                <div
                  ref={arenaRef}
                  onPointerMove={(e) => {
                    // Preemptive dodge if cursor gets within 60px of the No button
                    const target = e.target as HTMLElement;
                    if (target && target.closest("#no-button")) {
                      dodgeNoButton(e);
                    }
                  }}
                  className="pt-6 relative min-h-[160px] flex items-center justify-center gap-4 select-none"
                >
                  {/* YES Button grows with every attempt! */}
                  <button
                    onClick={handleYesClick}
                    style={{
                      transform: `scale(${Math.min(1.6, 1 + dodgeCount * 0.08)})`,
                      transition: "transform 0.2s ease-out",
                    }}
                    className="py-3 px-8 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-black text-lg shadow-xl shadow-rose-300 dark:shadow-none cursor-pointer z-20 shrink-0 inline-flex items-center gap-2"
                  >
                    <span>YES!</span>
                    <Heart className="w-5 h-5 fill-white text-white animate-pulse" />
                  </button>

                  {/* 100% Uncatchable No Button */}
                  <button
                    id="no-button"
                    onMouseEnter={dodgeNoButton}
                    onMouseMove={dodgeNoButton}
                    onPointerOver={dodgeNoButton}
                    onPointerDown={dodgeNoButton}
                    onTouchStart={dodgeNoButton}
                    onClick={dodgeNoButton}
                    onFocus={dodgeNoButton}
                    style={{
                      transform: `translate(${noPos.x}px, ${noPos.y}px)`,
                      transition: "transform 0.08s ease-out",
                    }}
                    className="py-2.5 px-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs shadow-md cursor-pointer select-none border border-slate-300 dark:border-slate-700 whitespace-nowrap z-10"
                  >
                    {noText}
                  </button>
                </div>

                {dodgeCount > 0 && (
                  <p className="text-[11px] text-rose-500 font-bold italic animate-fade-in flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span>{dodgeCount >= 5 ? "Resistance is futile! Just click YES!" : "The No button seems to be running away from you!"}</span>
                  </p>
                )}
              </>
            ) : (
              <div className="space-y-4 py-4 animate-fade-in">
                <div className="flex items-center justify-center gap-2 text-rose-500 py-2">
                  <PartyPopper className="w-10 h-10 animate-bounce" />
                  <Heart className="w-12 h-12 fill-rose-500 animate-pulse" />
                  <Sparkles className="w-10 h-10 animate-bounce" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
                  SHE / HE SAID YES!
                </h2>
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                    {acceptanceMessage}
                  </p>
                </div>
                <div className="pt-2 text-xs text-slate-400 flex items-center justify-center gap-1">
                  <span>Happily forever with <strong>{senderName}</strong></span>
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline" />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Creator Mode */
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-xs font-semibold">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>{lang === "bn" ? "রোমান্টিক প্রপোজাল লিংক" : "Interactive Romantic Link"}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                {lang === "bn" ? "হার্টট্রেস - রোমান্টিক প্রপোজাল পেজ তৈরি করুন" : "HeartTrace Proposal Creator"}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {lang === "bn"
                  ? "আপনার প্রিয়জনকে প্রশ্ন করুন — যেখানে 'No' বাটনে ক্লিক করা অসম্ভব! সে শুধু 'YES' বলতেই বাধ্য হবে!"
                  : "Create an interactive proposal page where the 'No' button is literally impossible to click!"}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl mx-auto">
              <form onSubmit={handleGenerateLink} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {lang === "bn" ? "আপনার নাম (Sender)" : "Your Name"}
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {lang === "bn" ? "প্রিয়জনের নাম (Recipient)" : "Recipient Name"}
                    </label>
                    <input
                      type="text"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "প্রপোজাল প্রশ্ন" : "Your Proposal Question"}
                  </label>
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "YES চাপার পর মেসেজ" : "Message after saying YES"}
                  </label>
                  <textarea
                    value={acceptanceMessage}
                    onChange={(e) => setAcceptanceMessage(e.target.value)}
                    rows={3}
                    required
                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{lang === "bn" ? "ম্যাজিকাল লিংক তৈরি করুন" : "Generate Proposal Link"}</span>
                </button>
              </form>

              {shareableUrl && (
                <div className="p-5 rounded-2xl bg-rose-50 dark:bg-slate-800/80 border border-rose-200 dark:border-rose-900 space-y-3 animate-fade-in">
                  <span className="text-xs font-bold text-rose-700 dark:text-rose-400 block">
                    {lang === "bn" ? "আপনার স্পেশাল লিংক প্রস্তুত:" : "Your Special Link is Ready:"}
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareableUrl}
                      className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border text-xs font-mono"
                    />
                    <button
                      onClick={copyLink}
                      className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "কপি হয়েছে!" : "কপি"}</span>
                    </button>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <a
                      href={shareableUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>{lang === "bn" ? "নিজে টেস্ট করে দেখুন" : "Test it live"}</span>
                      <ArrowLeft className="w-3 h-3 rotate-180" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SEO On-Page Content, FAQs, and Search Tag Badges */}
        <ToolSeoSection toolSlug="social/heart-trace" />
      </div>
    </div>
  );
}
