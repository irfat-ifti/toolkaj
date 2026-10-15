import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showSubtitle?: boolean;
  lang?: "bn" | "en";
  href?: string;
}

export function LogoIcon({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}
    >
      <defs>
        {/* Main Brand Gradient */}
        <linearGradient id="tk-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>

        {/* Accent Glow Gradient */}
        <linearGradient id="tk-grad-accent" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>

        {/* Gloss Overlay */}
        <linearGradient id="tk-grad-gloss" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Drop shadow */}
        <filter id="tk-shadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#4F46E5" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Rounded squircle badge */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="13"
        fill="url(#tk-grad-primary)"
        filter="url(#tk-shadow)"
      />

      {/* Subtle glossy glass curve */}
      <path
        d="M2 15C2 7.82 7.82 2 15 2H33C40.18 2 46 7.82 46 15C46 16.5 40 22 24 22C8 22 2 16.5 2 15Z"
        fill="url(#tk-grad-gloss)"
      />

      {/* Inner Stylized 'T' & 'K' Vector Monogram */}
      {/* Top horizontal crossbar of 'T' with rounded ends */}
      <path
        d="M11 14C11 12.8954 11.8954 12 13 12H35C36.1046 12 37 12.8954 37 14C37 15.1046 36.1046 16 35 16H13C11.8954 16 11 15.1046 11 14Z"
        fill="#FFFFFF"
      />

      {/* Vertical stem of 'T' with subtle chamfer */}
      <path
        d="M21 16H27V34C27 35.1046 26.1046 36 25 36H23C21.8954 36 21 35.1046 21 34V16Z"
        fill="#FFFFFF"
      />

      {/* Dynamic Upper Diagonal of 'K' - Glowing Cyan/Violet */}
      <path
        d="M27 24L35.2 15.8C35.98 15.02 37.24 15.02 38.02 15.8C38.8 16.58 38.8 17.84 38.02 18.62L30.64 26L27 24Z"
        fill="url(#tk-grad-accent)"
      />

      {/* Dynamic Lower Leg of 'K' - Bolt/Arrow Sparkle */}
      <path
        d="M27 24L35.5 33.5C36.28 34.28 36.28 35.54 35.5 36.32C34.72 37.1 33.46 37.1 32.68 36.32L24.8 28.44L27 24Z"
        fill="#FFFFFF"
        opacity="0.95"
      />

      {/* Precision Sparkle / Laser Center Dot */}
      <circle cx="24" cy="24" r="2.2" fill="#FFFFFF" />
      <circle cx="37" cy="11" r="1.5" fill="#38BDF8" />
    </svg>
  );
}

export default function Logo({
  className = "",
  size = "md",
  showText = true,
  showSubtitle = true,
  lang = "bn",
  href = "/",
}: LogoProps) {
  const iconSizes = {
    sm: 28,
    md: 38,
    lg: 48,
    xl: 60,
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
    xl: "text-3xl sm:text-4xl",
  };

  const currentIconSize = iconSizes[size];

  const content = (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      <LogoIcon size={currentIconSize} />

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black tracking-tight text-slate-900 dark:text-white ${textSizes[size]}`}
            >
              Tool
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                Kaj
              </span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50 ml-0.5">
              {lang === "bn" ? "ফ্রি" : "FREE"}
            </span>
          </div>

          {showSubtitle && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-normal mt-0.5 hidden sm:block">
              {lang === "bn" ? "অল-ইন-ওয়ান অনলাইন টুলস" : "All-in-One Online Tools"}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
}
