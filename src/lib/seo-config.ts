import { ToolItem } from "./tools-data";

export const SITE_CONFIG = {
  name: "ToolKaj",
  nameBn: "টুলকাজ",
  taglineBn: "অল-ইন-ওয়ান অনলাইন টুলস ও ডিজিটাল কনভার্সন হাব",
  taglineEn: "All-in-One Online Tools, PDF & Image Suite",
  descriptionBn: "৫০+ প্রয়োজনীয় অনলাইন টুলস এক জায়গায় সম্পূর্ণ বিনামূল্যে। কোনো লগইন ছাড়াই দ্রুত ও নিরাপদে PDF কম্প্রেস, মার্জ, এনআইডি টু পিডিএফ, সরকারি চাকরির ছবি ও স্বাক্ষর রিসাইজ (৩০০x৩০০), ইউটিউব থাম্বনেইল ডাউনলোড এবং আরও অনেক কিছু করুন।",
  descriptionEn: "50+ free online tools for PDF, Images, Text, Video and Social Media. Compress PDF, resize govt job photos (300x300), convert Bijoy to Unicode, download YouTube thumbnails, and more without registration.",
  url: "https://toolkaj.vercel.app",
  author: "ToolKaj Team",
  localeBn: "bn_BD",
  localeEn: "en_US",
  keywords: [
    "ToolKaj",
    "toolkaj",
    "টুলকাজ",
    "toolkaj online tools",
    "toolkaj bangladesh",
    "অনলাইন টুলস",
    "কালার পিকার",
    "image color picker from photo",
    "ছবি থেকে কালার পিক",
    "pdf compress",
    "বিজয় ইউনিকোড কনভার্টার",
    "সরকারি চাকরির ছবির সাইজ ৩০০x৩০০",
    "চাকরির স্বাক্ষর ৩০০x৮০",
    "nid to pdf",
    "ইউটিউব থাম্বনেইল ডাউনলোড",
    "ats cv maker",
    "বয়স ক্যালকুলেটর",
    "বাংলা বায়োডাটা মেকার",
    "কিউআর কোড জেনারেটর",
    "online tools bangladesh",
    "sohozkaj alternative",
    "greatonlinetools alternative",
    "free online tools vercel",
  ],
};

export function generateToolMetadata(tool: ToolItem) {
  const title = `${tool.titleBn} (${tool.titleEn}) — ১০০% ফ্রি অনলাইন টুল | ToolKaj`;
  const description = `${tool.descBn} ব্রাউজারেই সরাসরি প্রসেসিং হয়, কোনো রেজিস্ট্রেশন বা চার্জ ছাড়াই সম্পূর্ণ বিনামূল্যে ব্যবহার করুন।`;

  return {
    title,
    description,
    keywords: [...tool.keywords, ...SITE_CONFIG.keywords],
    alternates: {
      canonical: `${SITE_CONFIG.url}${tool.href}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_CONFIG.url}${tool.href}`,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.localeBn,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ToolKaj",
    alternateName: ["টুলকাজ", "toolkaj", "ToolKaj - টুলকাজ"],
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    image: `${SITE_CONFIG.url}/logo.png`,
    description: SITE_CONFIG.descriptionBn,
    areaServed: ["BD", "IN", "Worldwide"],
    availableLanguage: ["Bengali", "English"],
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ToolKaj",
    alternateName: [
      "টুলকাজ",
      "toolkaj",
      "ToolKaj - টুলকাজ",
      "ToolKaj BD",
    ],
    url: SITE_CONFIG.url,
    inLanguage: ["bn-BD", "en-US"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.url}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getSoftwareAppSchema(tool?: ToolItem) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool ? `${tool.titleBn} - ${tool.titleEn}` : SITE_CONFIG.nameBn,
    operatingSystem: "Web Browser",
    applicationCategory: "UtilitiesApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BDT",
    },
    description: tool ? tool.descBn : SITE_CONFIG.descriptionBn,
    url: tool ? `${SITE_CONFIG.url}${tool.href}` : SITE_CONFIG.url,
    inLanguage: "bn-BD",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1280",
      bestRating: "5",
    },
  };
}

