import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FirebaseAnalyticsTracker from "@/components/FirebaseAnalyticsTracker";
import {
  SITE_CONFIG,
  getOrganizationSchema,
  getWebSiteSchema,
  getSoftwareAppSchema,
  getFaqSchema,
} from "@/lib/seo-config";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.nameBn} - ${SITE_CONFIG.taglineBn}`,
    template: `%s | ${SITE_CONFIG.nameBn}`,
  },
  description: SITE_CONFIG.descriptionBn,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.author, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.localeBn,
    url: SITE_CONFIG.url,
    title: `${SITE_CONFIG.nameBn} - ${SITE_CONFIG.taglineBn}`,
    description: SITE_CONFIG.descriptionBn,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.nameBn} - ${SITE_CONFIG.taglineBn}`,
    description: SITE_CONFIG.descriptionBn,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: "/logo.svg",
    shortcut: "/favicon.svg",
  },
};

import { AppProvider } from "@/context/AppContext";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Immediate Theme Initialization Script (Default: Light) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('toolkaj_theme');
                if (savedTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getWebSiteSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getSoftwareAppSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getFaqSchema()) }}
        />

        {/* ========================================================================= */}
        {/* ADSTERRA ADS - GLOBAL SCRIPTS (পপ-আন্ডার ও সোশ্যাল বার অ্যাড) */}
        {/* ========================================================================= */}
        {/* 1. Popunder_1: পুরো ওয়েবসাইটে ব্যাকগ্রাউন্ড পপ-আন্ডার অ‍্যাড */}
        <Script
          id="adsterra-popunder"
          data-cfasync="false"
          src="https://abscloud.org/1/815e86f4e08b36fd26cb38840d438e52"
          strategy="afterInteractive"
        />

        {/* 2. SocialBar_1: পুরো ওয়েবসাইটে ফ্লোটিং সোশ্যাল বার / নোটিফিকেশন অ‍্যাড */}
        <Script
          id="adsterra-socialbar"
          data-cfasync="false"
          src="https://bauval.org/14/b4e79b61ef0a45407d04cc8876732764"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200`}
      >
        <AppProvider>
          <FirebaseAnalyticsTracker />
          <Navbar />

          {/* ========================================================================= */}
          {/* ADSTERRA ADS - 468x60 BANNER (468x60_1) */}
          {/* হেডারের নিচে এবং মূল কন্টেন্টের ঠিক উপরে ৪৬৮x৬০ ব্যানার অ্যাড */}
          {/* ========================================================================= */}
          <div className="w-full flex justify-center py-2 px-4 bg-transparent overflow-x-auto">
            <div className="w-[468px] h-[60px] max-w-full flex justify-center items-center shrink-0">
              <iframe
                title="Adsterra 468x60 Banner"
                width={468}
                height={60}
                style={{ border: "none", overflow: "hidden" }}
                scrolling="no"
                srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:0;display:flex;justify-content:center;align-items:center;background:transparent;overflow:hidden;}</style></head><body><script type="text/javascript">atOptions={'key':'ccb85ec4cc697d352ae588c69ba5ae56','format':'iframe','height':60,'width':468,'params':{}};</script><script type="text/javascript" src="https://bauval.org/22/ccb85ec4cc697d352ae588c69ba5ae56"></script></body></html>`}
              />
            </div>
          </div>

          <main className="flex-1">{children}</main>

          {/* ========================================================================= */}
          {/* ADSTERRA ADS - NATIVE BANNER (নেটিভ ব্যানার অ্যাড) */}
          {/* কন্টেন্টের নিচে এবং ফুটারের ঠিক ওপরে রেসপন্সিভ ব্যানার হিসেবে প্রদর্শিত হবে */}
          {/* ========================================================================= */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 my-2 flex flex-col items-center justify-center">
            <div id="container-ee383bd1fcb1ced15a445150ab68a81b" className="w-full flex justify-center min-h-[90px]" />
            <Script
              id="adsterra-native-banner"
              async
              data-cfasync="false"
              src="https://bauval.org/21/ee383bd1fcb1ced15a445150ab68a81b"
              strategy="afterInteractive"
            />
          </div>

          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
