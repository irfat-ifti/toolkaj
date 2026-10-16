"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Heart,
  UserPlus,
  Coins,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Lock,
  LogOut,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Flame,
  ArrowRight,
  TrendingUp,
  Clock,
  Send,
  HelpCircle,
  Eye,
} from "lucide-react";

function InstagramIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface UserProfile {
  username: string;
  credits: number;
  totalEarned: number;
  totalSpent: number;
  strikes?: number;
  createdAt?: number;
  avatar?: string | null;
}

interface CampaignItem {
  id: string;
  ownerUsername: string;
  type: "like" | "follow";
  rewardPerAction: number;
  isLocked?: boolean;
  targetUrl: string;
  remainingQuantity?: number;
  active?: boolean;
}

export default function DashboardClient() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [availableCampaigns, setAvailableCampaigns] = useState<CampaignItem[]>([]);
  const [myCampaigns, setMyCampaigns] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Login form state
  const [loginInput, setLoginInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  // Active task session for cross-platform verification
  const [activeSession, setActiveSession] = useState<{
    sessionId: string;
    campaignId: string;
    targetUrl: string;
    startedAt: number;
  } | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [statusType, setStatusType] = useState<"info" | "success" | "error" | "warning">("info");
  const isVerifyingRef = useRef(false);

  // Create Campaign state
  const [campaignType, setCampaignType] = useState<"like" | "follow">("like");
  const [postUrl, setPostUrl] = useState<string>("");
  const [reward, setReward] = useState<number>(2);
  const [quantity, setQuantity] = useState<number>(10);
  const [createMsg, setCreateMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch campaigns and user profile
  const refreshData = useCallback(async (usernameOverride?: string) => {
    const targetUsername = usernameOverride || user?.username;
    if (!targetUsername) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/campaigns/list?username=${encodeURIComponent(targetUsername)}`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        setAvailableCampaigns(data.availableCampaigns || []);
        setMyCampaigns(data.myCampaigns || []);
      } else {
        if (res.status === 404) {
          // User not found in db, reset localStorage
          localStorage.removeItem("toolkaj_ig_user");
          setUser(null);
        }
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.username]);

  // Initial load from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("toolkaj_ig_user");
    if (savedUser) {
      refreshData(savedUser);
    } else {
      setLoading(false);
    }
  }, [refreshData]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const clean = loginInput.trim().replace(/^@/, "");
    if (!clean) {
      setLoginError("অনুগ্রহ করে আপনার ইনস্টাগ্রাম ইউজারনেম লিখুন।");
      return;
    }

    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: clean }),
      });
      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || "লগইন করতে ব্যর্থ হয়েছে।");
        return;
      }

      setUser(data.user);
      localStorage.setItem("toolkaj_ig_user", data.user.username);
      setLoginInput("");
      refreshData(data.user.username);
    } catch {
      setLoginError("সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    if (confirm("আপনি কি ইনস্টাগ্রাম সেশন থেকে লগআউট করতে চান?")) {
      localStorage.removeItem("toolkaj_ig_user");
      setUser(null);
      setAvailableCampaigns([]);
      setMyCampaigns([]);
      setActiveSession(null);
      setStatusMessage("");
    }
  };

  // Start Task (Opens Instagram in new tab/app, acquires concurrency lock)
  const handleStartTask = async (campaignId: string) => {
    if (!user) return;
    setStatusMessage("টাস্ক প্রস্তুত ও লক করা হচ্ছে...");
    setStatusType("info");
    setActionLoading(true);

    try {
      const res = await fetch("/api/tasks/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId, workerUsername: user.username }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatusMessage(data.error || "টাস্ক শুরু করা যায়নি।");
        setStatusType("error");
        return;
      }

      const sessionObj = {
        sessionId: data.sessionId,
        campaignId,
        targetUrl: data.targetUrl,
        startedAt: Date.now(),
      };
      setActiveSession(sessionObj);
      setStatusMessage(
        "Instagram ওপেন হয়েছে! লাইক/ফলো দিয়ে অন্তত ৬ সেকেন্ড পর এই পেজে ফিরে আসুন। ফিরে আসার সাথে সাথে স্বয়ংক্রিয়ভাবে যাচাই করা হবে..."
      );
      setStatusType("warning");

      // Open Instagram URL in new tab / app
      window.open(data.targetUrl, "_blank", "noopener,noreferrer");
    } catch {
      setStatusMessage("টাস্ক শুরু করতে ত্রুটি হয়েছে। পুনরায় চেষ্টা করুন।");
      setStatusType("error");
    } finally {
      setActionLoading(false);
    }
  };

  // Verify Task (Triggered upon returning from Instagram tab or manual click)
  const handleVerify = useCallback(async () => {
    if (!activeSession || !user || isVerifyingRef.current) return;

    isVerifyingRef.current = true;
    setStatusMessage("আপনার কাজটি স্বয়ংক্রিয়ভাবে যাচাই করা হচ্ছে, অনুগ্রহ করে কয়েক সেকেন্ড অপেক্ষা করুন...");
    setStatusType("info");

    try {
      const res = await fetch("/api/tasks/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeSession.sessionId,
          workerUsername: user.username,
        }),
      });

      const result = await res.json();

      if (result.verified) {
        setStatusMessage(result.message || `অভিনন্দন! আপনি +${result.reward} ক্রেডিট পেয়েছেন!`);
        setStatusType("success");
        setActiveSession(null);
        refreshData();
      } else {
        setStatusMessage(result.error || "লাইক বা ফলো ভেরিফাই করা সম্ভব হয়নি।");
        setStatusType("error");
        setActiveSession(null);
      }
    } catch {
      setStatusMessage("ভেরিফিকেশনে কারিগরি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      setStatusType("error");
      setActiveSession(null);
    } finally {
      isVerifyingRef.current = false;
    }
  }, [activeSession, user, refreshData]);

  // Window Focus & Visibility Change Listeners for Instant Cross-Platform Detection
  useEffect(() => {
    const handleReturnToTab = () => {
      if (document.visibilityState === "visible" && activeSession && !isVerifyingRef.current) {
        const elapsed = (Date.now() - activeSession.startedAt) / 1000;
        // If elapsed is under 5 seconds, wait until 6 seconds so user isn't instantly failed
        if (elapsed < 6) {
          const delay = Math.ceil((6 - elapsed) * 1000) + 500;
          setTimeout(() => {
            handleVerify();
          }, delay);
        } else {
          handleVerify();
        }
      }
    };

    document.addEventListener("visibilitychange", handleReturnToTab);
    window.addEventListener("focus", handleReturnToTab);

    return () => {
      document.removeEventListener("visibilitychange", handleReturnToTab);
      window.removeEventListener("focus", handleReturnToTab);
    };
  }, [activeSession, handleVerify]);

  // Create Campaign
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setCreateMsg(null);

    const totalCost = reward * quantity;
    if (user.credits < totalCost) {
      setCreateMsg({
        type: "error",
        text: `পর্যাপ্ত ক্রেডিট নেই! আপনার ব্যালেন্স ${user.credits} ক্রেডিট, কিন্তু প্রয়োজন ${totalCost} ক্রেডিট। ক্রেডিট বাড়াতে অন্যদের টাস্ক সম্পন্ন করুন।`,
      });
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/campaigns/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loggedInUsername: user.username,
          type: campaignType,
          postUrl: campaignType === "like" ? postUrl : "",
          rewardPerAction: reward,
          quantity,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCreateMsg({
          type: "error",
          text: data.error || "ক্যাম্পেইন যুক্ত করতে ব্যর্থ হয়েছে।",
        });
      } else {
        setCreateMsg({
          type: "success",
          text: data.message || "ক্যাম্পেইন সফলভাবে যুক্ত হয়েছে!",
        });
        setPostUrl("");
        refreshData();
      }
    } catch {
      setCreateMsg({
        type: "error",
        text: "সার্ভারে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // ================= VIEW: Loading =================
  if (loading && !user) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-pink-500/30 border-t-pink-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          ইনস্টাগ্রাম এক্সচেঞ্জ ডাটা লোড হচ্ছে...
        </p>
      </div>
    );
  }

  // ================= VIEW 1: Unauthenticated Login Form =================
  if (!user) {
    return (
      <div className="w-full max-w-xl mx-auto space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          {/* Top aesthetic gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600" />

          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/25 mb-2">
              <InstagramIcon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              পাসওয়ার্ডহীন ইনস্টাগ্রাম লগইন
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              কোনো পাসওয়ার্ডের প্রয়োজন নেই! শুধু আপনার পাবলিক ইনস্টাগ্রাম ইউজারনেম দিয়ে প্রবেশ করুন এবং ফ্রিতে ১০ ক্রেডিট বোনাস পান।
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                ইনস্টাগ্রাম ইউজারনেম (Username)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center font-bold text-slate-400 dark:text-slate-500">
                  @
                </span>
                <input
                  type="text"
                  required
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="your_instagram_handle"
                  className="w-full pl-9 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>আপনার ইনস্টাগ্রাম পাসওয়ার্ড কখনই চাওয়া হবে না। ১০০% নিরাপদ ও অফিসিয়াল রুলস।</span>
              </p>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:opacity-95 text-white font-bold text-sm sm:text-base shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>আইডি যাচাই করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>লগইন করুন ও ১০ ক্রেডিট নিন</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security & Rules Guarantee */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>পাবলিক প্রোফাইল বাধ্যতামূলক</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>১০০% আসল সক্রিয় ইউজার</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <Lock className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>ওনারশিপ অটো-ভেরিফিকেশন</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <Coins className="w-4 h-4 text-pink-500 shrink-0" />
              <span>সম্পূর্ণ ফ্রি ক্রেডিট সিস্টেম</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= VIEW 2: Authenticated Dashboard =================
  const totalCost = reward * quantity;
  const canAfford = user.credits >= totalCost;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* 1. Header Profile & Credits Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-purple-500/30 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-1 shadow-lg shadow-pink-500/30">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-full h-full object-cover rounded-xl bg-slate-800"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center font-black text-2xl text-pink-400">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  @{user.username}
                </h2>
                <a
                  href={`https://www.instagram.com/${user.username}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                  title="ইনস্টাগ্রামে প্রোফাইল দেখুন"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <p className="text-xs text-pink-300 font-medium mt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>ভেরিফাইড ইউজার • শুধু আপনার নিজস্ব পোস্ট/আইডিতে বুস্ট সক্রিয়</span>
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-300">
                <span>মোট আর্ন: <b>{user.totalEarned}</b></span>
                <span>মোট খরচ: <b>{user.totalSpent}</b></span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
            <div className="text-left md:text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                বর্তমান ব্যালেন্স
              </span>
              <div className="flex items-center gap-2">
                <Coins className="w-6 h-6 text-amber-400 animate-pulse" />
                <span className="text-3xl sm:text-4xl font-black text-amber-400">
                  {user.credits}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase">Credits</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => refreshData()}
                disabled={loading}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-all"
                title="ব্যালেন্স রিফ্রেশ করুন"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>রিফ্রেশ</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/50 text-xs font-semibold text-rose-300 flex items-center gap-1.5 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>লগআউট</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Real-Time Task Notification & Verification Floating Card */}
      {statusMessage && (
        <div
          className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all shadow-lg ${
            statusType === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
              : statusType === "error"
              ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200"
              : statusType === "warning"
              ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200"
              : "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200"
          }`}
        >
          <div className="flex items-center gap-3">
            {statusType === "success" ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            ) : statusType === "error" ? (
              <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
            ) : (
              <RefreshCw className="w-6 h-6 animate-spin text-pink-600 shrink-0" />
            )}
            <span className="text-sm font-semibold leading-relaxed">{statusMessage}</span>
          </div>

          {activeSession && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleVerify}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>যাচাই সম্পন্ন করুন</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. Main Action Grid: Earn Credits (Left) & Boost My Account (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Earn Credits by Liking/Following (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-xs font-bold mb-2">
                  <Flame className="w-3.5 h-3.5 text-pink-600" />
                  <span>লাইভ টাস্ক ফিড</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  ১. ক্রেডিট উপার্জন করুন (Earn Free Credits)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  অন্যদের পোস্টে লাইক দিন বা প্রোফাইল ফলো করে ক্রেডিট আয় করুন।
                </p>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {availableCampaigns.length} টি টাস্ক সক্রিয়
              </span>
            </div>

            {availableCampaigns.length === 0 ? (
              <div className="text-center py-12 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <Clock className="w-10 h-10 text-slate-400 mx-auto mb-3 opacity-60" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  এই মুহূর্তে কোনো নতুন টাস্ক নেই!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  আপনি ইতিমধ্যে সব উপলব্ধ টাস্ক সম্পন্ন করেছেন অথবা অন্য কোনো ব্যবহারকারী ক্যাম্পেইন যোগ করার পর এখানে দেখাবে।
                </p>
                <button
                  onClick={() => refreshData()}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>পুনরায় চেক করুন</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {availableCampaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-pink-300 dark:hover:border-pink-800/60 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                          camp.type === "like"
                            ? "bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
                            : "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
                        }`}
                      >
                        {camp.type === "like" ? (
                          <Heart className="w-5 h-5 fill-current" />
                        ) : (
                          <UserPlus className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider ${
                              camp.type === "like"
                                ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                : "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                            }`}
                          >
                            {camp.type === "like" ? "পোস্ট লাইক" : "প্রোফাইল ফলো"}
                          </span>
                          {camp.isLocked && (
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                              <Lock className="w-3 h-3" />
                              <span>ব্যস্ত</span>
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate mt-1">
                          @{camp.ownerUsername}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartTask(camp.id)}
                      disabled={Boolean(activeSession) || actionLoading || camp.isLocked}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50 ${
                        camp.type === "like"
                          ? "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-pink-500/20"
                          : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/20"
                      }`}
                    >
                      {camp.isLocked ? (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>লক করা আছে</span>
                        </>
                      ) : (
                        <>
                          {camp.type === "like" ? (
                            <Heart className="w-3.5 h-3.5" />
                          ) : (
                            <UserPlus className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {camp.type === "like" ? "লাইক দিন" : "ফলো করুন"} (+{camp.rewardPerAction})
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Anti-Cheat & Concurrency Guidelines */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>স্বয়ংক্রিয় অ্যান্টি-চিট ও ভেরিফিকেশন নিয়মাবলী</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed">
                <li>টাস্ক বাটনে ক্লিক করলে ইনস্টাগ্রাম পেজ ওপেন হবে এবং ২৫ সেকেন্ডের জন্য টাস্কটি আপনার জন্য সংরক্ষিত থাকবে।</li>
                <li>সততার সাথে লাইক বা ফলো দিয়ে কমপক্ষে <b>৬ সেকেন্ড</b> অপেক্ষা করার পর এই ট্যাবে ফিরে আসুন।</li>
                <li>ট্যাবে ফিরে আসার সাথে সাথে ব্রাউজারের অটো-ডিটেকশন সিস্টেম স্ক্র্যাপারের মাধ্যমে লাইক বা ফলোয়ার বৃদ্ধি যাচাই করে আপনার অ্যাকাউন্টে ক্রেডিট যোগ করবে।</li>
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Boost My Account / Add Campaign Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <form
            onSubmit={handleCreateCampaign}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>অরিজিনাল এনগেজমেন্ট</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                ২. আপনার নিজের পোস্ট বা প্রোফাইল বুস্ট করুন
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                কঠোর সুরক্ষা গার্ড: শুধুমাত্র আপনার নিজস্ব ইনস্টাগ্রাম পোস্ট বা অ্যাকাউন্টে বুস্ট দেওয়া সম্ভব।
              </p>
            </div>

            {/* 1. Campaign Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                ক্যাম্পেইনের ধরন বেছে নিন
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCampaignType("like")}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col gap-1 ${
                    campaignType === "like"
                      ? "border-pink-500 bg-pink-50/50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Heart className="w-4 h-4 text-pink-600 fill-current" />
                    <span>পোস্ট / রিলস লাইক</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    আপনার পোস্টের লাইক বৃদ্ধি
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setCampaignType("follow")}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col gap-1 ${
                    campaignType === "follow"
                      ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <UserPlus className="w-4 h-4 text-indigo-600" />
                    <span>ফলোয়ার বুস্ট</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    সরাসরি আপনার আইডিতে
                  </span>
                </button>
              </div>
            </div>

            {/* 2. Target URL / Profile Guard */}
            {campaignType === "like" ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  আপনার (@{user.username}) পোস্ট বা রিলসের লিংক
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.instagram.com/p/XXXXX/"
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>পোস্টটি অবশ্যই @{user.username} এর হতে হবে; অন্য কারো লিংক দিলে সিস্টেমে আটকে যাবে।</span>
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  টার্গেট প্রোফাইল (স্বয়ংক্রিয়ভাবে সংরক্ষিত)
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                    https://www.instagram.com/{user.username}/
                  </span>
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  সুরক্ষা নিশ্চিত করতে ফলোয়ার ক্যাম্পেইনে বাইরের কোনো লিংক দেওয়ার অনুমতি নেই।
                </p>
              </div>
            )}

            {/* 3. Reward & Quantity Calculation */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  প্রতি একশনে ক্রেডিট
                </label>
                <select
                  value={reward}
                  onChange={(e) => setReward(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={1}>১ ক্রেডিট (ধীরগতি)</option>
                  <option value={2}>২ ক্রেডিট (স্ট্যান্ডার্ড)</option>
                  <option value={3}>৩ ক্রেডিট (দ্রুত গতি)</option>
                  <option value={5}>৫ ক্রেডিট (সুপার ফাস্ট)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  কতটি চান?
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value || "1", 10)))}
                  className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* 4. Cost Summary */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block">মোট ক্রেডিট খরচ</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {quantity} x {reward} ক্রেডিট
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-indigo-700 dark:text-indigo-300">
                  {totalCost} Credits
                </span>
                <span
                  className={`block text-[10px] font-bold ${
                    canAfford ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {canAfford ? "পর্যাপ্ত ব্যালেন্স আছে" : "পর্যাপ্ত ক্রেডিট নেই"}
                </span>
              </div>
            </div>

            {createMsg && (
              <div
                className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${
                  createMsg.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200"
                    : "bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200"
                }`}
              >
                {createMsg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                )}
                <span className="leading-relaxed">{createMsg.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={actionLoading || !canAfford}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {actionLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>ওনারশিপ যাচাই ও ক্যাম্পেইন তৈরি হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>ক্যাম্পেইন চালু করুন ({totalCost} ক্রেডিট)</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* 4. My Active Campaigns Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              আমার চলমান ক্যাম্পেইনসমূহ ({myCampaigns.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              আপনার যেসব পোস্টে বা প্রোফাইলে অন্যরা লাইক ও ফলো দিচ্ছে
            </p>
          </div>
          <button
            onClick={() => refreshData()}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>আপডেট দেখুন</span>
          </button>
        </div>

        {myCampaigns.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            আপনি এখনও কোনো ক্যাম্পেইন চালু করেননি। ওপরের ফর্মটি পূরণ করে আপনার পোস্ট বা আইডিতে বুস্ট নিন।
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      camp.type === "like"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                    }`}
                  >
                    {camp.type === "like" ? "পোস্ট লাইক" : "ফলোয়ার"}
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    বাকি: <b className="text-slate-900 dark:text-white">{camp.remainingQuantity}</b>
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  <a
                    href={camp.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center gap-1 text-pink-600 dark:text-pink-400"
                  >
                    <span>{camp.targetUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>রিওয়ার্ড: {camp.rewardPerAction} ক্রেডিট/একশন</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>চলমান</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
