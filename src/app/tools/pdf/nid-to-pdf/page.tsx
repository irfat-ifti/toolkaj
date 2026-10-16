"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, Upload, Download, Check, RefreshCw, Sparkles, FileText } from "lucide-react";
import jsPDF from "jspdf";
import ToolSeoSection from "@/components/ToolSeoSection";
import { TOOLS_DATA } from "@/lib/tools-data";

const tool = TOOLS_DATA.find((t) => t.slug === "pdf/nid-to-pdf")!;

export default function NidToPdfPage() {
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [includeGuidelines, setIncludeGuidelines] = useState(true);
  const [cardType, setCardType] = useState<"smart" | "old">("smart");
  const [watermarkText, setWatermarkText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPdfBlobUrl, setGeneratedPdfBlobUrl] = useState<string | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File, side: "front" | "back") => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      if (side === "front") setFrontImage(data);
      else setBackImage(data);
      setGeneratedPdfBlobUrl(null);
    };
    reader.readAsDataURL(file);
  };

  const generatePdf = async () => {
    if (!frontImage && !backImage) {
      alert("অনুগ্রহ করে NID কার্ডের সামনের অথবা পেছনের ছবি আপলোড করুন");
      return;
    }
    setIsGenerating(true);

    // Standard A4: 210 x 297 mm
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Standard Smart NID dimensions: 85.6mm x 53.98mm
    const cardW = cardType === "smart" ? 85.6 : 95;
    const cardH = cardType === "smart" ? 54 : 60;
    const pageW = 210;
    const marginX = (pageW - cardW) / 2;

    let startY = 40;

    // Helper to draw image onto PDF
    if (frontImage) {
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text("FRONT SIDE (NID)", marginX, startY - 4);

      if (includeGuidelines) {
        pdf.setDrawColor(180, 180, 180);
        pdf.setLineDashPattern([2, 2], 0);
        pdf.rect(marginX - 1, startY - 1, cardW + 2, cardH + 2);
      }

      pdf.addImage(frontImage, "JPEG", marginX, startY, cardW, cardH);
      startY += cardH + 25;
    }

    if (backImage) {
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text("BACK SIDE (NID)", marginX, startY - 4);

      if (includeGuidelines) {
        pdf.setDrawColor(180, 180, 180);
        pdf.setLineDashPattern([2, 2], 0);
        pdf.rect(marginX - 1, startY - 1, cardW + 2, cardH + 2);
      }

      pdf.addImage(backImage, "JPEG", marginX, startY, cardW, cardH);
    }

    // Optional Watermark
    if (watermarkText.trim()) {
      pdf.setFontSize(28);
      pdf.setTextColor(220, 220, 220);
      pdf.text(watermarkText.trim(), pageW / 2, 150, { align: "center", angle: 45 });
    }

    // Footer note
    pdf.setFontSize(8);
    pdf.setTextColor(150);
    pdf.text("Generated with ToolKaj (toolkaj.vercel.app) — Print on standard A4 paper at 100% scale", pageW / 2, 285, {
      align: "center",
    });

    const blobUrl = pdf.output("bloburl");
    setGeneratedPdfBlobUrl(blobUrl as unknown as string);
    setIsGenerating(false);
  };

  const downloadPdf = () => {
    if (!generatedPdfBlobUrl) return;
    const a = document.createElement("a");
    a.href = generatedPdfBlobUrl;
    a.download = `bangladesh_nid_card_a4_${Date.now()}.pdf`;
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
          <Link href="/category/pdf" className="hover:text-indigo-600">
            পিডিএফ টুলস
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            এনআইডি টু পিডিএফ
          </span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold mb-3">
            <CreditCard className="w-4 h-4 text-emerald-600" /> A4 পেপার স্ট্যান্ডার্ড সাইজ
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            এনআইডি টু পিডিএফ কনভার্টার (NID to PDF)
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            জাতীয় পরিচয়পত্রের (NID) উভয় পাশ সাজিয়ে সরাসরি প্রিন্ট-উপযোগী A4 সাইজের PDF ডকুমেন্ট তৈরি করুন।
          </p>
        </div>

        {/* Workspace */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-8">
          {/* Card Type Selector */}
          <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">কার্ডের ধরণ:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCardType("smart")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  cardType === "smart"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                স্মার্ট এনআইডি কার্ড (৮৫.৬ x ৫৪ মিমি)
              </button>
              <button
                onClick={() => setCardType("old")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  cardType === "old"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                পুরাতন লেমিনেটেড কার্ড (৯৫ x ৬০ মিমি)
              </button>
            </div>
          </div>

          {/* Dual Uploaders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Front Uploader */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                ১. NID সামনের পাশ (Front Side)
              </label>
              <input
                ref={frontInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "front")}
                className="hidden"
              />
              {frontImage ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 bg-slate-50 dark:bg-slate-800 aspect-[1.58] flex items-center justify-center p-2 group">
                  <img src={frontImage} alt="Front NID" className="w-full h-full object-contain" />
                  <button
                    onClick={() => frontInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold"
                  >
                    ছবি পরিবর্তন করুন
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => frontInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:border-indigo-500 hover:bg-indigo-50/20 cursor-pointer transition-all aspect-[1.58] flex flex-col items-center justify-center"
                >
                  <Upload className="w-8 h-8 text-indigo-500 mb-2" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    সামনের পাশ আপলোড করুন
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">ক্যামেরার ছবি বা স্ক্যান কপি</span>
                </div>
              )}
            </div>

            {/* Back Uploader */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                ২. NID পেছনের পাশ (Back Side)
              </label>
              <input
                ref={backInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "back")}
                className="hidden"
              />
              {backImage ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 bg-slate-50 dark:bg-slate-800 aspect-[1.58] flex items-center justify-center p-2 group">
                  <img src={backImage} alt="Back NID" className="w-full h-full object-contain" />
                  <button
                    onClick={() => backInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold"
                  >
                    ছবি পরিবর্তন করুন
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => backInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:border-indigo-500 hover:bg-indigo-50/20 cursor-pointer transition-all aspect-[1.58] flex flex-col items-center justify-center"
                >
                  <Upload className="w-8 h-8 text-indigo-500 mb-2" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    পেছনের পাশ আপলোড করুন
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">ক্যামেরার ছবি বা স্ক্যান কপি</span>
                </div>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="guidelines"
                checked={includeGuidelines}
                onChange={(e) => setIncludeGuidelines(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="guidelines" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                কাটিং দাগ / মার্জিন লাইন যুক্ত করুন (ডটেড গাইডলাইন)
              </label>
            </div>

            <div>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="ঐচ্ছিক ওয়াটারমার্ক (যেমন: PHOTOCOPY)"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              />
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={generatePdf}
              disabled={isGenerating || (!frontImage && !backImage)}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
              <span>A4 PDF তৈরি করুন</span>
            </button>

            {generatedPdfBlobUrl && (
              <button
                onClick={downloadPdf}
                className="py-3.5 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 animate-bounce-subtle"
              >
                <Download className="w-4 h-4" />
                <span>PDF ডাউনলোড করুন</span>
              </button>
            )}
          </div>

          {/* Live PDF Viewer Embed if generated */}
          {generatedPdfBlobUrl && (
            <div className="mt-8 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden animate-fade-in">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>PDF ডকুমেন্ট প্রিভিউ (A4)</span>
                <span className="text-emerald-600 font-medium">প্রিন্টের জন্য প্রস্তুত</span>
              </div>
              <iframe
                src={generatedPdfBlobUrl}
                className="w-full h-96 sm:h-[500px]"
                title="NID PDF Preview"
              />
            </div>
          )}
        </div>

        {/* Rich SEO Content, Step-by-Step Guide, Specifications & FAQs */}
        <ToolSeoSection tool={tool} />
      </div>
    </div>
  );
}
