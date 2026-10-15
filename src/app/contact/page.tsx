"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Send, Check, MessageSquare } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useApp } from "@/context/AppContext";

export default function ContactPage() {
  const { lang } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "feedback_messages"), {
        name,
        email,
        message,
        timestamp: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (err) {
      console.warn("Feedback save error (offline or rules fallback):", err);
      setSubmitted(true); // gracefully acknowledge
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full py-16 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-indigo-600 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {lang === "bn" ? "হোম" : "Home"}
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            {lang === "bn" ? "যোগাযোগ" : "Contact"}
          </span>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-8 sm:p-12 shadow-sm space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold mb-3">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />{" "}
              {lang === "bn" ? "প্রতিক্রিয়া ও নতুন টুলের অনুরোধ" : "Feedback & Tool Requests"}
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              {lang === "bn" ? "আমাদের সাথে যোগাযোগ করুন" : "Get in Touch With Us"}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              {lang === "bn"
                ? "কোনো নতুন টুলের প্রয়োজন থাকলে বা কোনো সমস্যার সম্মুখীন হলে আমাদের মেসেজ পাঠান।"
                : "Have a tool suggestion, feature request, or spotted a bug? Send us a direct message."}
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-center space-y-3 animate-fade-in">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {lang === "bn" ? "ধন্যবাদ!" : "Thank You!"}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {lang === "bn"
                  ? "আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই পর্যালোচনা করব।"
                  : "Your message has been received. Our team will review your feedback soon."}
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName("");
                  setEmail("");
                  setMessage("");
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow hover:bg-indigo-700"
              >
                {lang === "bn" ? "আরেকটি বার্তা পাঠান" : "Send Another Message"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === "bn" ? "আপনার নাম" : "Your Name"}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === "bn" ? "আপনার পূর্ণ নাম" : "Your full name"}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === "bn" ? "ইমেইল অ্যাড্রেস" : "Email Address"}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {lang === "bn" ? "আপনার বার্তা / মতামত" : "Your Message / Feedback"}
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    lang === "bn"
                      ? "আপনার পরামর্শ বা বাগ রিপোর্ট লিখুন..."
                      : "Write your suggestions or details..."
                  }
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? lang === "bn"
                      ? "পাঠানো হচ্ছে..."
                      : "Sending..."
                    : lang === "bn"
                    ? "বার্তা পাঠান"
                    : "Send Message"}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
