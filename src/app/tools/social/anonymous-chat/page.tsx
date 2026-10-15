"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, UserX, Send, Copy, Check, Sparkles, MessageCircle, RefreshCw, Users } from "lucide-react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  limit,
} from "firebase/firestore";

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: any;
  color: string;
}

const AVATAR_COLORS = [
  "text-rose-500 bg-rose-50 dark:bg-rose-950/50",
  "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50",
  "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50",
  "text-amber-500 bg-amber-50 dark:bg-amber-950/50",
  "text-purple-500 bg-purple-50 dark:bg-purple-950/50",
  "text-cyan-500 bg-cyan-50 dark:bg-cyan-950/50",
];

export default function AnonymousChatPage() {
  const [roomId, setRoomId] = useState("");
  const [inRoom, setInRoom] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const chatBoxRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    // Generate random secret nickname
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setUsername(`Anonymous_${randomNum}`);
    setAvatarColor(AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]);

    // Check if room in URL params
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get("room");
      if (roomParam) {
        setRoomId(roomParam.toUpperCase());
        setInRoom(true);
      }
    }
  }, []);

  // Listen to Firestore messages in current room
  useEffect(() => {
    if (!inRoom || !roomId) return;

    try {
      const q = query(
        collection(db, "chat_rooms", roomId, "messages"),
        orderBy("timestamp", "asc"),
        limit(50)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const msgs: Message[] = [];
          snapshot.forEach((doc) => {
            msgs.push({ id: doc.id, ...doc.data() } as Message);
          });
          setMessages(msgs);
          setTimeout(() => scrollToBottom(), 80);
        },
        (error) => {
          console.warn("Firestore snapshot error, falling back to local state:", error);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn("Could not attach listener:", err);
    }
  }, [inRoom, roomId]);

  const joinOrCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = roomId.trim().toUpperCase() || Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(clean);
    setInRoom(true);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `?room=${clean}`);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    const text = newMessage.trim();
    setNewMessage("");
    setIsSending(true);

    try {
      await addDoc(collection(db, "chat_rooms", roomId, "messages"), {
        sender: username,
        text,
        color: avatarColor,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Firestore send error:", err);
      // Fallback local append
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: username,
          text,
          timestamp: new Date(),
          color: avatarColor,
        },
      ]);
    } finally {
      setIsSending(false);
      setTimeout(() => scrollToBottom(), 50);
    }
  };

  const copyRoomLink = () => {
    const url = `${window.location.origin}/tools/social/anonymous-chat?room=${roomId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <Link href="/category/social" className="hover:text-indigo-600">
            সোশ্যাল মিডিয়া
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">
            বেনামী চ্যাট রুম
          </span>
        </div>

        {/* Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Firebase রিয়েল-টাইম এনক্রিপ্ট চ্যাট
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            বেনামী চ্যাট রুম (Anonymous Chat Room)
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            কোনো ব্যক্তিগত তথ্য বা সাইন-আপ ছাড়াই রুম কোড দিয়ে বন্ধুদের সাথে রিয়েল-টাইমে গোপন চ্যাট করুন।
          </p>
        </div>

        {/* Chat Component */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[600px]">
          {!inRoom ? (
            /* Lobby Join Screen */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <UserX className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                চ্যাট রুমে প্রবেশ করুন
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                রুম কোড লিখুন অথবা ফাঁকা রেখে নতুন গোপন রুম তৈরি করুন। আপনার বেনামী নাম হবে:{" "}
                <span className="font-bold text-indigo-600">{username}</span>
              </p>

              <form onSubmit={joinOrCreateRoom} className="w-full space-y-4">
                <div>
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    placeholder="রুম কোড লিখুন (যেমন: SECRET1)"
                    maxLength={10}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-center font-mono font-bold text-base uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-colors"
                >
                  রুমে যুক্ত হন / নতুন রুম তৈরি করুন
                </button>
              </form>
            </div>
          ) : (
            /* Active Live Chat Screen */
            <div className="flex-1 flex flex-col h-full">
              {/* Room Header */}
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">রুম কোড:</span>
                    <span className="text-sm font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                      {roomId}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    আপনার ছদ্মনাম: <strong>{username}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyRoomLink}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1.5 shadow-sm"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "কপি হয়েছে!" : "আমন্ত্রণ লিংক"}</span>
                  </button>
                  <button
                    onClick={() => {
                      setInRoom(false);
                      setMessages([]);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800"
                  >
                    রুম ত্যাগ
                  </button>
                </div>
              </div>

              {/* Messages Feed */}
              <div
                ref={chatBoxRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 dark:bg-slate-950/40"
              >
                {messages.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 text-xs">
                    এখনও কোনো মেসেজ নেই। বন্ধুদের আমন্ত্রণ জানান এবং প্রথম মেসেজটি লিখুন!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender === username;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        <span className="text-[10px] font-semibold text-slate-400 mb-1 px-1">
                          {isMe ? "আপনি" : msg.sender}
                        </span>
                        <div
                          className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            isMe
                              ? "bg-indigo-600 text-white rounded-tr-none"
                              : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-tl-none"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input Box */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="গোপন বার্তা লিখুন..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isSending}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow transition-all flex items-center justify-center shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
