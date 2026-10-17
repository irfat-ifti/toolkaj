"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, QrCode, Download, Copy, Check, Sparkles, Wifi, Globe, Phone, Mail, FileText } from "lucide-react";
import QRCode from "qrcode";
import ToolSeoSection from "@/components/ToolSeoSection";

export default function QrCodePage() {
  const [qrType, setQrType] = useState<"url" | "text" | "wifi" | "phone" | "email">("url");
  const [urlInput, setUrlInput] = useState("https://toolkaj.vercel.app");
  const [textInput, setTextInput] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiAuth, setWifiAuth] = useState("WPA");
  const [phoneInput, setPhoneInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrSize, setQrSize] = useState(300);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Generate payload string
  const getQrPayload = () => {
    switch (qrType) {
      case "url":
        return urlInput || "https://toolkaj.vercel.app";
      case "text":
        return textInput || "Welcome to ToolKaj";
      case "wifi":
        return `WIFI:S:${wifiSsid};T:${wifiAuth};P:${wifiPassword};;`;
      case "phone":
        return `tel:${phoneInput}`;
      case "email":
        return `mailto:${emailInput}`;
      default:
        return urlInput;
    }
  };

  useEffect(() => {
    const payload = getQrPayload();
    QRCode.toDataURL(payload, {
      width: qrSize,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => console.error(err));
  }, [qrType, urlInput, textInput, wifiSsid, wifiPassword, wifiAuth, phoneInput, emailInput, fgColor, bgColor, qrSize]);

  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `qrcode_${qrType}_${Date.now()}.png`;
    a.click();
  };

  const handleCopy = () => {
    if (!qrDataUrl) return;
    navigator.clipboard.writeText(getQrPayload());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <Link href="/category/image" className="hover:text-indigo-600">
            ইমেজ টুলস
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            কিউআর কোড জেনারেটর
          </span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> কাস্টম কালার ও হাই রেজোলিউশন
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            কিউআর কোড জেনারেটর (QR Code Generator)
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            ওয়েবসাইট লিংক, ওয়াইফাই পাসওয়ার্ড, ফোন নম্বর ও টেক্সটের জন্য রঙিন কাস্টম QR কোড তৈরি ও ডাউনলোড করুন।
          </p>
        </div>

        {/* Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            {/* Type selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                QR কোডের ধরন নির্বাচন করুন
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { id: "url", label: "ওয়েবসাইট", icon: Globe },
                  { id: "wifi", label: "ওয়াইফাই", icon: Wifi },
                  { id: "text", label: "টেক্সট", icon: FileText },
                  { id: "phone", label: "ফোন", icon: Phone },
                  { id: "email", label: "ইমেইল", icon: Mail },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setQrType(item.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                        qrType === item.id
                          ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-sm"
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input by Type */}
            <div className="space-y-4">
              {qrType === "url" && (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    ওয়েবসাইট URL
                  </label>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              {qrType === "text" && (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    যেকোনো টেক্সট বা বার্তা
                  </label>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="আপনার বার্তা এখানে লিখুন..."
                    rows={4}
                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              {qrType === "wifi" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      WiFi নেটওয়ার্কের নাম (SSID)
                    </label>
                    <input
                      type="text"
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      placeholder="e.g. Home_WiFi_5G"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      WiFi পাসওয়ার্ড
                    </label>
                    <input
                      type="text"
                      value={wifiPassword}
                      onChange={(e) => setWifiPassword(e.target.value)}
                      placeholder="ওয়াইফাই পাসওয়ার্ড লিখুন"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      এনক্রিপশন ধরন
                    </label>
                    <select
                      value={wifiAuth}
                      onChange={(e) => setWifiAuth(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                    >
                      <option value="WPA">WPA/WPA2 (সর্বাধিক ব্যবহৃত)</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">পাসওয়ার্ড ছাড়া (Open)</option>
                    </select>
                  </div>
                </div>
              )}

              {qrType === "phone" && (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    ফোন নম্বর (কান্ট্রি কোডসহ)
                  </label>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+8801700000000"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              {qrType === "email" && (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    ইমেইল অ্যাড্রেস
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="example@mail.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
            </div>

            {/* Customization Options */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  QR কোডের রঙ (Foreground)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                  />
                  <span className="text-xs font-mono text-slate-600 dark:text-slate-400 uppercase">
                    {fgColor}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  ব্যাকগ্রাউন্ড রঙ (Background)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
                  />
                  <span className="text-xs font-mono text-slate-600 dark:text-slate-400 uppercase">
                    {bgColor}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview & Download Column */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              লাইভ QR কোড প্রিভিউ
            </span>

            {/* Canvas/Image Box */}
            <div
              className="p-4 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-6"
              style={{ backgroundColor: bgColor }}
            >
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Generated QR Code"
                  className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
                />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center text-slate-400 text-xs">
                  তৈরি হচ্ছে...
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="w-full space-y-3">
              <button
                onClick={handleDownloadPng}
                className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>PNG ইমেজ ডাউনলোড করুন</span>
              </button>

              <button
                onClick={handleCopy}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "কপি হয়েছে!" : "কনটেন্ট কপি করুন"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* SEO On-Page Content, FAQs, and Search Tag Badges */}
        <ToolSeoSection toolSlug="image/qr-code" />
      </div>
    </div>
  );
}
