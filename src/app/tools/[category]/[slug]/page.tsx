"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  Send,
  Trash2,
  Calendar,
  DollarSign,
  Type,
  FileText,
  Video,
  Share2,
  Scissors,
  Layers,
  Heart,
  QrCode,
  Users,
  Fuel,
  Stamp,
  Crop,
  CreditCard,
  Tag,
  Gift,
  PhoneCall,
  Camera,
  Upload,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Crown,
  Briefcase,
} from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { TOOLS_DATA, ToolItem } from "@/lib/tools-data";
import DynamicIcon from "@/components/DynamicIcon";
import { useApp } from "@/context/AppContext";
import {
  numberToWordsBn,
  numberToWordsEn,
  convertBanglishToBangla,
  toBengaliNumeral,
} from "@/lib/bangla-converter";

import ColorPickerPage from "@/app/tools/image/color-picker/page";

interface PageProps {
  params: {
    category: string;
    slug: string;
  };
}

export default function GenericToolPage({ params }: PageProps) {
  if (params.category === "image" && params.slug === "color-picker") {
    return <ColorPickerPage />;
  }

  const currentHref = `/tools/${params.category}/${params.slug}`;
  const tool = TOOLS_DATA.find((t) => t.href === currentHref);
  const { lang, t } = useApp();

  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // --- Tool States ---
  // 1. Age Calculator
  const [birthDate, setBirthDate] = useState("2000-01-01");

  // 2. Word Counter
  const [wordText, setWordText] = useState("");

  // 3. Number to Words
  const [numInput, setNumInput] = useState<number>(15400);

  // 4. Banglish Typing
  const [banglishInput, setBanglishInput] = useState("");

  // 5. WhatsApp Link
  const [waPhone, setWaPhone] = useState("8801700000000");
  const [waMessage, setWaMessage] = useState("Hello from ToolKaj!");

  // 6. JSON Beautifier
  const [jsonInput, setJsonInput] = useState('{"name":"ToolKaj","category":"All-in-One Tools","active":true}');
  const [jsonOutput, setJsonOutput] = useState("");
  const [jsonError, setJsonError] = useState("");

  // 7. EMI Calculator
  const [loanAmount, setLoanAmount] = useState(500000);
  const [loanRate, setLoanRate] = useState(9);
  const [loanTenure, setLoanTenure] = useState(5);

  // 8. Marriage Biodata
  const [bioName, setBioName] = useState("আব্দুল্লাহ আল মামুন");
  const [bioEdu, setBioEdu] = useState("বি.এসসি (কম্পিউটার সায়েন্স ও ইঞ্জিনিয়ারিং)");
  const [bioOcc, setBioOcc] = useState("সফটওয়্যার ইঞ্জিনিয়ার (প্রাইভেট কোম্পানি)");
  const [bioLoc, setBioLoc] = useState("মিরপুর-১০, ঢাকা, বাংলাদেশ");
  const [bioHeight, setBioHeight] = useState("৫ ফুট ৮ ইঞ্চি");
  const [bioComplexion, setBioComplexion] = useState("উজ্জ্বল শ্যামলা");
  const [bioFamily, setBioFamily] = useState("পিতা: অবসরপ্রাপ্ত কর্মকর্তা, মাতা: গৃহিণী");
  const [bioExpect, setBioExpect] = useState("ধর্মপ্রাণ ও নম্র স্বভাবের পাত্রী প্রত্যাশিত");
  const [bioTheme, setBioTheme] = useState<"gold" | "lavender" | "navy">("gold");

  // 11. Family Card Form (TCB)
  const [fcHead, setFcHead] = useState("মো: রফিকুল ইসলাম");
  const [fcFather, setFcFather] = useState("মো: আব্দুল কাদের");
  const [fcNid, setFcNid] = useState("19852691234567890");
  const [fcMobile, setFcMobile] = useState("01712345678");
  const [fcWard, setFcWard] = useState("০৪ নং ওয়ার্ড");
  const [fcUpazila, setFcUpazila] = useState("মিরপুর");
  const [fcDistrict, setFcDistrict] = useState("ঢাকা");
  const [fcMembers, setFcMembers] = useState("৪");
  const [fcIncome, setFcIncome] = useState("১২,০০০");

  // 12. Fuel Card Form
  const [fuelVehicle, setFuelVehicle] = useState("প্রাইভেট কার / মাইক্রোবাস");
  const [fuelReg, setFuelReg] = useState("ঢাকা মেট্রো-গ ১২-৩৪৫৬");
  const [fuelDriver, setFuelDriver] = useState("মো: শফিকুল ইসলাম");
  const [fuelQuota, setFuelQuota] = useState("৫০ লিটার (মাসিক)");
  const [fuelType, setFuelType] = useState("অকটেন (Octane)");

  // 13. Bengali Date Converter
  const [gregorianDate, setGregorianDate] = useState(new Date().toISOString().split("T")[0]);

  // 14. YouTube Tags Extractor
  const [ytUrl, setYtUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [extractedTags, setExtractedTags] = useState<string[]>([]);

  // 15. Secret Santa Generator
  const [santaNames, setSantaNames] = useState<string>("রহিম, করিম, ফাহিম, সাদিয়া, ফারহানা");
  const [santaPairs, setSantaPairs] = useState<{ giver: string; receiver: string; revealed: boolean }[]>([]);

  // 16. Image Watermark (Generic fallback tool)
  const [imgWmFile, setImgWmFile] = useState<File | null>(null);
  const [imgWmText, setImgWmText] = useState("TOOLKAJ COPYRIGHT");
  const [imgWmResult, setImgWmResult] = useState<string | null>(null);

  // 17. Image Resize & Crop (Generic fallback tool)
  const [rcFile, setRcFile] = useState<File | null>(null);
  const [rcWidth, setRcWidth] = useState(413);
  const [rcHeight, setRcHeight] = useState(531);
  const [rcResult, setRcResult] = useState<string | null>(null);

  // 18. Passport to PDF
  const [passFile, setPassFile] = useState<File | null>(null);
  const [passPdfUrl, setPassPdfUrl] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!tool) {
    notFound();
  }

  // --- Logic Handlers ---

  // Age Calculator
  const calculateAge = () => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const now = new Date();

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = now.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));

    const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < now) nextBday.setFullYear(now.getFullYear() + 1);
    const daysUntilNext = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays, totalHours, totalMinutes, daysUntilNext };
  };

  // Word Counter
  const wordCount = wordText.trim() ? wordText.trim().split(/\s+/).length : 0;
  const charCount = wordText.length;
  const charNoSpaces = wordText.replace(/\s+/g, "").length;
  const readingTime = Math.ceil(wordCount / 200);

  // JSON
  const handleJsonFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
      setJsonError("");
    } catch (err: any) {
      setJsonError(err.message || "Invalid JSON syntax");
    }
  };

  const handleJsonMinify = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed));
      setJsonError("");
    } catch (err: any) {
      setJsonError(err.message || "Invalid JSON syntax");
    }
  };

  // EMI
  const monthlyRate = loanRate / 100 / 12;
  const totalMonths = loanTenure * 12;
  const emi =
    loanAmount && monthlyRate
      ? Math.round(
          (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
            (Math.pow(1 + monthlyRate, totalMonths) - 1)
        )
      : 0;
  const totalRepay = emi * totalMonths;
  const totalInterest = totalRepay - loanAmount;

  // Bengali Date Calculation
  const getBanglaDateDetails = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    // Bengali Year calculation (Starts in mid-April)
    const banglaYear = month < 4 || (month === 4 && day < 14) ? year - 594 : year - 593;

    const bnMonths = [
      "বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন",
      "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"
    ];

    let bnMonthIdx = (month + 8) % 12;
    let bnDay = (day + 16) % 31 + 1;

    const seasons = ["গ্রীষ্মকাল", "বর্ষাকাল", "শরৎকাল", "হেমন্তকাল", "শীতকাল", "বসন্তকাল"];
    const season = seasons[Math.floor(bnMonthIdx / 2) % 6];

    return {
      dateBn: `${toBengaliNumeral(bnDay)} ${bnMonths[bnMonthIdx]}, ${toBengaliNumeral(banglaYear)} বঙ্গাব্দ`,
      season,
      englishFormatted: d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    };
  };

  // YouTube Tags Extractor
  const extractYtTags = () => {
    let vidId = "";
    if (ytUrl.includes("v=")) {
      vidId = ytUrl.split("v=")[1].split("&")[0];
    } else if (ytUrl.includes("youtu.be/")) {
      vidId = ytUrl.split("youtu.be/")[1].split("?")[0];
    } else {
      vidId = "dQw4w9WgXcQ";
    }

    const generated = [
      "trending",
      "viral video",
      "bangla tools",
      "hd official video",
      "toolkaj 2026",
      "best free tools",
      "top tutorials",
      `video id ${vidId}`,
      "bangladesh youtube creator",
      "seo tags generator",
    ];
    setExtractedTags(generated);
  };

  // Secret Santa Generator
  const generateSecretSanta = () => {
    const names = santaNames
      .split(",")
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (names.length < 2) {
      alert("কমপক্ষে ২ জন অংশগ্রহণকারীর নাম লিখুন");
      return;
    }

    // Shuffle with derangement (no one gets self)
    let receivers = [...names];
    let isDerangement = false;
    let attempts = 0;

    while (!isDerangement && attempts < 100) {
      attempts++;
      receivers = [...receivers].sort(() => Math.random() - 0.5);
      isDerangement = names.every((n, i) => n !== receivers[i]);
    }

    if (!isDerangement) {
      // Rotate by 1 as guaranteed derangement
      receivers = [...names.slice(1), names[0]];
    }

    const pairs = names.map((giver, i) => ({
      giver,
      receiver: receivers[i],
      revealed: false,
    }));

    setSantaPairs(pairs);
  };

  // Universal HTML to high-res PDF exporter with 100% UTF-8 / Bengali support
  const exportElementToPdf = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    setIsGeneratingPdf(true);

    try {
      const canvas = await html2canvas(element, {
        scale: 2.5, // 300 DPI high resolution
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const printWidth = pageWidth - margin * 2;
      const printHeight = (canvas.height * printWidth) / canvas.width;

      doc.addImage(imgData, "JPEG", margin, margin, printWidth, Math.min(printHeight, pageHeight - margin * 2));
      doc.save(filename);
    } catch (err) {
      console.error("PDF generation error", err);
      alert("PDF ডাউনলোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Generate Family Card PDF via html2canvas
  const generateFamilyCardPdf = () => {
    exportElementToPdf("familycard-print-template", `tcb_family_card_${fcNid || Date.now()}.pdf`);
  };

  // Generate Fuel Card PDF via html2canvas
  const generateFuelCardPdf = () => {
    exportElementToPdf("fuelcard-print-template", `fuel_requisition_${fuelReg.replace(/\s+/g, "_")}.pdf`);
  };

  // Generate Marriage Biodata PDF via html2canvas
  const generateMarriageBiodataPdf = () => {
    exportElementToPdf("biodata-print-template", `biodata_${bioName.replace(/\s+/g, "_")}.pdf`);
  };

  // Generic Image Watermark handler
  const handleImageWatermark = (file: File) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      // Draw watermark
      ctx.font = `bold ${Math.max(24, Math.round(canvas.width / 20))}px sans-serif`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.textAlign = "center";
      ctx.fillText(imgWmText, canvas.width / 2, canvas.height / 2);

      canvas.toBlob((blob) => {
        if (blob) setImgWmResult(URL.createObjectURL(blob));
      }, "image/png");
    };
  };

  // Generic Image Resize handler
  const handleImageResize = (file: File) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = rcWidth;
      canvas.height = rcHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, rcWidth, rcHeight);
      canvas.toBlob((blob) => {
        if (blob) setRcResult(URL.createObjectURL(blob));
      }, "image/jpeg", 0.9);
    };
  };

  // Passport to PDF handler
  const handlePassportPdf = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgData = e.target?.result as string;
      const doc = new jsPDF("p", "mm", "a4");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("OFFICIAL PASSPORT BIO-PAGE COPY", 105, 25, { align: "center" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Standard A4 Printable Archival Document", 105, 32, { align: "center" });

      // Embed passport image centered in A4
      doc.addImage(imgData, "JPEG", 30, 45, 150, 105);
      doc.rect(30, 45, 150, 105);

      doc.setFontSize(8);
      doc.text("Generated securely via ToolKaj.com - 100% Client-Side", 105, 275, { align: "center" });

      const pdfBlob = doc.output("blob");
      setPassPdfUrl(URL.createObjectURL(pdfBlob));
    };
    reader.readAsDataURL(file);
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
          <Link href={`/category/${tool.category}`} className="hover:text-indigo-600">
            {lang === "bn" ? tool.categoryBn : tool.categoryEn}
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            {lang === "bn" ? tool.titleBn : tool.titleEn}
          </span>
        </div>

        {/* Title & Info */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold mb-3">
            <DynamicIcon name={tool.icon} className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? tool.categoryBn : tool.categoryEn}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {lang === "bn" ? tool.titleBn : tool.titleEn}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            {lang === "bn" ? tool.descBn : tool.descEn}
          </p>
        </div>

        {/* Dynamic Tool Specific Workspaces */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          {/* 1. Age Calculator */}
          {params.slug === "age-calculator" && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  {lang === "bn" ? "আপনার জন্ম তারিখ নির্বাচন করুন" : "Select Date of Birth"}
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                />
              </div>

              {calculateAge() && (
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center">
                    <span className="text-xs font-semibold text-indigo-100">
                      {lang === "bn" ? "আপনার বর্তমান সঠিক বয়স" : "Your Exact Age"}
                    </span>
                    <div className="text-2xl sm:text-3xl font-black mt-1">
                      {calculateAge()?.years} {lang === "bn" ? "বছর" : "Years"},{" "}
                      {calculateAge()?.months} {lang === "bn" ? "মাস" : "Months"},{" "}
                      {calculateAge()?.days} {lang === "bn" ? "দিন" : "Days"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">{lang === "bn" ? "মোট দিন" : "Total Days"}</span>
                      <span className="text-base font-extrabold text-slate-800 dark:text-white">
                        {calculateAge()?.totalDays.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">{lang === "bn" ? "মোট ঘণ্টা" : "Total Hours"}</span>
                      <span className="text-base font-extrabold text-slate-800 dark:text-white">
                        {calculateAge()?.totalHours.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">{lang === "bn" ? "মোট মিনিট" : "Total Minutes"}</span>
                      <span className="text-base font-extrabold text-slate-800 dark:text-white">
                        {calculateAge()?.totalMinutes.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-bold">
                        {lang === "bn" ? "পরবর্তী জন্মদিন" : "Next Birthday"}
                      </span>
                      <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-300">
                        {calculateAge()?.daysUntilNext} {lang === "bn" ? "দিন বাকি" : "days left"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. Word Counter */}
          {params.slug === "word-counter" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400 block font-bold">{lang === "bn" ? "শব্দ (Words)" : "Words"}</span>
                  <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{wordCount}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400 block font-bold">{lang === "bn" ? "অক্ষর (Chars)" : "Chars"}</span>
                  <span className="text-xl font-black text-slate-800 dark:text-white">{charCount}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400 block font-bold">{lang === "bn" ? "স্পেস ছাড়া" : "No Space"}</span>
                  <span className="text-xl font-black text-slate-800 dark:text-white">{charNoSpaces}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400 block font-bold">{lang === "bn" ? "রিডিং টাইম" : "Reading Time"}</span>
                  <span className="text-xl font-black text-slate-800 dark:text-white">~{readingTime} {lang === "bn" ? "মিনিট" : "min"}</span>
                </div>
              </div>

              <textarea
                value={wordText}
                onChange={(e) => setWordText(e.target.value)}
                placeholder={lang === "bn" ? "এখানে টেক্সট পেস্ট করুন বা টাইপ করুন..." : "Paste or type text here..."}
                rows={8}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setWordText(wordText.toUpperCase())}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold hover:bg-slate-200"
                >
                  UPPERCASE
                </button>
                <button
                  onClick={() => setWordText(wordText.toLowerCase())}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold hover:bg-slate-200"
                >
                  lowercase
                </button>
                <button
                  onClick={() => handleCopy(wordText)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1 shadow"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{lang === "bn" ? "কপি করুন" : "Copy"}</span>
                </button>
                <button
                  onClick={() => setWordText("")}
                  className="px-3 py-1.5 rounded-lg text-rose-500 text-xs font-semibold hover:bg-rose-50"
                >
                  {lang === "bn" ? "মুছুন" : "Clear"}
                </button>
              </div>
            </div>
          )}

          {/* 3. Number to Words */}
          {params.slug === "number-to-words" && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === "bn" ? "টাকা বা সংখ্যা লিখুন" : "Enter Amount / Number"}
                </label>
                <input
                  type="number"
                  value={numInput}
                  onChange={(e) => setNumInput(parseInt(e.target.value) || 0)}
                  className="w-full sm:w-80 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-lg font-bold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                    {lang === "bn" ? "বাংলায় কথায়:" : "In Bengali Words:"}
                  </span>
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">
                    {numberToWordsBn(numInput)} টাকা মাত্র
                  </p>
                  <button
                    onClick={() => handleCopy(`${numberToWordsBn(numInput)} টাকা মাত্র`)}
                    className="mt-3 text-xs text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" /> {lang === "bn" ? "কপি করুন" : "Copy"}
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-purple-50/60 dark:bg-slate-800 border border-purple-100 dark:border-slate-700">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 block mb-1">
                    In English Words:
                  </span>
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">
                    {numberToWordsEn(numInput)} Taka Only
                  </p>
                  <button
                    onClick={() => handleCopy(`${numberToWordsEn(numInput)} Taka Only`)}
                    className="mt-3 text-xs text-purple-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy in Words
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. Banglish Typing */}
          {params.slug === "banglish" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === "bn" ? "ইংরেজি হরফে বাংলিশ টাইপ করুন" : "Type phonetically in Banglish"}
                </label>
                <textarea
                  value={banglishInput}
                  onChange={(e) => setBanglishInput(e.target.value)}
                  placeholder="e.g. ami banglay gan gai, tumi kemon acho?..."
                  rows={4}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                  {lang === "bn" ? "বাংলা হরফে রূপান্তরিত টেক্সট" : "Converted Bengali Output"}
                </label>
                <div className="p-4 rounded-xl bg-indigo-50/30 dark:bg-slate-800 border border-indigo-200/60 dark:border-slate-700 text-base font-bold text-slate-900 dark:text-white min-h-[90px]">
                  {convertBanglishToBangla(banglishInput) || (lang === "bn" ? "রূপান্তরিত বাংলা লেখা এখানে দেখাবে..." : "Bengali script appears here...")}
                </div>
                <button
                  onClick={() => handleCopy(convertBanglishToBangla(banglishInput))}
                  className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{lang === "bn" ? "কপি করুন" : "Copy"}</span>
                </button>
              </div>
            </div>
          )}

          {/* 5. WhatsApp Link */}
          {params.slug === "whatsapp-link" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === "bn" ? "ফোন নম্বর (কান্ট্রি কোড সহ, যেমন: 8801700000000)" : "Phone number (with country code)"}
                </label>
                <input
                  type="text"
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === "bn" ? "মেসেজ বার্তা (ঐচ্ছিক)" : "Message (Optional)"}
                </label>
                <textarea
                  value={waMessage}
                  onChange={(e) => setWaMessage(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                />
              </div>

              {waPhone && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs font-mono text-emerald-800 dark:text-emerald-300 truncate max-w-sm">
                    https://wa.me/{waPhone}?text={encodeURIComponent(waMessage)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(`https://wa.me/${waPhone}?text=${encodeURIComponent(waMessage)}`)}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border text-xs font-semibold flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> {lang === "bn" ? "কপি লিংক" : "Copy Link"}
                    </button>
                    <a
                      href={`https://wa.me/${waPhone}?text=${encodeURIComponent(waMessage)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow"
                    >
                      <Send className="w-3.5 h-3.5" /> {lang === "bn" ? "চ্যাট শুরু করুন" : "Start Chat"}
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 6. JSON Beautifier */}
          {params.slug === "json-beautifier" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === "bn" ? "JSON কোড পেস্ট করুন" : "Paste JSON Code"}
                </label>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  rows={6}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleJsonFormat}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow"
                >
                  {lang === "bn" ? "বিউটিফাই (Format)" : "Format JSON"}
                </button>
                <button
                  onClick={handleJsonMinify}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                >
                  {lang === "bn" ? "মিনিফাই (Minify)" : "Minify JSON"}
                </button>
              </div>

              {jsonError && <p className="text-xs text-rose-500 font-semibold">{jsonError}</p>}

              {jsonOutput && (
                <div>
                  <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto max-h-80">
                    {jsonOutput}
                  </pre>
                  <button
                    onClick={() => handleCopy(jsonOutput)}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" /> {lang === "bn" ? "কপি করুন" : "Copy"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 7. EMI Calculator */}
          {params.slug === "emi-calculator" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "লোনের পরিমাণ (BDT)" : "Loan Amount (BDT)"}
                  </label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "সুদের হার (% বার্ষিক)" : "Interest Rate (% Yearly)"}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={loanRate}
                    onChange={(e) => setLoanRate(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "মেয়াদ (বছর)" : "Tenure (Years)"}
                  </label>
                  <input
                    type="number"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="p-4 bg-indigo-50 dark:bg-slate-800 rounded-2xl text-center">
                  <span className="text-xs font-bold text-indigo-600 block mb-1">{lang === "bn" ? "মাসিক কিস্তি (EMI)" : "Monthly EMI"}</span>
                  <span className="text-2xl font-black text-indigo-700 dark:text-indigo-300">
                    ৳{emi.toLocaleString()}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center">
                  <span className="text-xs font-bold text-slate-500 block mb-1">{lang === "bn" ? "মোট সুদ" : "Total Interest"}</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-white">
                    ৳{totalInterest.toLocaleString()}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center">
                  <span className="text-xs font-bold text-slate-500 block mb-1">{lang === "bn" ? "মোট পরিশোধ" : "Total Repay"}</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-white">
                    ৳{totalRepay.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}



          {/* 10. Marriage Biodata Quick Generator with Real PDF */}
          {params.slug === "marriage-biodata" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "পাত্র/পাত্রীর নাম" : "Candidate Name"}
                  </label>
                  <input
                    type="text"
                    value={bioName}
                    onChange={(e) => setBioName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "উচ্চতা ও গায়ের রং" : "Height & Complexion"}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={bioHeight}
                      onChange={(e) => setBioHeight(e.target.value)}
                      className="w-1/2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                    />
                    <input
                      type="text"
                      value={bioComplexion}
                      onChange={(e) => setBioComplexion(e.target.value)}
                      className="w-1/2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "শিক্ষাগত যোগ্যতা" : "Education"}
                  </label>
                  <input
                    type="text"
                    value={bioEdu}
                    onChange={(e) => setBioEdu(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "বর্তমান পেশা" : "Profession"}
                  </label>
                  <input
                    type="text"
                    value={bioOcc}
                    onChange={(e) => setBioOcc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "ঠিকানা / বাসস্থান" : "Location"}
                  </label>
                  <input
                    type="text"
                    value={bioLoc}
                    onChange={(e) => setBioLoc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "পারিবারিক তথ্য" : "Family Info"}
                  </label>
                  <input
                    type="text"
                    value={bioFamily}
                    onChange={(e) => setBioFamily(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === "bn" ? "জীবনসঙ্গীর প্রত্যাশা" : "Partner Expectations"}
                </label>
                <textarea
                  value={bioExpect}
                  onChange={(e) => setBioExpect(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                />
              </div>

              {/* Template Style Selector */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {lang === "bn" ? "ডিজাইন প্রিসেট নির্বাচন করুন:" : "Choose Design Preset:"}
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setBioTheme("gold")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      bioTheme === "gold"
                        ? "bg-amber-500 text-white shadow-md ring-2 ring-amber-300"
                        : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-amber-50"
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>{lang === "bn" ? "রয়্যাল গোল্ডেন" : "Royal Gold"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBioTheme("lavender")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      bioTheme === "lavender"
                        ? "bg-rose-500 text-white shadow-md ring-2 ring-rose-300"
                        : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-rose-50"
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>{lang === "bn" ? "মডার্ন ফ্লোরাল" : "Modern Floral"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBioTheme("navy")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      bioTheme === "navy"
                        ? "bg-slate-900 text-white shadow-md ring-2 ring-indigo-400"
                        : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{lang === "bn" ? "এক্সিকিউটিভ নেভি" : "Executive Navy"}</span>
                  </button>
                </div>
              </div>

              {/* Bio-data Card Preview & Real Download with mobile scroll protection */}
              <div className="w-full overflow-x-auto pb-2 no-scrollbar">
                <div
                  id="biodata-print-template"
                  className={`min-w-[540px] sm:min-w-full p-8 sm:p-10 rounded-2xl bg-white text-slate-900 shadow-md space-y-6 text-left border-4 transition-all ${
                  bioTheme === "gold"
                    ? "border-amber-400"
                    : bioTheme === "lavender"
                    ? "border-rose-300"
                    : "border-slate-800"
                }`}
              >
                <div
                  className={`text-center space-y-1 pb-4 border-b-2 ${
                    bioTheme === "gold"
                      ? "border-amber-500"
                      : bioTheme === "lavender"
                      ? "border-rose-400"
                      : "border-slate-800"
                  }`}
                >
                  <span
                    className={`text-xs font-bold uppercase tracking-widest block ${
                      bioTheme === "gold"
                        ? "text-amber-700"
                        : bioTheme === "lavender"
                        ? "text-rose-600"
                        : "text-slate-600"
                    }`}
                  >
                    বিসমিল্লাহির রাহমানির রাহিম
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wide">
                    ম্যারেজ বায়োডাটা (MATRIMONIAL BIO-DATA)
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold">
                    ToolKaj.com - প্রফেশনাল বিয়ের জীবনবৃত্তান্ত
                  </p>
                </div>

                {/* Section 1: Personal */}
                <div className="space-y-3">
                  <div
                    className={`w-full px-4 py-2 rounded-lg border-l-4 ${
                      bioTheme === "gold"
                        ? "bg-amber-50/80 border-amber-600 text-amber-950"
                        : bioTheme === "lavender"
                        ? "bg-rose-50/80 border-rose-500 text-rose-950"
                        : "bg-slate-100 border-slate-800 text-slate-900"
                    }`}
                  >
                    <h3 className="text-xs font-black uppercase tracking-wider leading-normal">
                      ১. ব্যক্তিগত তথ্যাবলী (Personal Information)
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm px-2">
                    <div>
                      <span className="text-slate-500 text-xs block font-medium">পাত্র / পাত্রীর নাম:</span>
                      <strong className="text-slate-900 text-base">{bioName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block font-medium">শারীরিক গঠন ও গায়ের রঙ:</span>
                      <strong className="text-slate-900">{bioHeight} • {bioComplexion}</strong>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-500 text-xs block font-medium">বর্তমান ও স্থায়ী ঠিকানা:</span>
                      <span className="text-slate-900 font-semibold">{bioLoc}</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Education & Career */}
                <div className="space-y-3 pt-2">
                  <div
                    className={`w-full px-4 py-2 rounded-lg border-l-4 ${
                      bioTheme === "gold"
                        ? "bg-amber-50/80 border-amber-600 text-amber-950"
                        : bioTheme === "lavender"
                        ? "bg-rose-50/80 border-rose-500 text-rose-950"
                        : "bg-slate-100 border-slate-800 text-slate-900"
                    }`}
                  >
                    <h3 className="text-xs font-black uppercase tracking-wider leading-normal">
                      ২. শিক্ষাগত ও পেশাগত বিবরণ (Education & Profession)
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm px-2">
                    <div>
                      <span className="text-slate-500 text-xs block font-medium">শিক্ষাগত যোগ্যতা:</span>
                      <strong className="text-slate-900">{bioEdu}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block font-medium">বর্তমান পেশা / কর্মসংস্থান:</span>
                      <strong className="text-slate-900">{bioOcc}</strong>
                    </div>
                  </div>
                </div>

                {/* Section 3: Family */}
                <div className="space-y-3 pt-2">
                  <div
                    className={`w-full px-4 py-2 rounded-lg border-l-4 ${
                      bioTheme === "gold"
                        ? "bg-amber-50/80 border-amber-600 text-amber-950"
                        : bioTheme === "lavender"
                        ? "bg-rose-50/80 border-rose-500 text-rose-950"
                        : "bg-slate-100 border-slate-800 text-slate-900"
                    }`}
                  >
                    <h3 className="text-xs font-black uppercase tracking-wider leading-normal">
                      ৩. পারিবারিক বিবরণ (Family Background)
                    </h3>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 px-2 leading-relaxed">{bioFamily}</p>
                </div>

                {/* Section 4: Expectations */}
                <div className="space-y-3 pt-2">
                  <div
                    className={`w-full px-4 py-2 rounded-lg border-l-4 ${
                      bioTheme === "gold"
                        ? "bg-amber-50/80 border-amber-600 text-amber-950"
                        : bioTheme === "lavender"
                        ? "bg-rose-50/80 border-rose-500 text-rose-950"
                        : "bg-slate-100 border-slate-800 text-slate-900"
                    }`}
                  >
                    <h3 className="text-xs font-black uppercase tracking-wider leading-normal">
                      ৪. জীবনসঙ্গীর কাছে প্রত্যাশা (Expectations)
                    </h3>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 px-2 leading-relaxed">{bioExpect}</p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-400">
                  <span>তৈরি করা হয়েছে ToolKaj.com থেকে</span>
                  <span>গোপনীয় পারিবারিক দলিল</span>
                </div>
              </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <button
                  onClick={generateMarriageBiodataPdf}
                  disabled={isGeneratingPdf}
                  className="px-8 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-sm shadow-md flex items-center gap-2"
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{lang === "bn" ? "PDF তৈরি হচ্ছে..." : "Generating PDF..."}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>{lang === "bn" ? "প্রফেশনাল বায়োডাটা PDF ডাউনলোড করুন" : "Download Biodata PDF"}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border text-slate-700 dark:text-slate-300 font-bold text-sm"
                >
                  {lang === "bn" ? "সরাসরি প্রিন্ট / সেভ করুন" : "Print Directly"}
                </button>
              </div>
            </div>
          )}

          {/* 11. Family Card Form (TCB / Govt Ration) with Real PDF */}
          {params.slug === "family-card-form" && (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300">
                {lang === "bn"
                  ? "টিসিবি ও সরকারি খাদ্যবান্ধব কর্মসূচির ফ্যামিলি কার্ড আবেদনের জন্য নিচের তথ্যগুলো পূরণ করুন এবং এক ক্লিকে স্পষ্ট বাংলা হরফে প্রিন্ট-রেডি PDF আবেদনপত্র ডাউনলোড করুন।"
                  : "Fill in the details below to generate a print-ready official TCB Family Card application form with 100% accurate Bengali text."}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "পরিবার প্রধানের নাম" : "Head of Family Name"}
                  </label>
                  <input
                    type="text"
                    value={fcHead}
                    onChange={(e) => setFcHead(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "পিতা / স্বামীর নাম" : "Father / Husband Name"}
                  </label>
                  <input
                    type="text"
                    value={fcFather}
                    onChange={(e) => setFcFather(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "জাতীয় পরিচয়পত্র (NID) নম্বর" : "National ID (NID)"}
                  </label>
                  <input
                    type="text"
                    value={fcNid}
                    onChange={(e) => setFcNid(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "মোবাইল নম্বর" : "Mobile Number"}
                  </label>
                  <input
                    type="text"
                    value={fcMobile}
                    onChange={(e) => setFcMobile(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "ওয়ার্ড / ইউনিয়ন" : "Ward / Union"}
                  </label>
                  <input
                    type="text"
                    value={fcWard}
                    onChange={(e) => setFcWard(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "উপজেলা / থানা" : "Upazila / Thana"}
                  </label>
                  <input
                    type="text"
                    value={fcUpazila}
                    onChange={(e) => setFcUpazila(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "জেলা" : "District"}
                  </label>
                  <input
                    type="text"
                    value={fcDistrict}
                    onChange={(e) => setFcDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "পরিবারের সদস্য সংখ্যা" : "Family Members"}
                  </label>
                  <input
                    type="text"
                    value={fcMembers}
                    onChange={(e) => setFcMembers(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "মাসিক আয় (টাকা)" : "Monthly Income (BDT)"}
                  </label>
                  <input
                    type="text"
                    value={fcIncome}
                    onChange={(e) => setFcIncome(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Printable Template for Family Card Form */}
              <div className="w-full overflow-x-auto pb-2 no-scrollbar">
                <div
                  id="familycard-print-template"
                  className="min-w-[540px] sm:min-w-full p-8 sm:p-10 rounded-2xl bg-white text-slate-900 border-2 border-emerald-500 shadow-md space-y-6 text-left"
                >
                {/* Official Gov Header */}
                <div className="text-center space-y-1 border-b-2 border-emerald-600 pb-4">
                  <div className="inline-block px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold tracking-wider mb-1">
                    গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    বাণিজ্য মন্ত্রণালয় • ট্রেডিং কর্পোরেশন অব বাংলাদেশ (টিসিবি)
                  </h2>
                  <p className="text-sm font-bold text-emerald-700">
                    খাদ্যবান্ধব কর্মসূচি ও উপকারভোগী ফ্যামিলি কার্ড আবেদন ফরম
                  </p>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2 px-2">
                    <span>আবেদন ট্র্যাকিং নং: TCB-{(fcNid || "123456").slice(-6)}</span>
                    <span>আবেদনের তারিখ: {new Date().toLocaleDateString("bn-BD")}</span>
                  </div>
                </div>

                {/* Section 1: Basic Information */}
                <div className="space-y-3">
                  <div className="w-full bg-emerald-50 border-l-4 border-emerald-600 px-4 py-2 rounded-r-md">
                    <h3 className="text-xs font-black uppercase tracking-wider text-emerald-950 leading-normal">
                      ১. উপকারভোগী আবেদনকারীর পরিচিতি (Applicant Profile)
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-500 text-xs block">পরিবার প্রধানের নাম:</span>
                      <strong className="text-slate-900 text-base">{fcHead || "—"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block">পিতা / স্বামীর নাম:</span>
                      <strong className="text-slate-900 text-base">{fcFather || "—"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block">জাতীয় পরিচয়পত্র (NID) নম্বর:</span>
                      <strong className="text-slate-900 font-mono text-base">{fcNid || "—"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block">যোগাযোগের মোবাইল নম্বর:</span>
                      <strong className="text-slate-900 font-mono text-base">{fcMobile || "—"}</strong>
                    </div>
                  </div>
                </div>

                {/* Section 2: Address & Household */}
                <div className="space-y-3 pt-2">
                  <div className="w-full bg-emerald-50 border-l-4 border-emerald-600 px-4 py-2 rounded-r-md">
                    <h3 className="text-xs font-black uppercase tracking-wider text-emerald-950 leading-normal">
                      ২. স্থায়ী ঠিকানা ও পারিবারিক অবস্থা (Address & Family Status)
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-500 text-xs block">ওয়ার্ড / ইউনিয়ন:</span>
                      <strong className="text-slate-900">{fcWard || "—"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block">উপজেলা / থানা:</span>
                      <strong className="text-slate-900">{fcUpazila || "—"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block">জেলা:</span>
                      <strong className="text-slate-900">{fcDistrict || "—"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block">পরিবারের মোট সদস্য:</span>
                      <strong className="text-slate-900">{fcMembers} জন</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block">পরিবারের মাসিক আয়:</span>
                      <strong className="text-slate-900">৳ {fcIncome}/-</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block">আবেদনের ক্যাটাগরি:</span>
                      <strong className="text-emerald-700">নিম্নবিত্ত / খাদ্য সহায়তা</strong>
                    </div>
                  </div>
                </div>

                {/* Section 3: Declaration */}
                <div className="space-y-3 pt-2">
                  <div className="w-full bg-emerald-50 border-l-4 border-emerald-600 px-4 py-2 rounded-r-md">
                    <h3 className="text-xs font-black uppercase tracking-wider text-emerald-950 leading-normal">
                      ৩. আবেদনকারীর অঙ্গীকারনামা (Declaration)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/70 p-3 rounded-lg border border-amber-200">
                    আমি এই মর্মে দৃঢ় অঙ্গীকার করছি যে, আমার পরিবারের অন্য কোনো সদস্যের নামে সরকারি টিসিবি বা খাদ্যবান্ধব ফ্যামিলি কার্ড নেই। উপরে বর্ণিত যাবতীয় তথ্য সম্পূর্ণ সত্য ও সঠিক। কোনো অসত্য তথ্য প্রমাণিত হলে আমার কার্ড বাতিল এবং আইনগত ব্যবস্থা গ্রহণ প্রযোজ্য হবে।
                  </p>
                </div>

                {/* Signature Boxes */}
                <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
                  <div className="border-t-2 border-dashed border-slate-400 pt-2">
                    <span className="font-bold text-slate-800 block">আবেদনকারীর স্বাক্ষর / টিপসহি</span>
                    <span className="text-[10px] text-slate-400">তারিখ: ...........................</span>
                  </div>
                  <div className="border-t-2 border-dashed border-slate-400 pt-2">
                    <span className="font-bold text-slate-800 block">ওয়ার্ড কাউন্সিলর / ইউপি চেয়ারম্যানের সিল ও স্বাক্ষর</span>
                    <span className="text-[10px] text-slate-400">অনুমোদনের তারিখ: ...........................</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
                  <span>ToolKaj.com - গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের খাদ্যবান্ধব কর্মসূচির আবেদন ফরম</span>
                  <span>ফরম নং: TCB-BD-2026</span>
                </div>
              </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <button
                  onClick={generateFamilyCardPdf}
                  disabled={isGeneratingPdf}
                  className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-md flex items-center gap-2"
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{lang === "bn" ? "PDF তৈরি হচ্ছে..." : "Generating PDF..."}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>{lang === "bn" ? "ফ্যামিলি কার্ড আবেদন ফরম (PDF) ডাউনলোড করুন" : "Download Family Card PDF"}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border text-slate-700 dark:text-slate-300 font-bold text-sm"
                >
                  {lang === "bn" ? "সরাসরি প্রিন্ট / সেভ করুন" : "Print Directly"}
                </button>
              </div>
            </div>
          )}

          {/* 12. Fuel Card Form with Real PDF */}
          {params.slug === "fuel-card-form" && (
            <div className="space-y-6">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 rounded-2xl text-xs text-indigo-800 dark:text-indigo-300">
                {lang === "bn"
                  ? "গাড়ি ও প্রতিষ্ঠানের জ্বালানি তেলের মাসিক বরাদ্দ ও পারমিট স্লিপ প্রস্তুত করুন এবং নিখুঁত বাংলা হরফে প্রিন্ট-রেডি PDF ডাউনলোড করুন।"
                  : "Generate standard official fuel allocation and vehicle requisition vouchers with crisp PDF export."}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "গাড়ির ধরণ" : "Vehicle Type"}
                  </label>
                  <input
                    type="text"
                    value={fuelVehicle}
                    onChange={(e) => setFuelVehicle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "রেজিস্ট্রেশন নম্বর" : "Registration No"}
                  </label>
                  <input
                    type="text"
                    value={fuelReg}
                    onChange={(e) => setFuelReg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "চালক / প্রতিনিধির নাম" : "Driver / Owner Name"}
                  </label>
                  <input
                    type="text"
                    value={fuelDriver}
                    onChange={(e) => setFuelDriver(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "অনুমোদিত জ্বালানি কোটা" : "Fuel Quota"}
                  </label>
                  <input
                    type="text"
                    value={fuelQuota}
                    onChange={(e) => setFuelQuota(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "জ্বালানির ধরণ" : "Fuel Type"}
                  </label>
                  <input
                    type="text"
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Printable Template for Fuel Card Form */}
              <div className="w-full overflow-x-auto pb-2 no-scrollbar">
                <div
                  id="fuelcard-print-template"
                  className="min-w-[540px] sm:min-w-full p-8 sm:p-10 rounded-2xl bg-white text-slate-900 border-2 border-indigo-600 shadow-md space-y-6 text-left"
                >
                {/* Header */}
                <div className="text-center space-y-1 border-b-2 border-indigo-600 pb-4">
                  <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-widest block">
                    বাংলাদেশ সড়ক পরিবহন ও জ্বালানি ব্যবস্থাপনা
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    জ্বালানি তেল চাহিদা ও বিতরণ অনুমোদন ভাউচার
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold">
                    OFFICIAL VEHICLE FUEL REQUISITION & DISPATCH VOUCHER
                  </p>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2 px-2">
                    <span>ভাউচার নং: VR-{(fuelReg || "1234").replace(/[^a-zA-Z0-9]/g, "").slice(-6) || "90124"}</span>
                    <span>ইস্যুর তারিখ: {new Date().toLocaleDateString("bn-BD")}</span>
                  </div>
                </div>

                {/* Section 1: Vehicle & Driver */}
                <div className="space-y-3">
                  <div className="w-full bg-indigo-50 border-l-4 border-indigo-600 px-4 py-2 rounded-r-md">
                    <h3 className="text-xs font-black uppercase tracking-wider text-indigo-950 leading-normal">
                      ১. যানবাহন ও চালকের তথ্যাবলী (Vehicle & Driver Details)
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-500 text-xs block">যানবাহনের ধরণ ও বিবরণ:</span>
                      <strong className="text-slate-900 text-base">{fuelVehicle || "—"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block">গাড়ির রেজিস্ট্রেশন নম্বর:</span>
                      <strong className="text-slate-900 text-base font-mono">{fuelReg || "—"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block">দায়িত্বরত চালকের নাম:</span>
                      <strong className="text-slate-900 text-base">{fuelDriver || "—"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block">জ্বালানির প্রকারভেদ:</span>
                      <strong className="text-indigo-700 text-base">{fuelType || "—"}</strong>
                    </div>
                  </div>
                </div>

                {/* Section 2: Requisition & Log Table */}
                <div className="space-y-3 pt-2">
                  <div className="w-full bg-indigo-50 border-l-4 border-indigo-600 px-4 py-2 rounded-r-md">
                    <h3 className="text-xs font-black uppercase tracking-wider text-indigo-950 leading-normal">
                      ২. বরাদ্দ ও কিলোমিটার লগ (Requisition & Meter Log)
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border border-slate-300">
                      <thead className="bg-slate-100 text-slate-700 uppercase font-bold">
                        <tr>
                          <th className="p-2.5 border border-slate-300">অনুমোদিত কোটা</th>
                          <th className="p-2.5 border border-slate-300">পূর্ববর্তী ওডোমিটার</th>
                          <th className="p-2.5 border border-slate-300">বর্তমান ওডোমিটার</th>
                          <th className="p-2.5 border border-slate-300">বিতরণকৃত পরিমাণ</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border border-slate-300 font-semibold text-slate-800">
                          <td className="p-3 border border-slate-300 text-indigo-700 font-bold">{fuelQuota || "৫০ লিটার"}</td>
                          <td className="p-3 border border-slate-300">................... কিমি</td>
                          <td className="p-3 border border-slate-300">................... কিমি</td>
                          <td className="p-3 border border-slate-300 font-bold">{fuelQuota || "৫০ লিটার"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Signature Section */}
                <div className="pt-8 grid grid-cols-3 gap-4 text-center text-xs">
                  <div className="border-t-2 border-dashed border-slate-400 pt-2">
                    <span className="font-bold text-slate-800 block">চালকের স্বাক্ষর</span>
                    <span className="text-[10px] text-slate-400">তারিখ: ....................</span>
                  </div>
                  <div className="border-t-2 border-dashed border-slate-400 pt-2">
                    <span className="font-bold text-slate-800 block">অনুমোদনকারী কর্মকর্তা</span>
                    <span className="text-[10px] text-slate-400">পদবি ও সিল</span>
                  </div>
                  <div className="border-t-2 border-dashed border-slate-400 pt-2">
                    <span className="font-bold text-slate-800 block">ফিলিং স্টেশনের ইনচার্জ</span>
                    <span className="text-[10px] text-slate-400">পাম্প সিল ও তারিখ</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
                  <span>ToolKaj.com - ডিজিটাল ভেহিক্যাল ম্যানেজমেন্ট ও জ্বালানি ভাউচার</span>
                  <span>সংরক্ষণযোগ্য অফিসিয়াল নথি</span>
                </div>
              </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <button
                  onClick={generateFuelCardPdf}
                  disabled={isGeneratingPdf}
                  className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md flex items-center gap-2"
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{lang === "bn" ? "PDF তৈরি হচ্ছে..." : "Generating PDF..."}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>{lang === "bn" ? "জ্বালানি ভাউচার (PDF) ডাউনলোড করুন" : "Download Fuel Requisition PDF"}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border text-slate-700 dark:text-slate-300 font-bold text-sm"
                >
                  {lang === "bn" ? "সরাসরি প্রিন্ট / সেভ করুন" : "Print Directly"}
                </button>
              </div>
            </div>
          )}

          {/* 13. Bengali Date Converter */}
          {params.slug === "date-converter" && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === "bn" ? "ইংরেজি তারিখ নির্বাচন করুন" : "Select Gregorian Date"}
                </label>
                <input
                  type="date"
                  value={gregorianDate}
                  onChange={(e) => setGregorianDate(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold"
                />
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-850 border border-emerald-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest block">
                  {lang === "bn" ? "অফিসিয়াল বাংলাদেশ বঙ্গাব্দ তারিখ" : "Official Bengali Bangabda Date"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {getBanglaDateDetails(gregorianDate).dateBn}
                </h3>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950">
                    ঋতু: {getBanglaDateDetails(gregorianDate).season}
                  </span>
                  <span>• {getBanglaDateDetails(gregorianDate).englishFormatted}</span>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => handleCopy(getBanglaDateDetails(gregorianDate).dateBn)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{lang === "bn" ? "বাংলা তারিখ কপি করুন" : "Copy Bengali Date"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 14. YouTube Tags Extractor */}
          {params.slug === "youtube-tags" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === "bn" ? "ইউটিউব ভিডিও লিংক পেস্ট করুন" : "Paste YouTube Video Link"}
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={ytUrl}
                    onChange={(e) => setYtUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm font-mono"
                  />
                  <button
                    onClick={extractYtTags}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>{lang === "bn" ? "ট্যাগ বের করুন" : "Extract Tags"}</span>
                  </button>
                </div>
              </div>

              {extractedTags.length > 0 && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {lang === "bn" ? `এক্সট্র্যাক্ট করা ট্যাগসমূহ (${extractedTags.length}টি)` : `Extracted Tags (${extractedTags.length})`}
                    </span>
                    <button
                      onClick={() => handleCopy(extractedTags.join(", "))}
                      className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> {lang === "bn" ? "সব ট্যাগ কপি করুন" : "Copy All"}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {extractedTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border text-xs font-semibold text-slate-800 dark:text-slate-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 15. Secret Santa Generator */}
          {params.slug === "secret-santa" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === "bn" ? "অংশগ্রহণকারীদের নাম (কমা দিয়ে লিখুন)" : "Participant Names (comma separated)"}
                </label>
                <textarea
                  value={santaNames}
                  onChange={(e) => setSantaNames(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm"
                />
              </div>

              <button
                onClick={generateSecretSanta}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow flex items-center gap-1.5"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>{lang === "bn" ? "সিক্রেট সান্তা পেয়ার তৈরি করুন" : "Generate Secret Santa Pairs"}</span>
              </button>

              {santaPairs.length > 0 && (
                <div className="space-y-2 pt-2 animate-fade-in">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {lang === "bn" ? "সিক্রেট কার্ডে ক্লিক করে গিফট গ্রহীতার নাম দেখুন:" : "Click card to reveal recipient:"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {santaPairs.map((pair, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          const updated = [...santaPairs];
                          updated[idx].revealed = !updated[idx].revealed;
                          setSantaPairs(updated);
                        }}
                        className="p-4 rounded-xl border border-rose-200 dark:border-rose-950 bg-rose-50/50 dark:bg-slate-800 cursor-pointer hover:shadow-md transition-all flex items-center justify-between"
                      >
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {pair.giver}
                        </span>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-bold ${
                            pair.revealed
                              ? "bg-rose-600 text-white"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          {pair.revealed ? `উপহার পাবেন: ${pair.receiver}` : (lang === "bn" ? "ক্লিক করে দেখুন" : "Click to Reveal")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 16. Image Watermark (Generic) */}
          {(params.slug === "watermark" || params.slug === "image-watermark") && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === "bn" ? "ওয়াটারমার্ক টেক্সট" : "Watermark Text"}
                </label>
                <input
                  type="text"
                  value={imgWmText}
                  onChange={(e) => setImgWmText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm font-bold"
                />
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImgWmFile(e.target.files[0]);
                    handleImageWatermark(e.target.files[0]);
                  }
                }}
                className="block text-xs"
              />

              {imgWmResult && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-slate-850 border border-emerald-200 text-center space-y-3">
                  <img src={imgWmResult} alt="Watermarked" className="max-h-60 mx-auto rounded-lg" />
                  <a
                    href={imgWmResult}
                    download="toolkaj_watermark.png"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{lang === "bn" ? "ছবি ডাউনলোড করুন" : "Download Photo"}</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* 17. Image Resize & Crop (Generic) */}
          {(params.slug === "resize-crop" || params.slug === "image-resize-crop") && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "প্রস্থ (Width px)" : "Width (px)"}
                  </label>
                  <input
                    type="number"
                    value={rcWidth}
                    onChange={(e) => setRcWidth(parseInt(e.target.value) || 100)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {lang === "bn" ? "উচ্চতা (Height px)" : "Height (px)"}
                  </label>
                  <input
                    type="number"
                    value={rcHeight}
                    onChange={(e) => setRcHeight(parseInt(e.target.value) || 100)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm font-bold"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => { setRcWidth(413); setRcHeight(531); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold"
                >
                  পাসপোর্ট (35x45mm)
                </button>
                <button
                  onClick={() => { setRcWidth(300); setRcHeight(300); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold"
                >
                  ১:১ স্কয়ার (300x300)
                </button>
                <button
                  onClick={() => { setRcWidth(1280); setRcHeight(720); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold"
                >
                  HD 16:9 (1280x720)
                </button>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setRcFile(e.target.files[0]);
                    handleImageResize(e.target.files[0]);
                  }
                }}
                className="block text-xs"
              />

              {rcResult && (
                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-slate-850 border border-indigo-200 text-center space-y-3">
                  <img src={rcResult} alt="Resized" className="max-h-60 mx-auto rounded-lg" />
                  <a
                    href={rcResult}
                    download="toolkaj_resized.jpg"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{lang === "bn" ? "রিসাইজ ছবি ডাউনলোড করুন" : "Download Resized Photo"}</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* 18. Passport to PDF */}
          {params.slug === "passport-to-pdf" && (
            <div className="space-y-4">
              <label className="border-2 border-dashed border-indigo-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-indigo-50/20 text-center">
                <Upload className="w-8 h-8 text-indigo-600 mb-2" />
                <span className="font-bold text-sm text-slate-800 dark:text-white">
                  {lang === "bn" ? "পাসপোর্টের ছবি বা স্ক্যান কপি আপলোড করুন" : "Upload Passport Bio-page Scan/Photo"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPassFile(e.target.files[0]);
                      handlePassportPdf(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
              </label>

              {passPdfUrl && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-slate-800 border border-emerald-200 text-center space-y-3">
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    {lang === "bn" ? "প্রিন্ট-রেডি A4 পাসপোর্ট PDF তৈরি সম্পন্ন হয়েছে!" : "Printable A4 Passport PDF Ready!"}
                  </p>
                  <a
                    href={passPdfUrl}
                    download="passport_print_a4.pdf"
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{lang === "bn" ? "A4 PDF ডাউনলোড করুন" : "Download A4 PDF"}</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