export const HOME_FAQS = [
  {
    q: "ToolKaj (টুলকাজ) ব্যবহার করতে কি কোনো একাউন্ট বা রেজিস্ট্রেশন প্রয়োজন?",
    qBn: "ToolKaj (টুলকাজ) ব্যবহার করতে কি কোনো একাউন্ট বা রেজিস্ট্রেশন প্রয়োজন?",
    qEn: "Is any account or registration required to use ToolKaj?",
    a: "না, ToolKaj-এর সব টুলস সম্পূর্ণ বিনামূল্যে এবং কোনো একাউন্ট, সাইন-আপ বা ক্রেডিট লিমিট ছাড়াই আনলিমিটেড ব্যবহার করা যায়।",
    aBn: "না, ToolKaj-এর সব টুলস সম্পূর্ণ বিনামূল্যে এবং কোনো একাউন্ট, সাইন-আপ বা ক্রেডিট লিমিট ছাড়াই আনলিমিটেড ব্যবহার করা যায়।",
    aEn: "No, all tools on ToolKaj are 100% free forever without any sign-up, subscription, or credit limitations.",
  },
  {
    q: "আমার ফাইল ও ছবি কি সার্ভারে সংরক্ষিত হয়?",
    qBn: "আমার ফাইল ও ছবি কি সার্ভারে সংরক্ষিত হয়?",
    qEn: "Are my uploaded files or photos stored on your server?",
    a: "না, ToolKaj-এর প্রায় সব টুলস সরাসরি আপনার ব্রাউজারের ভেতর নিরাপদে চলে (Client-side Web APIs)। কোনো ছবি বা ব্যক্তিগত ফাইল অন্য কোথাও আপলোড বা সংরক্ষণ করা হয় না।",
    aBn: "না, ToolKaj-এর প্রায় সব টুলস সরাসরি আপনার ব্রাউজারের ভেতর নিরাপদে চলে (Client-side Web APIs)। কোনো ছবি বা ব্যক্তিগত ফাইল অন্য কোথাও আপলোড বা সংরক্ষণ করা হয় না।",
    aEn: "No, our tools operate directly inside your browser using client-side Web APIs. Your personal files and images are never uploaded or stored on any remote server.",
  },
  {
    q: "সরকারি চাকরির ছবির সাইজ (৩০০x৩০০) ও স্বাক্ষর (৩০০x৮০) কি এখান থেকে তৈরি করা যায়?",
    qBn: "সরকারি চাকরির ছবির সাইজ (৩০০x৩০০) ও স্বাক্ষর (৩০০x৮০) কি এখান থেকে তৈরি করা যায়?",
    qEn: "Can I prepare Bangladesh govt job 300x300 photos and 300x80 signatures here?",
    a: "হ্যাঁ! বাংলাদেশ সরকারের Teletalk ও BPSC নির্দেশিকা অনুযায়ী ১০০ KB-এর মধ্যে ৩০০x৩০০ পিক্সেল ছবি এবং ৬০ KB-এর মধ্যে ৩০০x৮০ পিক্সেল স্বাক্ষর এক ক্লিকেই তৈরি করা যায়।",
    aBn: "হ্যাঁ! বাংলাদেশ সরকারের Teletalk ও BPSC নির্দেশিকা অনুযায়ী ১০০ KB-এর মধ্যে ৩০০x৩০০ পিক্সেল ছবি এবং ৬০ KB-এর মধ্যে ৩০০x৮০ পিক্সেল স্বাক্ষর এক ক্লিকেই তৈরি করা যায়।",
    aEn: "Yes! You can instantly resize photos to exactly 300x300 pixels (<100 KB) and signatures to 300x80 pixels (<60 KB) strictly meeting Teletalk and BPSC requirements.",
  },
  {
    q: "মোবাইল থেকে কি ToolKaj টুলস ব্যবহার করা যাবে?",
    qBn: "মোবাইল থেকে কি ToolKaj টুলস ব্যবহার করা যাবে?",
    qEn: "Can I use ToolKaj from mobile phones and tablets?",
    a: "হ্যাঁ, ToolKaj সম্পূর্ণ রেসপনসিভ ও মোবাইল-বান্ধব। অ্যান্ড্রয়েড বা আইফোনের যেকোনো ব্রাউজার থেকেই সব টুলস স্বাচ্ছন্দ্যে ব্যবহার করা যায়।",
    aBn: "হ্যাঁ, ToolKaj সম্পূর্ণ রেসপনসিভ ও মোবাইল-বান্ধব। অ্যান্ড্রয়েড বা আইফোনের যেকোনো ব্রাউজার থেকেই সব টুলস স্বাচ্ছন্দ্যে ব্যবহার করা যায়।",
    aEn: "Yes, ToolKaj is 100% responsive and optimized for mobile devices. It works smoothly across all Android and iOS modern browsers.",
  },
  {
    q: "YouTube থাম্বনেইল কি ফুল HD কোয়ালিটিতে ডাউনলোড করা যায়?",
    qBn: "YouTube থাম্বনেইল কি ফুল HD কোয়ালিটিতে ডাউনলোড করা যায়?",
    qEn: "Can I download YouTube thumbnails in Full HD quality?",
    a: "হ্যাঁ, যেকোনো YouTube ভিডিও লিংক দিয়ে সর্বোচ্চ রেজোলিউশনের (MaxRes 1080p, HQ 720p) আসল থাম্বনেইল ডাউনলোড করা যায়।",
    aBn: "হ্যাঁ, যেকোনো YouTube ভিডিও লিংক দিয়ে সর্বোচ্চ রেজোলিউশনের (MaxRes 1080p, HQ 720p) আসল থাম্বনেইল ডাউনলোড করা যায়।",
    aEn: "Yes, simply paste any YouTube video link to download original full-resolution thumbnails (MaxRes 1080p, HQ 720p) with one click.",
  },
];

export function getFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}
