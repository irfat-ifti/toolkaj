"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Copy,
  Check,
  Pipette,
  Palette,
  Sparkles,
  X,
  Sliders,
  Download,
  Eye,
  CheckCircle2,
  ZoomIn,
  History,
  SlidersHorizontal,
  Code,
  FileJson,
  Trash2,
  ImagePlus,
  Layers,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export interface ColorInfo {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  isLight: boolean;
  name?: string;
}

// Convert RGB to HEX
function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Convert HEX to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  }
  return null;
}

// Convert RGB to HSL
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

// Determine if a color is light
function isLightColor(r: number, g: number, b: number): boolean {
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 148;
}

// Calculate relative luminance for WCAG contrast
function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// WCAG contrast scores
function getContrastScores(r: number, g: number, b: number) {
  const lum = getLuminance(r, g, b);
  const ratioWhite = (1 + 0.05) / (lum + 0.05);
  const ratioBlack = (lum + 0.05) / (0 + 0.05);
  return {
    onWhite: Number(ratioWhite.toFixed(1)),
    onBlack: Number(ratioBlack.toFixed(1)),
  };
}

// Helper to construct ColorInfo without imprecise poetic names
function makeColorInfo(r: number, g: number, b: number): ColorInfo {
  const hex = rgbToHex(r, g, b);
  const hsl = rgbToHsl(r, g, b);
  const isLight = isLightColor(r, g, b);
  return { hex, rgb: { r, g, b }, hsl, isLight };
}

// Extract 9 dominant colors from canvas
function extractDominantColorsFromCanvas(canvas: HTMLCanvasElement, count = 9): ColorInfo[] {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx || canvas.width === 0 || canvas.height === 0) return [];

  const sampleW = 100;
  const sampleH = 100;
  const sampleCanvas = document.createElement("canvas");
  sampleCanvas.width = sampleW;
  sampleCanvas.height = sampleH;
  const sCtx = sampleCanvas.getContext("2d");
  if (!sCtx) return [];

  sCtx.drawImage(canvas, 0, 0, sampleW, sampleH);
  const imgData = sCtx.getImageData(0, 0, sampleW, sampleH).data;

  const buckets: { [key: string]: { rSum: number; gSum: number; bSum: number; count: number } } = {};

  for (let i = 0; i < imgData.length; i += 16) {
    const a = imgData[i + 3];
    if (a < 128) continue;

    const r = imgData[i];
    const g = imgData[i + 1];
    const b = imgData[i + 2];

    const qr = Math.floor(r / 16) * 16;
    const qg = Math.floor(g / 16) * 16;
    const qb = Math.floor(b / 16) * 16;
    const key = `${qr}_${qg}_${qb}`;

    if (!buckets[key]) {
      buckets[key] = { rSum: 0, gSum: 0, bSum: 0, count: 0 };
    }
    buckets[key].rSum += r;
    buckets[key].gSum += g;
    buckets[key].bSum += b;
    buckets[key].count++;
  }

  const sorted = Object.values(buckets).sort((a, b) => b.count - a.count);
  const distinct: ColorInfo[] = [];

  for (const bucket of sorted) {
    const r = Math.round(bucket.rSum / bucket.count);
    const g = Math.round(bucket.gSum / bucket.count);
    const b = Math.round(bucket.bSum / bucket.count);

    const isTooClose = distinct.some((existing) => {
      const dr = existing.rgb.r - r;
      const dg = existing.rgb.g - g;
      const db = existing.rgb.b - b;
      const dist = Math.sqrt(dr * dr + dg * dg + db * db);
      return dist < 36;
    });

    if (!isTooClose) {
      distinct.push(makeColorInfo(r, g, b));
      if (distinct.length >= count) break;
    }
  }

  if (distinct.length < count) {
    for (const bucket of sorted) {
      const r = Math.round(bucket.rSum / bucket.count);
      const g = Math.round(bucket.gSum / bucket.count);
      const b = Math.round(bucket.bSum / bucket.count);
      const hex = rgbToHex(r, g, b);
      if (!distinct.some((d) => d.hex === hex)) {
        distinct.push(makeColorInfo(r, g, b));
        if (distinct.length >= count) break;
      }
    }
  }

  return distinct.slice(0, count);
}

// Preset collections
const PRESET_COLLECTIONS = {
  trending: [
    { name: "Sunset Coral", hex: "#FF6B6B" },
    { name: "Golden Glow", hex: "#FFA94D" },
    { name: "Emerald Mint", hex: "#20C997" },
    { name: "Azure Sky", hex: "#339AF0" },
    { name: "Neon Violet", hex: "#845EF7" },
    { name: "Rose Quartz", hex: "#F783AC" },
    { name: "Dark Velvet", hex: "#2B2D42" },
    { name: "Warm Copper", hex: "#D97706" },
  ],
  tailwind: [
    { name: "Rose 500", hex: "#F43F5E" },
    { name: "Amber 500", hex: "#F59E0B" },
    { name: "Emerald 500", hex: "#10B981" },
    { name: "Cyan 500", hex: "#06B6D4" },
    { name: "Indigo 600", hex: "#4F46E5" },
    { name: "Violet 500", hex: "#8B5CF6" },
    { name: "Slate 800", hex: "#1E293B" },
    { name: "Fuchsia 500", hex: "#D946EF" },
  ],
  pastel: [
    { name: "Soft Peach", hex: "#FFD1BA" },
    { name: "Butter Cream", hex: "#FFF3B0" },
    { name: "Mint Foam", hex: "#C7F9CC" },
    { name: "Sky Mist", hex: "#BAE6FD" },
    { name: "Lavender Fog", hex: "#E9D5FF" },
    { name: "Blush Pink", hex: "#FBCFE8" },
    { name: "Sage Gray", hex: "#D1D5DB" },
    { name: "Warm Sand", hex: "#E5D0BA" },
  ],
  neonDark: [
    { name: "Cyberpunk Pink", hex: "#FF007F" },
    { name: "Laser Lime", hex: "#39FF14" },
    { name: "Electric Cyan", hex: "#00F0FF" },
    { name: "Solar Flare", hex: "#FF5E00" },
    { name: "Neon Purple", hex: "#9D00FF" },
    { name: "Matrix Green", hex: "#00FF66" },
    { name: "Deep Abyssal", hex: "#0B0F19" },
    { name: "Midnight Navy", hex: "#0F172A" },
  ],
};

const SAMPLE_DEMO_URL = "/sample-color-picker.jpg";

