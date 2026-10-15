"use client";

import React from "react";
import * as Icons from "lucide-react";

interface DynamicIconProps {
  name: string;
  className?: string;
}

export default function DynamicIcon({ name, className = "w-6 h-6" }: DynamicIconProps) {
  // @ts-expect-error Lucide icons dynamic index
  const IconComponent = Icons[name] || Icons.Wrench;
  return <IconComponent className={className} />;
}
