"use client";

import React from "react";
import * as Icons from "lucide-react";

interface DynamicIconProps {
  name: string;
  className?: string;
}

export default function DynamicIcon({ name, className = "w-6 h-6" }: DynamicIconProps) {
  if (name === "Instagram") {
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

  // @ts-expect-error Lucide icons dynamic index
  const IconComponent = Icons[name] || Icons.Wrench;
  return <IconComponent className={className} />;
}
