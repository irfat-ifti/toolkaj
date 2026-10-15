"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "bn" | "en";
type Theme = "light" | "dark";

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  t: (key: string, defaultText?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  bn: {
    siteTitle: "ToolKaj - অল-ইন-ওয়ান অনলাইন টুলস",
    siteTagline: "ফ্রি পিডিএফ, ছবি, টেক্সট ও সোশ্যাল মিডিয়া টুলস",
    searchPlaceholder: "যেকোনো টুল খুঁজুন (যেমন: PDF merge, ছবির সাইজ, ব্যাকগ্রাউন্ড রিমুভ)...",
    searchShortcut: "খুঁজুন...",
    allCategories: "সব ক্যাটাগরি",
    popularTools: "জনপ্রিয় টুলস",
    newBadge: "নতুন",
    freeBadge: "১০০% ফ্রি",
    noServerUpload: "ব্রাউজারেই কাজ করে — কোনো ফাইলে সার্ভারে যায় না",
    heroHeading: "দৈনন্দিন সব কাজের ডিজিটাল সমাধান এক ছাদের নিচে",
    heroSubheading: "PDF মার্জ, ছবির সাইজ ছোট করা, ব্যাকগ্রাউন্ড রিমুভ, সরকারি চাকরির ফটো রিসাইজ, এবং আরও ৪০+ প্রয়োজনীয় টুলস ব্যবহার করুন কোনো লগইন ছাড়াই।",
    exploreTools: "টুলস দেখুন",
    quickStats: "৪০+ ফ্রি টুলস • আনলিমিটেড ব্যবহার • ১০০% নিরাপদ",
    footerAbout: "বাংলাদেশের সেরা ও দ্রুততম অনলাইন টুলস প্ল্যাটফর্ম। PDF, ইমেজ, টেক্সট, ভিডিও ও সোশ্যাল মিডিয়া টুলস ব্যবহার করুন কোনো লগইন ছাড়াই ১০০% বিনামূল্যে।",
    privacyNotice: "আপনার ফাইল নিরাপদে থাকে — কোনো সার্ভারে আপলোড হয় না",
    quickLinks: "প্রয়োজনীয় লিংক",
    aboutUs: "আমাদের সম্পর্কে",
    privacyPolicy: "গোপনীয়তা নীতি",
    termsOfService: "শর্তাবলী",
    contactUs: "যোগাযোগ",
    allRightsReserved: "সর্বস্বত্ব সংরক্ষিত।",
    tryNow: "ব্যবহার করুন",
    pinnedTools: "পিন করা প্রিয় টুলস",
    featuredTools: "বিশেষ আকর্ষণ",
    home: "হোম",
    copySuccess: "কপিকৃত!",
    copyText: "কপি করুন",
    download: "ডাউনলোড",
    processing: "কাজ চলছে...",
    reset: "রিসেট",
    uploadFile: "ফাইল নির্বাচন করুন বা ড্র্যাগ করে ছাড়ুন",
    changeLang: "English",
  },
  en: {
    siteTitle: "ToolKaj - All-in-One Online Free Tools",
    siteTagline: "Free PDF, Image, Text & Social Media Utilities",
    searchPlaceholder: "Search any tool (e.g., PDF merge, image resize, remove bg)...",
    searchShortcut: "Search...",
    allCategories: "All Categories",
    popularTools: "Popular Tools",
    newBadge: "New",
    freeBadge: "100% Free",
    noServerUpload: "Runs locally in browser — Files never touch our servers",
    heroHeading: "All Daily Digital Utilities Under One Roof",
    heroSubheading: "Merge PDFs, compress photos, remove background, resize govt job photos, and use 40+ essential tools instantly with no sign-up required.",
    exploreTools: "Explore Tools",
    quickStats: "40+ Free Tools • Unlimited Usage • 100% Secure",
    footerAbout: "Bangladesh's fastest and most reliable all-in-one web utilities suite. Convert PDFs, process photos, calculate finances, and enjoy free smart tools with zero setup.",
    privacyNotice: "Your files remain safe — 100% client-side browser processing",
    quickLinks: "Quick Links",
    aboutUs: "About Us",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    contactUs: "Contact Us",
    allRightsReserved: "All rights reserved.",
    tryNow: "Open Tool",
    pinnedTools: "Pinned Favorites",
    featuredTools: "Featured Tools",
    home: "Home",
    copySuccess: "Copied!",
    copyText: "Copy",
    download: "Download",
    processing: "Processing...",
    reset: "Reset",
    uploadFile: "Choose file or drag & drop here",
    changeLang: "বাংলা",
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("bn");
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Sync Theme (Default: light)
    const savedTheme = localStorage.getItem("toolkaj_theme") as Theme | null;
    const initialTheme: Theme = savedTheme === "dark" ? "dark" : "light";
    
    setThemeState(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Sync Language
    const savedLang = localStorage.getItem("toolkaj_lang") as Language | null;
    if (savedLang === "bn" || savedLang === "en") {
      setLangState(savedLang);
    }
    setMounted(true);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("toolkaj_lang", newLang);
    window.dispatchEvent(new CustomEvent("toolkaj_lang_change", { detail: newLang }));
    document.documentElement.setAttribute("lang", newLang);
  };

  const toggleLang = () => {
    setLang(lang === "bn" ? "en" : "bn");
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("toolkaj_theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const t = (key: string, defaultText?: string): string => {
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    return defaultText || key;
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        theme,
        setTheme,
        toggleTheme,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