export default function ColorPickerPage() {
  const { lang } = useApp();

  // Mode: "image" (ছবি থেকে) or "custom" (কাস্টম রঙ)
  const [activeTab, setActiveTab] = useState<"image" | "custom">("image");

  // Show/Hide Quick Guide Banner
  const [showGuideBanner, setShowGuideBanner] = useState(true);

  // By default, NO default image loaded! User sees image upload selection field.
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Active Selected Color
  const [selectedColor, setSelectedColor] = useState<ColorInfo>(() => makeColorInfo(244, 63, 94));
  // Previous color for comparison
  const [prevColor, setPrevColor] = useState<ColorInfo>(() => makeColorInfo(79, 70, 229));

  // Dominant Colors from Image (empty until image uploaded)
  const [dominantColors, setDominantColors] = useState<ColorInfo[]>([]);

  // History of picked colors
  const [colorHistory, setColorHistory] = useState<ColorInfo[]>([
    makeColorInfo(244, 63, 94),
    makeColorInfo(79, 70, 229),
    makeColorInfo(16, 185, 129),
    makeColorInfo(245, 158, 11),
  ]);

  // Click indicator ripple
  const [clickPoint, setClickPoint] = useState<{ x: number; y: number } | null>(null);

  // Toast notification
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Magnifier / Loupe state
  const [loupeVisible, setLoupeVisible] = useState(false);
  const [loupePos, setLoupePos] = useState({ x: 0, y: 0 });
  const [hoverColor, setHoverColor] = useState<ColorInfo | null>(null);

  // Custom Color inputs state
  const [customHex, setCustomHex] = useState(selectedColor.hex);
  const [customRgb, setCustomRgb] = useState(selectedColor.rgb);
  const [customHsl, setCustomHsl] = useState(selectedColor.hsl);
  const [presetTab, setPresetTab] = useState<keyof typeof PRESET_COLLECTIONS>("trending");

  // Client-only capability flags (Prevents any React Hydration Mismatch)
  const [hasMounted, setHasMounted] = useState(false);
  const [supportsEyeDropper, setSupportsEyeDropper] = useState(false);

  // DOM Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const loupeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgElementRef = useRef<HTMLImageElement | null>(null);

  // Check client mounting
  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== "undefined" && "EyeDropper" in window) {
      setSupportsEyeDropper(true);
    }
  }, []);

  // Copy helper
  const handleCopy = (text: string, key: string, labelBn = "কপি করা হয়েছে!") => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setToastMessage(lang === "bn" ? `${text} ${labelBn}` : `Copied ${text}!`);
      setTimeout(() => {
        setCopiedKey(null);
        setToastMessage(null);
      }, 2000);
    }
  };

  // Add to history
  const addToHistory = useCallback((color: ColorInfo) => {
    setColorHistory((prev) => {
      const filtered = prev.filter((c) => c.hex !== color.hex);
      return [color, ...filtered].slice(0, 14);
    });
  }, []);

  // Select color and synchronize custom inputs and history
  const selectColor = useCallback(
    (color: ColorInfo) => {
      setSelectedColor((current) => {
        setPrevColor(current);
        return color;
      });
      setCustomHex(color.hex);
      setCustomRgb(color.rgb);
      setCustomHsl(color.hsl);
      addToHistory(color);
    },
    [addToHistory]
  );

  // Process image on change - ONLY when imageSrc changes!
  useEffect(() => {
    if (!imageSrc) {
      hiddenCanvasRef.current = null;
      setDominantColors([]);
      return;
    }

    let isCancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (isCancelled) return;
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        hiddenCanvasRef.current = canvas;
        const dominant = extractDominantColorsFromCanvas(canvas, 9);
        if (dominant.length > 0) {
          setDominantColors(dominant);
          // Set initial color ONLY once when a new image is loaded
          const initialColor = dominant[0];
          setSelectedColor(initialColor);
          setPrevColor(initialColor);
          setCustomHex(initialColor.hex);
          setCustomRgb(initialColor.rgb);
          setCustomHsl(initialColor.hsl);
          setColorHistory((prev) => {
            const filtered = prev.filter((c) => c.hex !== initialColor.hex);
            return [initialColor, ...filtered].slice(0, 14);
          });
        }
      }
    };
    img.src = imageSrc;

    return () => {
      isCancelled = true;
    };
  }, [imageSrc]); // Explicitly depend ONLY on imageSrc to prevent resetting user-picked colors!

  // Support pasting image from clipboard (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                setImageSrc(event.target.result as string);
                setToastMessage(lang === "bn" ? "ক্লিপবোর্ড থেকে ছবি পেস্ট করা হয়েছে!" : "Image pasted from clipboard!");
                setTimeout(() => setToastMessage(null), 2000);
              }
            };
            reader.readAsDataURL(file);
            break;
          }
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [lang]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert(lang === "bn" ? "অনুগ্রহ করে একটি ছবি ফাইল আপলোড করুন" : "Please select an image file");
      return;
    }

    const url = URL.createObjectURL(file);
    setImageSrc(url);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
    }
  };

  // Calculate pixel coordinates accurately relative to displayed image
  const getPixelCoord = (clientX: number, clientY: number) => {
    const img = imgElementRef.current;
    const canvas = hiddenCanvasRef.current;
    if (!img || !canvas) return null;

    const rect = img.getBoundingClientRect();
    const displayX = clientX - rect.left;
    const displayY = clientY - rect.top;

    if (displayX < 0 || displayX > rect.width || displayY < 0 || displayY > rect.height) {
      return null;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const pixelX = Math.floor(displayX * scaleX);
    const pixelY = Math.floor(displayY * scaleY);

    return {
      pixelX: Math.max(0, Math.min(canvas.width - 1, pixelX)),
      pixelY: Math.max(0, Math.min(canvas.height - 1, pixelY)),
      displayX,
      displayY,
    };
  };

  // Sample pixel color
  const sampleColorAt = (pixelX: number, pixelY: number): ColorInfo | null => {
    const canvas = hiddenCanvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    try {
      const p = ctx.getImageData(pixelX, pixelY, 1, 1).data;
      return makeColorInfo(p[0], p[1], p[2]);
    } catch {
      return null;
    }
  };

  // Update loupe canvas with pixel-perfect center alignment and edge boundary handling
  const updateLoupe = (pixelX: number, pixelY: number) => {
    const canvas = hiddenCanvasRef.current;
    const loupeCanvas = loupeCanvasRef.current;
    if (!canvas || !loupeCanvas) return;

    const lCtx = loupeCanvas.getContext("2d");
    if (!lCtx) return;

    lCtx.imageSmoothingEnabled = false;
    lCtx.clearRect(0, 0, loupeCanvas.width, loupeCanvas.height);

    const sampleRadius = 4; // 9x9 pixels
    const sampleSize = sampleRadius * 2 + 1;
    const cellSize = loupeCanvas.width / sampleSize;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const startX = pixelX - sampleRadius;
    const startY = pixelY - sampleRadius;

    const readX = Math.max(0, Math.min(canvas.width - 1, startX));
    const readY = Math.max(0, Math.min(canvas.height - 1, startY));
    const readW = Math.max(1, Math.min(canvas.width - readX, sampleSize));
    const readH = Math.max(1, Math.min(canvas.height - readY, sampleSize));

    try {
      const imgData = ctx.getImageData(readX, readY, readW, readH);
      const data = imgData.data;

      for (let dy = 0; dy < sampleSize; dy++) {
        for (let dx = 0; dx < sampleSize; dx++) {
          const currentX = startX + dx;
          const currentY = startY + dy;
          const startDestX = Math.round(dx * cellSize);
          const endDestX = Math.round((dx + 1) * cellSize);
          const startDestY = Math.round(dy * cellSize);
          const endDestY = Math.round((dy + 1) * cellSize);
          const cellW = endDestX - startDestX;
          const cellH = endDestY - startDestY;

          if (currentX < 0 || currentX >= canvas.width || currentY < 0 || currentY >= canvas.height) {
            // Subtle checkerboard for pixels outside image canvas
            const isEven = (dx + dy) % 2 === 0;
            lCtx.fillStyle = isEven ? "#cbd5e1" : "#94a3b8";
            lCtx.fillRect(startDestX, startDestY, cellW, cellH);
          } else {
            const relX = currentX - readX;
            const relY = currentY - readY;
            const idx = (relY * readW + relX) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3] / 255;
            lCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
            lCtx.fillRect(startDestX, startDestY, cellW, cellH);
          }
        }
      }
    } catch {
      // Fallback
    }

    // Grid lines for retro pixel magnification look
    lCtx.strokeStyle = "rgba(0, 0, 0, 0.08)";
    lCtx.lineWidth = 0.5;
    for (let i = 1; i < sampleSize; i++) {
      const gridX = Math.round(i * cellSize);
      const gridY = Math.round(i * cellSize);
      lCtx.beginPath();
      lCtx.moveTo(gridX, 0);
      lCtx.lineTo(gridX, loupeCanvas.height);
      lCtx.stroke();

      lCtx.beginPath();
      lCtx.moveTo(0, gridY);
      lCtx.lineTo(loupeCanvas.width, gridY);
      lCtx.stroke();
    }

    // Center targeting cell (ALWAYS exactly at sampleRadius)
    const startCenterX = Math.round(sampleRadius * cellSize);
    const endCenterX = Math.round((sampleRadius + 1) * cellSize);
    const startCenterY = Math.round(sampleRadius * cellSize);
    const endCenterY = Math.round((sampleRadius + 1) * cellSize);
    const centerW = endCenterX - startCenterX;
    const centerH = endCenterY - startCenterY;

    // High-visibility dual crosshair rect
    lCtx.strokeStyle = "#ffffff";
    lCtx.lineWidth = 2;
    lCtx.strokeRect(startCenterX + 0.5, startCenterY + 0.5, centerW - 1, centerH - 1);

    lCtx.strokeStyle = "rgba(0, 0, 0, 0.9)";
    lCtx.lineWidth = 1;
    lCtx.strokeRect(startCenterX - 0.5, startCenterY - 0.5, centerW + 1, centerH + 1);
  };

  // Mouse move over image with 100% edge-safe clamped loupe position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const coord = getPixelCoord(e.clientX, e.clientY);
    const container = imageContainerRef.current;
    if (!coord || !container) {
      setLoupeVisible(false);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const rawX = e.clientX - containerRect.left;
    const rawY = e.clientY - containerRect.top;

    // Loupe is 112px wide, badge is ~170px. Half width = 85px + 15px padding = 100px.
    const LOUPE_HALF_WIDTH = 92;
    const LOUPE_HEIGHT = 150;

    const minX = Math.min(containerRect.width / 2, LOUPE_HALF_WIDTH + 14);
    const maxX = Math.max(minX, containerRect.width - (LOUPE_HALF_WIDTH + 14));
    const clampedX = Math.max(minX, Math.min(maxX, rawX));

    // Vertical placement: when cursor is near top (< 185px), flip loupe below cursor
    const placeBelow = rawY < 185;
    const targetY = placeBelow ? rawY + 24 : rawY - LOUPE_HEIGHT - 18;

    const minY = 12;
    const maxY = Math.max(minY, containerRect.height - LOUPE_HEIGHT - 12);
    const clampedY = Math.max(minY, Math.min(maxY, targetY));

    const color = sampleColorAt(coord.pixelX, coord.pixelY);
    if (color) {
      setHoverColor(color);
      setLoupeVisible(true);
      setLoupePos({ x: clampedX, y: clampedY });
      updateLoupe(coord.pixelX, coord.pixelY);
    }
  };

  // Mouse leave
  const handleMouseLeave = () => {
    setLoupeVisible(false);
    setHoverColor(null);
  };

  // Click on image
  const handleImageClick = (e: React.MouseEvent<HTMLElement>) => {
    const coord = getPixelCoord(e.clientX, e.clientY);
    const container = imageContainerRef.current;
    if (!coord || !container) return;

    const containerRect = container.getBoundingClientRect();
    const clickX = e.clientX - containerRect.left;
    const clickY = e.clientY - containerRect.top;

    const color = sampleColorAt(coord.pixelX, coord.pixelY);
    if (color) {
      selectColor(color);
      setClickPoint({ x: clickX, y: clickY });
      setTimeout(() => setClickPoint(null), 800);
      handleCopy(color.hex, "hex-click", "কালার পিক ও কোড কপি করা হয়েছে!");
    }
  };

  // Touch on image (for mobile/tablet touchscreens) with edge-safe clamped position
  const handleTouch = (e: React.TouchEvent<HTMLElement>) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    const coord = getPixelCoord(touch.clientX, touch.clientY);
    const container = imageContainerRef.current;
    if (!coord || !container) return;

    const containerRect = container.getBoundingClientRect();
    const rawX = touch.clientX - containerRect.left;
    const rawY = touch.clientY - containerRect.top;

    const LOUPE_HALF_WIDTH = 92;
    const LOUPE_HEIGHT = 150;

    const minX = Math.min(containerRect.width / 2, LOUPE_HALF_WIDTH + 14);
    const maxX = Math.max(minX, containerRect.width - (LOUPE_HALF_WIDTH + 14));
    const clampedX = Math.max(minX, Math.min(maxX, rawX));

    const placeBelow = rawY < 185;
    const targetY = placeBelow ? rawY + 24 : rawY - LOUPE_HEIGHT - 18;

    const minY = 12;
    const maxY = Math.max(minY, containerRect.height - LOUPE_HEIGHT - 12);
    const clampedY = Math.max(minY, Math.min(maxY, targetY));

    const color = sampleColorAt(coord.pixelX, coord.pixelY);
    if (color) {
      selectColor(color);
      setHoverColor(color);
      setLoupeVisible(true);
      setLoupePos({ x: clampedX, y: clampedY });
      updateLoupe(coord.pixelX, coord.pixelY);
      setClickPoint({ x: rawX, y: rawY });
      setTimeout(() => setClickPoint(null), 800);
      handleCopy(color.hex, "hex-click", "কালার পিক ও কোড কপি করা হয়েছে!");
    }
  };

  // EyeDropper API
  const handleEyeDropper = async () => {
    if (typeof window !== "undefined" && "EyeDropper" in window) {
      try {
        // @ts-expect-error EyeDropper is a modern Web API
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          const rgb = hexToRgb(result.sRGBHex);
          if (rgb) {
            const color = makeColorInfo(rgb.r, rgb.g, rgb.b);
            selectColor(color);
            handleCopy(color.hex, "eyedropper", "স্ক্রিন থেকে পিক ও কপি হয়েছে!");
          }
        }
      } catch (err) {
        console.warn("EyeDropper dismissed or failed", err);
      }
    }
  };

  // Custom Color Handlers
  const handleCustomHexChange = (val: string) => {
    setCustomHex(val);
    const rgb = hexToRgb(val);
    if (rgb) {
      const color = makeColorInfo(rgb.r, rgb.g, rgb.b);
      setSelectedColor((current) => {
        setPrevColor(current);
        return color;
      });
      setCustomRgb(rgb);
      setCustomHsl(color.hsl);
      addToHistory(color);
    }
  };

  const handleCustomRgbChange = (channel: "r" | "g" | "b", val: number) => {
    const updated = { ...customRgb, [channel]: Math.max(0, Math.min(255, val)) };
    setCustomRgb(updated);
    const color = makeColorInfo(updated.r, updated.g, updated.b);
    setSelectedColor((current) => {
      setPrevColor(current);
      return color;
    });
    setCustomHex(color.hex);
    setCustomHsl(color.hsl);
  };

  const handleCustomHslChange = (channel: "h" | "s" | "l", val: number) => {
    const maxVal = channel === "h" ? 360 : 100;
    const updated = { ...customHsl, [channel]: Math.max(0, Math.min(maxVal, val)) };
    setCustomHsl(updated);
    const rgb = hslToRgb(updated.h, updated.s, updated.l);
    setCustomRgb(rgb);
    const color = makeColorInfo(rgb.r, rgb.g, rgb.b);
    setSelectedColor((current) => {
      setPrevColor(current);
      return color;
    });
    setCustomHex(color.hex);
  };

  // Download Palette as Image
  const handleDownloadPaletteImage = () => {
    if (dominantColors.length === 0) return;
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 320;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("ToolKaj Color Studio Palette", 30, 45);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px sans-serif";
    ctx.fillText("Harmonized 9 Dominant Color Palette Export", 30, 70);

    const swatchW = 90;
    const swatchH = 150;
    const startX = 30;
    const startY = 95;

    dominantColors.slice(0, 9).forEach((c, i) => {
      const x = startX + i * 94;
      ctx.fillStyle = c.hex;
      ctx.beginPath();
      ctx.roundRect(x, startY, swatchW, swatchH, 10);
      ctx.fill();

      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "center";
      ctx.fillText(c.hex, x + swatchW / 2, startY + swatchH + 25);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.fillText(`${c.rgb.r},${c.rgb.g},${c.rgb.b}`, x + swatchW / 2, startY + swatchH + 42);
    });

    const link = document.createElement("a");
    link.download = "toolkaj-palette.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    handleCopy("toolkaj-palette.png", "dl-img", "প্যালেট ইমেজ ডাউনলোড হয়েছে!");
  };

  // Copy CSS Variables
  const handleCopyCssVariables = () => {
    const list = dominantColors.length > 0 ? dominantColors : [selectedColor];
    const cssVars = [
      `/* ToolKaj Palette Variables */`,
      `:root {`,
      `  --color-primary: ${selectedColor.hex};`,
      ...list.map((c, i) => `  --color-accent-${i + 1}: ${c.hex};`),
      `}`,
    ].join("\n");
    handleCopy(cssVars, "css-vars", "CSS ভ্যারিয়েবল কোড কপি হয়েছে!");
  };

  // Copy JSON Palette
  const handleCopyJsonPalette = () => {
    const jsonStr = JSON.stringify(
      {
        selectedColor,
        dominantColors: dominantColors.map((c) => ({
          hex: c.hex,
          rgb: `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`,
          hsl: `hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%)`,
        })),
      },
      null,
      2
    );
    handleCopy(jsonStr, "json-palette", "JSON প্যালেট কপি হয়েছে!");
  };

  const contrast = getContrastScores(selectedColor.rgb.r, selectedColor.rgb.g, selectedColor.rgb.b);

  return (
    <div className="w-full py-8 sm:py-12 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> {lang === "bn" ? "হোম" : "Home"}
          </Link>
          <span>/</span>
          <Link href="/category/image" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            {lang === "bn" ? "ইমেজ টুলস" : "Image Tools"}
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-200 font-semibold">
            {lang === "bn" ? "কালার পিকার ও প্যালেট স্টুডিও" : "Color Picker & Palette Studio"}
          </span>
        </div>

        {/* Top Header & Mode Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === "bn" ? "আল্ট্রা-এইচডি পিক্সেল জুম ও প্যালেট এক্সট্র্যাক্টর" : "Ultra-HD Pixel Loupe & Smart Palette"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <span>{lang === "bn" ? "কালার পিকার ও প্যালেট স্টুডিও" : "Color Picker & Palette Studio"}</span>
            </h1>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="inline-flex items-center p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm self-start lg:self-auto">
            <button
              onClick={() => setActiveTab("image")}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === "image"
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Pipette className="w-4 h-4" />
              <span>{lang === "bn" ? "ছবি থেকে পিক করুন" : "From Image"}</span>
            </button>
            <button
              onClick={() => setActiveTab("custom")}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === "custom"
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{lang === "bn" ? "কাস্টম রঙ ও স্লাইডার" : "Custom Color Studio"}</span>
            </button>
          </div>
        </div>

        {/* Quick Guide Strip */}
        {showGuideBanner && (
          <div className="bg-gradient-to-r from-rose-50/80 via-amber-50/50 to-indigo-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 mb-8 relative transition-all shadow-sm">
            <button
              onClick={() => setShowGuideBanner(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
              title={lang === "bn" ? "বন্ধ করুন" : "Dismiss"}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 font-bold text-sm">
                  🎯
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    {lang === "bn" ? "পিক্সেল-লেভেল নিখুঁত নির্বাচন" : "Pixel-Level Precision"}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {lang === "bn"
                      ? "ছবি আপলোড করার পর কার্সর নিলেই ৯x৯ রেট্রো পিক্সেল জুম লেন্স সক্রিয় হয়। প্রতিটি বিন্দুর সঠিক কোড কপি করুন।"
                      : "Inspect individual pixels through an interactive 9x9 retro pixel magnifying lens."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold text-sm">
                  🪄
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    {lang === "bn" ? "অটো ৯টি হারমোনিক প্যালেট" : "Automated 9 Harmonized Colors"}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {lang === "bn"
                      ? "ছবি আপলোড হতেই স্বয়ংক্রিয়ভাবে ছবির শীর্ষ ৯টি ভারসাম্যপূর্ণ ও প্রধান কালার প্যালেট তৈরি করে।"
                      : "Instant color quantization extracts the top 9 most distinct dominant colors."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold text-sm">
                  📋
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    {lang === "bn" ? "প্রো এক্সপোর্ট ও অ্যাক্সেসিবিলিটি" : "Pro Export & WCAG Contrast"}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {lang === "bn"
                      ? "HEX, RGB, HSL ও CSS ভ্যারিয়েবল সহ এক ক্লিকে সম্পূর্ণ প্যালেট ইমেজ ডাউনলোড করুন।"
                      : "Export HEX, RGB, HSL, CSS vars, or download full palette PNG."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-fade-in border border-slate-700/50 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Workspace (2-Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column (Selected Color Showcase & Dominant Palette) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* 1. Main Selected Color Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3.5 h-3.5 rounded-full ring-2 ring-white/60 dark:ring-slate-900 shadow-sm"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    {lang === "bn" ? "নির্বাচিত রঙ (Active Color)" : "Active Selected Color"}
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <span>{selectedColor.hex}</span>
                </div>
              </div>

              {/* Duo Swatch: Current vs Previous Color comparison */}
              <div className="flex items-center gap-4 mb-5">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl shadow-md border border-black/10 shrink-0 overflow-hidden flex flex-col">
                  {/* Top half: current color */}
                  <div
                    className="flex-1 flex items-center justify-center transition-colors relative"
                    style={{ backgroundColor: selectedColor.hex }}
                  >
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-md"
                      style={{
                        backgroundColor: selectedColor.isLight ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.2)",
                        color: selectedColor.isLight ? "#0f172a" : "#ffffff",
                      }}
                    >
                      {lang === "bn" ? "বর্তমান" : "Current"}
                    </span>
                  </div>
                  {/* Bottom half: previous color comparison */}
                  <div
                    className="h-8 flex items-center justify-center transition-colors border-t border-black/10 cursor-pointer"
                    style={{ backgroundColor: prevColor.hex }}
                    onClick={() => selectColor(prevColor)}
                    title={lang === "bn" ? "পূর্ববর্তী রঙে ফিরুন" : "Revert to previous color"}
                  >
                    <span
                      className="text-[9px] font-mono font-semibold opacity-75"
                      style={{ color: prevColor.isLight ? "#0f172a" : "#ffffff" }}
                    >
                      {prevColor.hex}
                    </span>
                  </div>
                </div>

                {/* Color Details & Accessibility Badge */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xl sm:text-2xl font-mono font-extrabold text-slate-900 dark:text-white tracking-wider">
                        {selectedColor.hex}
                      </span>
                      <button
                        onClick={() => handleCopy(selectedColor.hex, "main-hex")}
                        className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        title={lang === "bn" ? "HEX কোড কপি করুন" : "Copy HEX"}
                      >
                        {copiedKey === "main-hex" ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                      rgb({selectedColor.rgb.r}, {selectedColor.rgb.g}, {selectedColor.rgb.b}) • hsl({selectedColor.hsl.h}°, {selectedColor.hsl.s}%, {selectedColor.hsl.l}%)
                    </p>
                  </div>

                  {/* Contrast Accessibility Pill */}
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/50">
                      WCAG {contrast.onWhite >= 4.5 || contrast.onBlack >= 4.5 ? "AA Pass" : "Normal"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Dark {contrast.onBlack}:1 / Light {contrast.onWhite}:1
                    </span>
                  </div>
                </div>
              </div>

              {/* Color Code Rows with Copy Buttons */}
              <div className="space-y-2 text-xs sm:text-sm font-mono bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800">
                {/* HEX */}
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="font-bold text-slate-400 uppercase w-12 text-xs">HEX</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{selectedColor.hex}</span>
                  <button
                    onClick={() => handleCopy(selectedColor.hex, "hex")}
                    className="p-1.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                    title={lang === "bn" ? "HEX কোড কপি করুন" : "Copy HEX"}
                  >
                    {copiedKey === "hex" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* RGB */}
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="font-bold text-slate-400 uppercase w-12 text-xs">RGB</span>
                  <span className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm truncate">
                    rgb({selectedColor.rgb.r}, {selectedColor.rgb.g}, {selectedColor.rgb.b})
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(`rgb(${selectedColor.rgb.r}, ${selectedColor.rgb.g}, ${selectedColor.rgb.b})`, "rgb")
                    }
                    className="p-1.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                    title={lang === "bn" ? "RGB কোড কপি করুন" : "Copy RGB"}
                  >
                    {copiedKey === "rgb" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* HSL */}
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="font-bold text-slate-400 uppercase w-12 text-xs">HSL</span>
                  <span className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm truncate">
                    hsl({selectedColor.hsl.h}, {selectedColor.hsl.s}%, {selectedColor.hsl.l}%)
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(`hsl(${selectedColor.hsl.h}, ${selectedColor.hsl.s}%, ${selectedColor.hsl.l}%)`, "hsl")
                    }
                    className="p-1.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                    title={lang === "bn" ? "HSL কোড কপি করুন" : "Copy HSL"}
                  >
                    {copiedKey === "hsl" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* CSS Variable */}
                <div className="flex items-center justify-between py-1">
                  <span className="font-bold text-slate-400 uppercase w-12 text-xs">CSS</span>
                  <span className="text-slate-700 dark:text-slate-300 text-xs truncate">
                    color: {selectedColor.hex};
                  </span>
                  <button
                    onClick={() => handleCopy(`color: ${selectedColor.hex};`, "css")}
                    className="p-1.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                    title={lang === "bn" ? "CSS রুল কপি করুন" : "Copy CSS rule"}
                  >
                    {copiedKey === "css" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Dominant Colors Card (Smart Harmonized 9 Swatches) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    {lang === "bn" ? "প্রধান রঙসমূহ (৯টি)" : "Dominant Color Palette (9)"}
                  </h3>
                </div>

                {/* Export actions */}
                {dominantColors.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadPaletteImage}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1 transition-colors"
                      title={lang === "bn" ? "প্যালেট ইমেজ ডাউনলোড" : "Download PNG"}
                    >
                      <Download className="w-3.5 h-3.5 text-rose-500" />
                      <span>PNG</span>
                    </button>
                    <button
                      onClick={handleCopyCssVariables}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1 transition-colors"
                      title={lang === "bn" ? "CSS ভ্যারিয়েবল কপি" : "Copy CSS"}
                    >
                      <Code className="w-3.5 h-3.5 text-indigo-500" />
                      <span>CSS</span>
                    </button>
                  </div>
                )}
              </div>

              {dominantColors.length > 0 ? (
                /* 3x3 Grid of Dominant Colors */
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                  {dominantColors.slice(0, 9).map((color, idx) => {
                    const isCurrent = selectedColor.hex === color.hex;
                    return (
                      <div
                        key={`${color.hex}-${idx}`}
                        onClick={() => {
                          selectColor(color);
                          handleCopy(color.hex, `dom-${idx}`, "কপি করা হয়েছে!");
                        }}
                        className={`border rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:scale-[1.03] transition-all duration-150 active:scale-95 group text-center relative ${
                          isCurrent
                            ? "border-rose-500 ring-2 ring-rose-500/30"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600"
                        }`}
                        title={lang === "bn" ? `${color.hex} নির্বাচন ও কপি করতে ক্লিক করুন` : `Click to pick ${color.hex}`}
                      >
                        {/* Top colored box with HEX text */}
                        <div
                          className="py-2.5 px-1 font-mono font-extrabold text-xs tracking-wide truncate transition-colors"
                          style={{
                            backgroundColor: color.hex,
                            color: color.isLight ? "#0f172a" : "#ffffff",
                          }}
                        >
                          {color.hex}
                        </div>

                        {/* RGB numbers row */}
                        <div className="bg-slate-50/90 dark:bg-slate-800/60 py-1 px-1 font-mono text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 truncate">
                          {color.rgb.r},{color.rgb.g},{color.rgb.b}
                        </div>

                        {/* HSL numbers row */}
                        <div className="bg-white dark:bg-slate-900 py-1 px-1 font-mono text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 truncate">
                          {color.hsl.h},{color.hsl.s}%,{color.hsl.l}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty state when no image uploaded */
                <div className="py-8 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 text-center">
                  <Layers className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {lang === "bn"
                      ? "ছবি আপলোড করলেই স্বয়ংক্রিয়ভাবে ৯টি প্রধান কালারের প্যালেট তৈরি হবে"
                      : "Upload an image to automatically extract 9 dominant palette swatches"}
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-100 transition-colors inline-flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{lang === "bn" ? "ছবি সিলেক্ট করুন" : "Select Image"}</span>
                  </button>
                </div>
              )}

              {/* Bottom palette utilities */}
              {dominantColors.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    {lang === "bn" ? "যেকোনো ঘরে ক্লিক করলেই সিলেক্ট ও কপি হবে" : "Click any swatch to pick and copy"}
                  </span>
                  <button
                    onClick={handleCopyJsonPalette}
                    className="font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
                  >
                    <FileJson className="w-3.5 h-3.5" />
                    <span>{lang === "bn" ? "JSON কপি" : "Copy JSON"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Recent Color Swatches History */}
            {colorHistory.length > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-slate-400" />
                    {lang === "bn" ? "পিক করা কালার হিস্টোরি" : "Recent Picked Colors"}
                  </h4>
                  <button
                    onClick={() => setColorHistory([selectedColor])}
                    className="text-[11px] text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    {lang === "bn" ? "ক্লিয়ার" : "Clear"}
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {colorHistory.map((col, idx) => (
                    <button
                      key={`${col.hex}-hist-${idx}`}
                      onClick={() => {
                        selectColor(col);
                        handleCopy(col.hex, `hist-${idx}`);
                      }}
                      className="w-8 h-8 rounded-xl border border-black/10 dark:border-white/10 hover:scale-115 active:scale-95 transition-transform shadow-sm relative group"
                      style={{ backgroundColor: col.hex }}
                      title={`${col.hex} - ${lang === "bn" ? "কপি করতে ক্লিক করুন" : "Click to select"}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Image Upload Field or Interactive Canvas) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {activeTab === "image" ? (
              /* --- IMAGE COLOR PICKER VIEW --- */
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
                {/* Header Toolbar */}
                <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/80 dark:border-rose-900/60 text-rose-500 flex items-center justify-center shrink-0 shadow-sm">
                      <Pipette className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                        {imageSrc
                          ? lang === "bn"
                            ? "ছবির ক্যানভাস ও লেন্স"
                            : "Interactive Image Canvas"
                          : lang === "bn"
                          ? "ছবি আপলোড ও কালার পিকার"
                          : "Upload & Pick Colors"}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {imageSrc
                          ? lang === "bn"
                            ? "পিক্সেল জুম করতে মাউস রাখুন, সিলেক্ট করতে ক্লিক করুন"
                            : "Hover to zoom 9x9 pixels, click to select"
                          : lang === "bn"
                          ? "ছবি নির্বাচন করে সরাসরি রঙ পিক করুন"
                          : "Choose an image to start picking"}
                      </p>
                    </div>
                  </div>

                  {/* Top Right Action Buttons (Always neatly aligned in a single row) */}
                  <div className="flex items-center gap-2 shrink-0 flex-nowrap ml-auto">
                    {hasMounted && supportsEyeDropper && (
                      <button
                        onClick={handleEyeDropper}
                        className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors border border-slate-200/60 dark:border-slate-700/60 shadow-sm"
                        title={lang === "bn" ? "স্ক্রিনের যেকোনো জায়গা থেকে রঙ পিক করুন" : "Pick color from screen"}
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="hidden sm:inline">{lang === "bn" ? "স্ক্রিন ড্রপার" : "EyeDropper"}</span>
                      </button>
                    )}

                    {imageSrc && (
                      <>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-rose-500/20 active:scale-95 shrink-0"
                          title={lang === "bn" ? "নতুন ছবি নির্বাচন করুন" : "Change image"}
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{lang === "bn" ? "ছবি পরিবর্তন" : "Change"}</span>
                        </button>

                        <button
                          onClick={() => {
                            setImageSrc(null);
                            setDominantColors([]);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200/60 dark:border-slate-700/60 transition-colors flex items-center gap-1 text-xs font-semibold shrink-0"
                          title={lang === "bn" ? "ছবি সরান" : "Remove Image"}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          <span className="hidden md:inline">{lang === "bn" ? "মুছুন" : "Clear"}</span>
                        </button>
                      </>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* --- EITHER IMAGE DISPLAY OR DEFAULT UPLOAD DROPZONE FIELD --- */}
                {imageSrc ? (
                  /* Active Image Display Viewport */
                  <div
                    ref={imageContainerRef}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleImageClick}
                    onTouchStart={handleTouch}
                    onTouchMove={handleTouch}
                    className={`relative w-full rounded-2xl border-2 overflow-hidden flex items-center justify-center min-h-[460px] max-h-[640px] bg-slate-100 dark:bg-slate-950 select-none cursor-crosshair transition-colors ${
                      isDragOver
                        ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/30"
                        : "border-slate-200 dark:border-slate-800"
                    }`}
                    style={{
                      backgroundImage:
                        "linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f1f5f9 75%), linear-gradient(-45deg, transparent 75%, #f1f5f9 75%)",
                      backgroundSize: "20px 20px",
                      backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      ref={imgElementRef}
                      src={imageSrc}
                      alt="Uploaded for color picking"
                      className="max-w-full max-h-[620px] object-contain rounded-xl shadow-sm pointer-events-auto cursor-crosshair"
                      draggable={false}
                      onClick={handleImageClick}
                      onTouchStart={handleTouch}
                    />

                    {/* Drag-over indicator */}
                    {isDragOver && (
                      <div className="absolute inset-0 bg-rose-500/15 backdrop-blur-sm flex flex-col items-center justify-center gap-2 pointer-events-none">
                        <Upload className="w-10 h-10 text-rose-500 animate-bounce" />
                        <p className="font-bold text-rose-600 dark:text-rose-400 text-sm">
                          {lang === "bn" ? "নতুন ছবিটি এখানে ড্রপ করুন" : "Drop your image here"}
                        </p>
                      </div>
                    )}

                    {/* Click Ripple Indicator */}
                    {clickPoint && (
                      <div
                        className="absolute w-8 h-8 rounded-full border-2 border-rose-500 animate-ping pointer-events-none"
                        style={{
                          left: `${clickPoint.x}px`,
                          top: `${clickPoint.y}px`,
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    )}

                    {/* Interactive Pixel Loupe / Magnifier Lens */}
                    {loupeVisible && hoverColor && (
                      <div
                        className="absolute pointer-events-none z-30 flex flex-col items-center"
                        style={{
                          left: `${loupePos.x}px`,
                          top: `${loupePos.y}px`,
                          transform: "translateX(-50%)",
                        }}
                      >
                        <div className="w-28 h-28 rounded-full border-[3px] border-white dark:border-slate-200 shadow-2xl overflow-hidden bg-white dark:bg-slate-900 relative ring-4 ring-black/15">
                          <canvas
                            ref={loupeCanvasRef}
                            width={112}
                            height={112}
                            className="w-full h-full block"
                          />
                        </div>

                        <div className="mt-2 px-3 py-1 rounded-full bg-slate-900/95 text-white font-mono text-xs font-bold shadow-xl flex items-center gap-2 backdrop-blur-md border border-white/20 whitespace-nowrap shrink-0">
                          <span
                            className="w-3 h-3 rounded-full shrink-0 border border-white/50"
                            style={{ backgroundColor: hoverColor.hex }}
                          />
                          <span>{hoverColor.hex}</span>
                          <span className="text-[10px] text-slate-300">
                            {hoverColor.rgb.r},{hoverColor.rgb.g},{hoverColor.rgb.b}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* --- DEFAULT IMAGE SELECTION & UPLOAD DROPZONE FIELD --- */
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative w-full rounded-3xl border-2 border-dashed p-8 sm:p-14 text-center cursor-pointer transition-all duration-200 min-h-[460px] flex flex-col items-center justify-center group ${
                      isDragOver
                        ? "border-rose-500 bg-rose-50/60 dark:bg-rose-950/30"
                        : "border-slate-300 dark:border-slate-700 hover:border-rose-500 dark:hover:border-rose-500 bg-slate-50/70 dark:bg-slate-900/40"
                    }`}
                  >
                    {/* Upload Icon */}
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-50 to-pink-50 dark:from-rose-950/60 dark:to-pink-950/40 border border-rose-200/80 dark:border-rose-900/60 text-rose-500 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                      <ImagePlus className="w-10 h-10" />
                    </div>

                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                      {lang === "bn" ? "ছবি নির্বাচন করুন বা ড্র্যাগ করে ছাড়ুন" : "Select an Image or Drag & Drop Here"}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed mb-6">
                      {lang === "bn"
                        ? "আপনার কম্পিউটার বা ফোন থেকে যেকোনো JPG, PNG, WebP বা GIF ছবি আপলোড করুন।"
                        : "Upload any JPG, PNG, WebP or GIF photo to instantly pick precise colors."}
                    </p>

                    {/* Action Select Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold text-sm shadow-md shadow-rose-500/25 hover:from-rose-600 hover:to-pink-600 flex items-center gap-2 transition-all active:scale-95"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{lang === "bn" ? "ছবি আপলোড করুন" : "Browse Image Files"}</span>
                    </button>

                    {/* Quick Features & Sample Option */}
                    <div className="mt-8 pt-6 border-t border-slate-200/70 dark:border-slate-800 w-full max-w-md flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
                      <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                        📋 {lang === "bn" ? "ক্লিপবোর্ড থেকে পেস্ট (Ctrl+V)" : "Paste from clipboard (Ctrl+V)"}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                        🔒 {lang === "bn" ? "১০০% লোকাল প্রসেসিং" : "100% Client-Side Privacy"}
                      </span>
                    </div>

                    {/* Demo sample loader */}
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageSrc(SAMPLE_DEMO_URL);
                        }}
                        className="text-xs font-bold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>{lang === "bn" ? "অথবা ডেমো স্যাম্পল ছবি দিয়ে টেস্ট করুন →" : "Or try with a demo sample image →"}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Bottom Helper Bar */}
                {imageSrc && (
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <ZoomIn className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>
                        {lang === "bn"
                          ? "মাউস ঘোরালে লাইভ ম্যাগনিফায়ার লেন্স পিক্সেল ভিউ দেখাবে; ক্লিক করলে রঙ কপি হবে।"
                          : "Move mouse to inspect pixels in loupe lens; click any pixel to pick and copy."}
                      </span>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="font-bold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 self-start sm:self-auto transition-colors"
                    >
                      {lang === "bn" ? "নতুন ছবি আপলোড →" : "Upload another photo →"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* --- CUSTOM COLOR STUDIO VIEW (REDESIGNED SLIDERS & PRESET SELECTOR) --- */
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-rose-500" />
                      <span>{lang === "bn" ? "কাস্টম রঙ ও ফাইন-টিউনিং" : "Custom Color Tuning Studio"}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {lang === "bn"
                        ? "স্লাইডার ও ইন্টারেক্টিভ স্পেকট্রাম দিয়ে নিখুঁত শেড তৈরি করুন"
                        : "Fine-tune precise RGB & HSL color channels with dynamic gradient sliders"}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-sm px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    {customHex}
                  </span>
                </div>

                {/* Quick Color Input & Preview Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-inner border-2 border-white dark:border-slate-700 shrink-0">
                      <input
                        type="color"
                        value={customHex}
                        onChange={(e) => handleCustomHexChange(e.target.value)}
                        className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer"
                        title={lang === "bn" ? "কালার হুইল ওপেন করতে ক্লিক করুন" : "Open Color Wheel"}
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                        {lang === "bn" ? "কালার হুইল স্পেকট্রাম" : "Interactive Color Wheel"}
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {lang === "bn" ? "যেকোনো শেড সরাসরি বেছে নিতে চাকাটিতে ক্লিক করুন" : "Click to select freeform spectrum shade"}
                      </p>
                    </div>
                  </div>

                  {/* Direct HEX Text Input */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">HEX</label>
                    <input
                      type="text"
                      value={customHex}
                      onChange={(e) => handleCustomHexChange(e.target.value)}
                      maxLength={7}
                      className="w-28 px-3 py-1.5 rounded-xl font-mono font-bold text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-rose-500 focus:outline-none text-slate-900 dark:text-white uppercase shadow-sm"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                {/* --- RGB CHANNELS GRADIENT SLIDERS --- */}
                <div className="space-y-5 mb-8">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>RGB Channels (0 - 255)</span>
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      rgb({customRgb.r}, {customRgb.g}, {customRgb.b})
                    </span>
                  </div>

                  {/* RED SLIDER */}
                  <div className="bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex items-center gap-4">
                    <span className="w-16 text-xs font-extrabold font-mono text-rose-500 shrink-0">
                      Red (R)
                    </span>
                    <div className="flex-1 relative flex items-center">
                      <input
                        type="range"
                        min={0}
                        max={255}
                        value={customRgb.r}
                        onChange={(e) => handleCustomRgbChange("r", Number(e.target.value))}
                        className="w-full h-3 rounded-lg appearance-none cursor-pointer transition-all shadow-inner"
                        style={{
                          background: `linear-gradient(to right, rgb(0, ${customRgb.g}, ${customRgb.b}), rgb(255, ${customRgb.g}, ${customRgb.b}))`,
                        }}
                      />
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={255}
                      value={customRgb.r}
                      onChange={(e) => handleCustomRgbChange("r", Number(e.target.value))}
                      className="w-14 px-2 py-1 rounded-lg text-center font-mono font-bold text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm"
                    />
                  </div>

                  {/* GREEN SLIDER */}
                  <div className="bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex items-center gap-4">
                    <span className="w-16 text-xs font-extrabold font-mono text-emerald-500 shrink-0">
                      Green (G)
                    </span>
                    <div className="flex-1 relative flex items-center">
                      <input
                        type="range"
                        min={0}
                        max={255}
                        value={customRgb.g}
                        onChange={(e) => handleCustomRgbChange("g", Number(e.target.value))}
                        className="w-full h-3 rounded-lg appearance-none cursor-pointer transition-all shadow-inner"
                        style={{
                          background: `linear-gradient(to right, rgb(${customRgb.r}, 0, ${customRgb.b}), rgb(${customRgb.r}, 255, ${customRgb.b}))`,
                        }}
                      />
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={255}
                      value={customRgb.g}
                      onChange={(e) => handleCustomRgbChange("g", Number(e.target.value))}
                      className="w-14 px-2 py-1 rounded-lg text-center font-mono font-bold text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm"
                    />
                  </div>

                  {/* BLUE SLIDER */}
                  <div className="bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex items-center gap-4">
                    <span className="w-16 text-xs font-extrabold font-mono text-blue-500 shrink-0">
                      Blue (B)
                    </span>
                    <div className="flex-1 relative flex items-center">
                      <input
                        type="range"
                        min={0}
                        max={255}
                        value={customRgb.b}
                        onChange={(e) => handleCustomRgbChange("b", Number(e.target.value))}
                        className="w-full h-3 rounded-lg appearance-none cursor-pointer transition-all shadow-inner"
                        style={{
                          background: `linear-gradient(to right, rgb(${customRgb.r}, ${customRgb.g}, 0), rgb(${customRgb.r}, ${customRgb.g}, 255))`,
                        }}
                      />
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={255}
                      value={customRgb.b}
                      onChange={(e) => handleCustomRgbChange("b", Number(e.target.value))}
                      className="w-14 px-2 py-1 rounded-lg text-center font-mono font-bold text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm"
                    />
                  </div>
                </div>

                {/* --- HSL CHANNELS GRADIENT SLIDERS --- */}
                <div className="space-y-5 mb-8">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>HSL Channels (Hue, Saturation, Lightness)</span>
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      hsl({customHsl.h}, {customHsl.s}%, {customHsl.l}%)
                    </span>
                  </div>

                  {/* HUE RAINBOW SLIDER */}
                  <div className="bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex items-center gap-4">
                    <span className="w-16 text-xs font-extrabold font-mono text-purple-500 shrink-0">
                      Hue (H)
                    </span>
                    <div className="flex-1 relative flex items-center">
                      <input
                        type="range"
                        min={0}
                        max={360}
                        value={customHsl.h}
                        onChange={(e) => handleCustomHslChange("h", Number(e.target.value))}
                        className="w-full h-3 rounded-lg appearance-none cursor-pointer transition-all shadow-inner"
                        style={{
                          background:
                            "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                        }}
                      />
                    </div>
                    <span className="w-14 px-2 py-1 rounded-lg text-center font-mono font-bold text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm">
                      {customHsl.h}°
                    </span>
                  </div>

                  {/* SATURATION SLIDER */}
                  <div className="bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex items-center gap-4">
                    <span className="w-16 text-xs font-extrabold font-mono text-amber-500 shrink-0">
                      Sat (S)
                    </span>
                    <div className="flex-1 relative flex items-center">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={customHsl.s}
                        onChange={(e) => handleCustomHslChange("s", Number(e.target.value))}
                        className="w-full h-3 rounded-lg appearance-none cursor-pointer transition-all shadow-inner"
                        style={{
                          background: `linear-gradient(to right, hsl(${customHsl.h}, 0%, ${customHsl.l}%), hsl(${customHsl.h}, 100%, ${customHsl.l}%))`,
                        }}
                      />
                    </div>
                    <span className="w-14 px-2 py-1 rounded-lg text-center font-mono font-bold text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm">
                      {customHsl.s}%
                    </span>
                  </div>

                  {/* LIGHTNESS SLIDER */}
                  <div className="bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex items-center gap-4">
                    <span className="w-16 text-xs font-extrabold font-mono text-slate-500 shrink-0">
                      Light (L)
                    </span>
                    <div className="flex-1 relative flex items-center">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={customHsl.l}
                        onChange={(e) => handleCustomHslChange("l", Number(e.target.value))}
                        className="w-full h-3 rounded-lg appearance-none cursor-pointer transition-all shadow-inner"
                        style={{
                          background: `linear-gradient(to right, #000000 0%, hsl(${customHsl.h}, ${customHsl.s}%, 50%) 50%, #ffffff 100%)`,
                        }}
                      />
                    </div>
                    <span className="w-14 px-2 py-1 rounded-lg text-center font-mono font-bold text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm">
                      {customHsl.l}%
                    </span>
                  </div>
                </div>

                {/* --- CURATED COLOR PRESETS & PALETTE SELECTOR --- */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Palette className="w-4 h-4 text-rose-500" />
                      <span>{lang === "bn" ? "কিউরেটেড কালার প্যালেট ও থিম" : "Curated Designer Palette Collections"}</span>
                    </h4>

                    {/* Preset Category Switcher */}
                    <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold self-start sm:self-auto flex-wrap">
                      {(["trending", "tailwind", "pastel", "neonDark"] as const).map((key) => {
                        const labels = {
                          trending: lang === "bn" ? "জনপ্রিয়" : "Trending",
                          tailwind: lang === "bn" ? "টেইলউইন্ড" : "Tailwind",
                          pastel: lang === "bn" ? "প্যাস্টেল" : "Pastel",
                          neonDark: lang === "bn" ? "নিয়ন ও ডার্ক" : "Neon/Dark",
                        };
                        return (
                          <button
                            key={key}
                            onClick={() => setPresetTab(key)}
                            className={`px-3 py-1 rounded-lg transition-colors ${
                              presetTab === key
                                ? "bg-white dark:bg-slate-900 text-rose-500 shadow-sm font-bold"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            {labels[key]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preset Swatches Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PRESET_COLLECTIONS[presetTab].map((item) => {
                      const isCurrent = customHex.toUpperCase() === item.hex.toUpperCase();
                      const rgb = hexToRgb(item.hex);
                      const isLight = rgb ? isLightColor(rgb.r, rgb.g, rgb.b) : false;

                      return (
                        <button
                          key={item.hex}
                          onClick={() => handleCustomHexChange(item.hex)}
                          className={`p-3 rounded-2xl border text-left transition-all duration-150 active:scale-95 group flex items-center gap-3 shadow-sm ${
                            isCurrent
                              ? "border-rose-500 ring-2 ring-rose-500/30 bg-rose-50/30 dark:bg-rose-950/20"
                              : "border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-white dark:bg-slate-900"
                          }`}
                        >
                          <div
                            className="w-10 h-10 rounded-xl shrink-0 shadow-sm border border-black/10 flex items-center justify-center transition-transform group-hover:scale-105"
                            style={{ backgroundColor: item.hex }}
                          >
                            {isCurrent && (
                              <Check
                                className="w-4 h-4"
                                style={{ color: isLight ? "#0f172a" : "#ffffff" }}
                              />
                            )}
                          </div>

                          <div className="overflow-hidden">
                            <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block truncate">
                              {item.name}
                            </span>
                            <span className="font-mono text-[11px] text-slate-400 block uppercase">
                              {item.hex}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- BENEFIT HIGHLIGHT CARDS --- */}
        <div className="mt-14 sm:mt-20 pt-10 border-t border-slate-200/80 dark:border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {lang === "bn"
                ? "টুলকাজ স্মার্ট কালার স্টুডিওর অনন্য সুবিধাসমূহ"
                : "Professional Features for Designers & Developers"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              {lang === "bn"
                ? "গ্রাফিক ডিজাইনার, ইউআই/ইউএক্স প্রফেশনাল এবং ওয়েব ডেভেলপারদের জন্য দ্রুততম ও নির্ভুল কালার এক্সট্র্যাকশন টুল।"
                : "Engineered for designers and developers demanding pixel-perfect color extraction and seamless code exporting."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center font-bold mb-5 shadow-md shadow-rose-500/20">
                <ZoomIn className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                {lang === "bn" ? "আল্ট্রা-এইচডি পিক্সেল জুম লেন্স" : "Ultra-HD Pixel Loupe Lens"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === "bn"
                  ? "ছবির যেকোনো সূক্ষ্ম অংশে মাউস ঘোরালে ৯x৯ রেট্রো পিক্সেল গ্রিড সক্রিয় হয়। প্রতিটি একক পিক্সেলের লাইভ HEX এবং RGB মান চোখের সামনে ফুটে ওঠে।"
                  : "Inspect individual pixels through an interactive 9x9 retro pixel magnifying lens with real-time HEX and RGB badges."}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold mb-5 shadow-md shadow-amber-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                {lang === "bn" ? "স্মার্ট ৯টি ডমিন্যান্ট কালার প্যালেট" : "Automated 9 Harmonized Swatches"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === "bn"
                  ? "ছবির সব রঙের ঘনত্ব ও বৈচিত্র্য বিশ্লেষণ করে স্বয়ংক্রিয়ভাবে ৯টি ভারসাম্যপূর্ণ ডমিন্যান্ট কালার তৈরি করে, যা সরাসরি PNG বা CSS ভ্যারিয়েবল হিসেবে সেভ করা যায়।"
                  : "Smart 3D color quantization extracts 9 visually distinct and harmonious colors directly from the uploaded photograph."}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold mb-5 shadow-md shadow-indigo-500/20">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                {lang === "bn" ? "কাস্টম স্লাইডার ও ডিজাইনার প্রিসেট" : "Dynamic Sliders & Presets"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === "bn"
                  ? "RGB ও HSL এর জন্য ডায়নামিক গ্রেডিয়েন্ট স্লাইডার এবং টেইলউইন্ড, প্যাস্টেল ও নিয়ন থিম প্রিসেট দিয়ে যেকোনো কালার সহজে তৈরি ও ফাইন-টিউন করুন।"
                  : "Full RGB and HSL gradient tracks with number controls plus curated Tailwind, Pastel, and Neon design presets."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
