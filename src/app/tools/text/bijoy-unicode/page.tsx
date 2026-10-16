"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Download, Trash2, ArrowRightLeft, Sparkles, Pin, ArrowRight, AlertTriangle } from "lucide-react";
import { convertBijoyToUnicode, convertUnicodeToBijoy } from "@/lib/bangla-converter";
import ToolSeoSection from "@/components/ToolSeoSection";
import { TOOLS_DATA } from "@/lib/tools-data";

const tool = TOOLS_DATA.find((t) => t.slug === "text/bijoy-unicode")!;

export default function BijoyUnicodePage() {
  const [direction, setDirection] = useState<"bijoyToUni" | "uniToBijoy">("bijoyToUni");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = (text: string, currentDirection = direction) => {
    setInputText(text);
    if (!text.trim()) {
      setOutputText("");
      return;
    }
    if (currentDirection === "bijoyToUni") {
      setOutputText(convertBijoyToUnicode(text));
    } else {
      setOutputText(convertUnicodeToBijoy(text));
    }
  };

  const handleDirectionSwitch = () => {
    const newDir = direction === "bijoyToUni" ? "uniToBijoy" : "bijoyToUni";
    setDirection(newDir);
    setInputText(outputText);
    handleConvert(outputText, newDir);
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = direction === "bijoyToUni" ? "unicode_converted.txt" : "bijoy_converted.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const isLikelyBanglish =
    direction === "bijoyToUni" &&
    /\b(ami|tumi|apni|amra|tomar|amar|kemon|acho|valo|bhalo|ki|keno|kothay|nam|hobe|korcho|korchi|dhonnobad|sohoz)\b/i.test(
      inputText
    );

  return (
    <div className="w-full py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-indigo-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> হোম
          </Link>
          <span>/</span>
          <Link href="/category/text" className="hover:text-indigo-600">
            টেক্সট টুলস
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            বিজয় ↔ ইউনিকোড কনভার্টার
          </span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> ১০০% নির্ভুল বাংলা ফন্ট কনভার্টার
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            বিজয় ↔ ইউনিকোড কনভার্টার (Bijoy to Unicode)
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            বিজয় (SutonnyMJ / ANSI) ফন্টে লেখা টেক্সট সহজে ইউনিকোডে (Avro / আধুনিক বাংলা ফন্ট) রূপান্তর করুন অথবা ইউনিকোড থেকে বিজয়ে নিন।
          </p>
        </div>

        {/* Converter Workspace */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          {/* Helpful Guidance Notice */}
          <div className="mb-6 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold flex items-center gap-1.5 mb-0.5">
                <Pin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                বিজয় (SutonnyMJ) বনাম বাংলিশ (Avro Phonetic):
              </span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] sm:text-xs">
                এটি বিজয় ফন্টের কি-কোড কনভার্টার (যেমন: <code className="font-bold text-indigo-600 dark:text-indigo-400">Avwg</code> = আমি)। আপনি যদি ইংরেজি অক্ষরে উচ্চারণ লিখে বাংলা পেতে চান (যেমন: <code className="font-bold text-indigo-600 dark:text-indigo-400">tomar nam ki?</code> <ArrowRight className="w-3 h-3 inline mx-1 text-slate-400" /> তোমার নাম কি?), তবে আমাদের বাংলিশ টুল ব্যবহার করুন।
              </p>
            </div>
            <Link
              href="/tools/text/banglish"
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 shadow transition-colors flex items-center gap-1.5"
            >
              <span>বাংলিশ টু বাংলা টাইপিং</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Banglish Auto-detection Alert */}
          {isLikelyBanglish && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
              <div className="space-y-1">
                <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  আপনি ইংরেজি হরফে বাংলিশ (যেমন: &quot;{inputText.trim().slice(0, 20)}...&quot;) টাইপ করেছেন!
                </span>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  বিজয় কিবোর্ডে হরফ ম্যাপিংয়ের কারণে ইংরেজি শব্দের ফলাফল অর্থহীন মনে হতে পারে (যেমন: <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded font-bold">tomar</code> দিলে <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded font-bold">০ৎহষদয়</code> আসবে)। সরাসরি ফোনেটিক বাংলা পেতে বাংলিশ টুলে ক্লিক করুন:
                </p>
              </div>
              <Link
                href="/tools/text/banglish"
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 shadow transition-all flex items-center gap-1.5"
              >
                <span>বাংলিশ থেকে বাংলা করুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">মোড:</span>
              <button
                onClick={handleDirectionSwitch}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold text-xs sm:text-sm hover:bg-indigo-100 transition-colors border border-indigo-200/60 dark:border-slate-700"
              >
                <span>
                  {direction === "bijoyToUni" ? "বিজয় (ANSI)" : "ইউনিকোড"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
                <span>
                  {direction === "bijoyToUni" ? "ইউনিকোড" : "বিজয় (ANSI)"}
                </span>
                <ArrowRightLeft className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setInputText("");
                  setOutputText("");
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                title="ক্লিয়ার করুন"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">পরিষ্কার করুন</span>
              </button>
            </div>
          </div>

          {/* Dual Textareas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Side */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  {direction === "bijoyToUni" ? "বিজয় টেক্সট এখানে পেস্ট করুন" : "ইউনিকোড টেক্সট এখানে পেস্ট করুন"}
                </label>
                <span className="text-xs text-slate-400">
                  {inputText.length} অক্ষর
                </span>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => handleConvert(e.target.value)}
                placeholder={
                  direction === "bijoyToUni"
                    ? "Avwg evsjvq Mvb MvB... (বিজয় টেক্সট লিখুন)"
                    : "আমি বাংলায় গান গাই... (ইউনিকোড টেক্সট লিখুন)"
                }
                rows={12}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed resize-none"
              />
            </div>

            {/* Output Side */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                  {direction === "bijoyToUni" ? "রূপান্তরিত ইউনিকোড টেক্সট" : "রূপান্তরিত বিজয় টেক্সট"}
                </label>
                <span className="text-xs text-slate-400">
                  {outputText.length} অক্ষর
                </span>
              </div>
              <textarea
                readOnly
                value={outputText}
                placeholder="রূপান্তরিত টেক্সট এখানে প্রদর্শিত হবে..."
                rows={12}
                className="w-full p-4 rounded-2xl bg-indigo-50/20 dark:bg-slate-900/60 border border-indigo-200/80 dark:border-indigo-900/40 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-sm leading-relaxed resize-none font-medium"
              />

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handleCopy}
                  disabled={!outputText}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "কপি হয়েছে!" : "কপি করুন (Copy)"}</span>
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!outputText}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
                  title="TXT ফাইল হিসেবে ডাউনলোড"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">ডাউনলোড</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rich SEO Content, Step-by-Step Guide, Specifications & FAQs */}
        <ToolSeoSection tool={tool} />
      </div>
    </div>
  );
}
