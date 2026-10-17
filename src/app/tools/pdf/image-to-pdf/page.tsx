"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Images, Upload, Download, Trash2, RefreshCw, FileText } from "lucide-react";
import jsPDF from "jspdf";
import ToolSeoSection from "@/components/ToolSeoSection";

interface UploadedImage {
  id: string;
  name: string;
  dataUrl: string;
}

export default function ImageToPdfPage() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [pageSize, setPageSize] = useState<"a4" | "letter">("a4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [margin, setMargin] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newImgs: UploadedImage[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImgs.push({
          id: Math.random().toString(),
          name: file.name,
          dataUrl: e.target?.result as string,
        });
        if (newImgs.length === files.length) {
          setImages((prev) => [...prev, ...newImgs]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      const pdf = new jsPDF({
        orientation,
        unit: "mm",
        format: pageSize,
      });

      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage(pageSize, orientation);

        const img = new Image();
        img.src = images[i].dataUrl;
        await new Promise((resolve) => (img.onload = resolve));

        const maxW = pageW - margin * 2;
        const maxH = pageH - margin * 2;

        const imgRatio = img.width / img.height;
        let printW = maxW;
        let printH = maxW / imgRatio;

        if (printH > maxH) {
          printH = maxH;
          printW = maxH * imgRatio;
        }

        const x = margin + (maxW - printW) / 2;
        const y = margin + (maxH - printH) / 2;

        pdf.addImage(images[i].dataUrl, "JPEG", x, y, printW, printH);
      }

      pdf.save(`images_to_pdf_${Date.now()}.pdf`);
    } catch (err) {
      console.error(err);
      alert("PDF রূপান্তরে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsGenerating(false);
    }
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
          <Link href="/category/pdf" className="hover:text-indigo-600">
            পিডিএফ টুলস
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            ইমেজ টু পিডিএফ
          </span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold mb-3">
            <Images className="w-4 h-4 text-indigo-600" /> মাল্টিপল ফটো টু সিঙ্গেল PDF
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            ইমেজ টু পিডিএফ কনভার্টার (Image to PDF)
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            একাধিক ছবি (JPG, PNG, WebP) নির্বাচন করে একটি সুসজ্জিত ও সুবিন্যস্ত PDF ফাইলে রূপান্তর করুন।
          </p>
        </div>

        {/* Workspace */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:border-indigo-500 hover:bg-indigo-50/20 cursor-pointer transition-all"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
              ছবি যোগ করুন (Add Images)
            </p>
            <p className="text-xs text-slate-400 mt-1">একসাথে একাধিক ছবি নির্বাচন করতে পারেন</p>
          </div>

          {/* Settings Bar */}
          {images.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  পেজ সাইজ
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  <option value="a4">A4 (মানসম্মত সাইজ)</option>
                  <option value="letter">Letter</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  পেজ ওরিয়েন্টেশন
                </label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  <option value="portrait">পোর্ট্রেট (খাড়া / Portrait)</option>
                  <option value="landscape">ল্যান্ডস্কেপ (শোয়ানো / Landscape)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  মার্জিন
                </label>
                <select
                  value={margin}
                  onChange={(e) => setMargin(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  <option value="0">মার্জিন ছাড়া (0 mm)</option>
                  <option value="10">স্বাভাবিক (10 mm)</option>
                  <option value="20">বড় মার্জিন (20 mm)</option>
                </select>
              </div>
            </div>
          )}

          {/* Selected Images Gallery */}
          {images.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  নির্বাচিত ছবি ({images.length}টি)
                </span>
                <button
                  onClick={() => setImages([])}
                  className="text-xs text-rose-500 hover:underline"
                >
                  সবগুলো মুছুন
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 aspect-square group"
                  >
                    <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                    <span className="absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-white">
                      #{idx + 1}
                    </span>
                    <button
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={generatePdf}
                disabled={isGenerating}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 mt-6"
              >
                <Download className="w-4 h-4" />
                <span>{isGenerating ? "PDF তৈরি হচ্ছে..." : "PDF ডাউনলোড করুন"}</span>
              </button>
            </div>
          )}
        </div>

        {/* SEO On-Page Content, FAQs, and Search Tag Badges */}
        <ToolSeoSection toolSlug="pdf/image-to-pdf" />
      </div>
    </div>
  );
}
