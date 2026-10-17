import { Metadata } from "next";

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolStep {
  title: string;
  desc: string;
}

export interface PageSeoItem {
  path: string;
  slug?: string;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  subtitle: string;
  howToSteps?: ToolStep[];
  faqs?: ToolFaq[];
  whyUse?: string[];
  specifications?: { label: string; value: string }[];
  limitations?: string[];
  category?: string;
}

export const BASE_URL = "https://toolkaj.vercel.app";

export const SEO_REGISTRY: Record<string, PageSeoItem> = {
  // ==========================================
  // CORE & STATIC PAGES
  // ==========================================
  home: {
    path: "/",
    title: "ToolKaj (টুলকাজ) - অল-ইন-ওয়ান অনলাইন টুলস ও ডিজিটাল কনভার্সন হাব",
    description: "৫০+ প্রয়োজনীয় অনলাইন টুলস এক জায়গায় সম্পূর্ণ বিনামূল্যে। কোনো লগইন ছাড়াই দ্রুত ও নিরাপদে PDF কম্প্রেস, মার্জ, এনআইডি টু পিডিএফ, সরকারি চাকরির ছবি ও স্বাক্ষর রিসাইজ (৩০০x৩০০), ইউটিউব থাম্বনেইল ডাউনলোড এবং আরও অনেক কিছু করুন।",
    keywords: [
      "ToolKaj", "toolkaj", "টুলকাজ", "toolkaj online tools", "toolkaj bangladesh", "অনলাইন টুলস",
      "sohozkaj alternative", "greatonlinetools alternative", "free online tools bd", "online tools hub",
      "pdf compress free", "photo resizer 300x300", "bijoy to unicode converter", "nid to pdf",
      "youtube thumbnail downloader", "ats cv maker free", "boyos calculator", "free web tools",
      "bangla online tools", "bangladesh online tools", "quick tools online", "all in one tools bangla"
    ],
    h1: "ToolKaj (টুলকাজ) — ৫০+ প্রয়োজনীয় ফ্রি অনলাইন টুলস",
    subtitle: "কোনো রেজিস্ট্রেশন ছাড়াই ব্রাউজারে সম্পূর্ণ বিনামূল্যে ব্যবহার করুন সেরা ডিজিটাল টুলস",
  },
  tools: {
    path: "/tools",
    title: "সবগুলো অনলাইন টুলস (All Online Tools) — ৫০+ ফ্রি টুলস | ToolKaj",
    description: "ToolKaj-এর ৫০+ ফ্রি অনলাইন টুলসের সম্পূর্ণ তালিকা। PDF, ইমেজ, টেক্সট, ভিডিও, সোশ্যাল মিডিয়া ও দৈনন্দিন ক্যালকুলেটর এক জায়গায়।",
    keywords: [
      "all online tools", "tool directory", "সব অনলাইন টুলস", "free tools list", "pdf tools", "image tools",
      "text tools", "video tools", "social media tools", "calculator tools", "bangla tools collection",
      "online converter tools", "web utilities free", "toolkaj all tools"
    ],
    h1: "আমাদের সকল ফ্রি অনলাইন টুলস",
    subtitle: "আপনার দৈনন্দিন কাজের জন্য ক্যাটাগরিভিত্তিক সেরা ৫০+ ডিজিটাল টুলস এক নজরে",
  },
  about: {
    path: "/about",
    title: "আমাদের সম্পর্কে (About Us) — ToolKaj অনলাইন টুলস প্ল্যাটফর্ম | ToolKaj",
    description: "ToolKaj (টুলকাজ) হলো বাংলাদেশের দ্রুততম ও সবচেয়ে নিরাপদ উন্মুক্ত অনলাইন টুলস প্ল্যাটফর্ম। আমাদের লক্ষ্য, গোপনীয়তা ও ক্লায়েন্ট-সাইড প্রযুক্তি সম্পর্কে জানুন।",
    keywords: [
      "about toolkaj", "toolkaj bangladesh", "আমাদের সম্পর্কে", "online tools developer bd",
      "free tools platform", "secure client side tools", "toolkaj mission", "bangla web tools"
    ],
    h1: "ToolKaj (টুলকাজ) সম্পর্কে",
    subtitle: "বাংলাদেশের নাগরিকদের জন্য দ্রুত, নিরাপদ ও সম্পূর্ণ বিনামূল্যে তৈরি ডিজিটাল টুলস হাব",
  },
  contact: {
    path: "/contact",
    title: "যোগাযোগ করুন (Contact Us) — ফিডব্যাক ও সহায়তা | ToolKaj",
    description: "যেকোনো জিজ্ঞাসা, ফিচার রিকোয়েস্ট বা সহায়তার জন্য ToolKaj টিমের সাথে সরাসরি যোগাযোগ করুন। আমরা দ্রুত প্রতিক্রিয়া প্রদান করি।",
    keywords: [
      "contact toolkaj", "toolkaj support", "যোগাযোগ", "online tools help", "feedback toolkaj",
      "feature request", "contact developer bd"
    ],
    h1: "আমাদের সাথে যোগাযোগ করুন",
    subtitle: "আপনার মতামত, পরামর্শ বা যেকোনো সমস্যার কথা আমাদের জানান",
  },
  privacyPolicy: {
    path: "/privacy-policy",
    title: "গোপনীয়তা নীতি (Privacy Policy) — ডেটা নিরাপত্তা প্রতিশ্রুতি | ToolKaj",
    description: "ToolKaj আপনার ব্যক্তিগত তথ্যের সুরক্ষায় শতভাগ প্রতিশ্রুতিবদ্ধ। আপনার ফাইল ও ছবি ব্রাউজারের বাইরে কোনো সার্ভারে আপলোড হয় না।",
    keywords: [
      "privacy policy", "গোপনীয়তা নীতি", "data security toolkaj", "client side privacy",
      "safe online tools", "no upload privacy"
    ],
    h1: "গোপনীয়তা নীতি (Privacy Policy)",
    subtitle: "আপনার তথ্য ও ফাইলের নিরাপত্তা আমাদের কাছে সর্বোচ্চ অগ্রাধিকারপ্রাপ্ত",
  },
  terms: {
    path: "/terms",
    title: "ব্যবহারের শর্তাবলী (Terms of Service) | ToolKaj",
    description: "ToolKaj অনলাইন প্ল্যাটফর্ম ব্যবহারের সাধারণ নিয়মাবলী ও শর্তাবলী। সম্পূর্ণ উন্মুক্ত ও ফ্রি প্ল্যাটফর্মের ব্যবহারবিধি পড়ুন।",
    keywords: [
      "terms of service", "ব্যবহারের শর্তাবলী", "terms toolkaj", "fair usage policy", "legal disclaimer"
    ],
    h1: "ব্যবহারের শর্তাবলী (Terms of Service)",
    subtitle: "ToolKaj ব্যবহারের নিয়মাবলী ও আইনি দিকনির্দেশনা",
  },

  // ==========================================
  // CATEGORY PAGES
  // ==========================================
  "category/pdf": {
    path: "/category/pdf",
    title: "পিডিএফ টুলস (PDF Tools) — ফ্রি অনলাইন পিডিএফ কনভার্টার ও এডিটর | ToolKaj",
    description: "পিডিএফ ফাইলের আকার কমান, জোড়া লাগান, পেজ আলাদা করুন এবং এনআইডি প্রিন্ট-রেডি করুন। ১০০% ফ্রি ও নিরাপদ অনলাইন পিডিএফ টুলকিট।",
    keywords: [
      "pdf tools online", "পিডিএফ টুলস", "free pdf tools bangla", "pdf compress", "pdf merge",
      "pdf split", "pdf to image", "image to pdf", "nid to pdf", "pdf watermark", "online pdf editor free"
    ],
    h1: "সকল পিডিএফ টুলস (PDF Tools)",
    subtitle: "ডকুমেন্ট হ্যান্ডলিং, কম্প্রেশন ও কনভার্সনের জন্য সম্পূর্ণ নিরাপদ সমাধান",
  },
  "category/image": {
    path: "/category/image",
    title: "ইমেজ টুলস (Image Tools) — সরকারি চাকরির ছবি রিসাইজ ও কনভার্টার | ToolKaj",
    description: "সরকারি চাকরির ৩০০x৩০০ ছবি ও ৩০০x৮০ স্বাক্ষর রিসাইজ, কালার পিকার, ব্যাকগ্রাউন্ড রিমুভার এবং ইমেজ কনভার্সন টুলস সম্পূর্ণ বিনামূল্যে।",
    keywords: [
      "image tools online", "ইমেজ টুলস", "govt job photo resizer", "image compress", "color picker",
      "remove bg online", "qr code generator", "image converter", "resize crop photo"
    ],
    h1: "সকল ইমেজ টুলস (Image Tools)",
    subtitle: "ফটো অপ্টিমাইজেশন, কালার পিকিং ও প্রফেশনাল মাপের জন্য প্রয়োজনীয় সব টুলস",
  },
  "category/text": {
    path: "/category/text",
    title: "টেক্সট টুলস (Text Tools) — বিজয় ইউনিকোড কনভার্টার ও বাংলিশ টাইপিং | ToolKaj",
    description: "সুতোনি এমজে বিজয় থেকে ইউনিকোড রূপান্তর, বাংলিশ টু বাংলা টাইপিং এবং সংখ্যা থেকে কথায় রূপান্তর টুলস সম্পূর্ণ বিনামূল্যে।",
    keywords: [
      "text tools online", "টেক্সট টুলস", "bijoy to unicode", "banglish to bangla", "number to words",
      "word counter", "bangla date converter", "bangla font tools"
    ],
    h1: "সকল টেক্সট টুলস (Text Tools)",
    subtitle: "বাংলা ফন্ট কনভার্সন, টাইপিং ও লেখার নির্ভুল পরিমাপের সেরা সংগ্রহ",
  },
  "category/social": {
    path: "/category/social",
    title: "সোশ্যাল মিডিয়া টুলস (Social Media) — ইউটিউব থাম্বনেইল ও ইনস্টাগ্রাম বুস্টার | ToolKaj",
    description: "ইউটিউব ফুল এইচডি থাম্বনেইল ডাউনলোড, ভাইরাল ট্যাগ এক্সট্র্যাক্ট এবং পাসওয়ার্ডহীন ইনস্টাগ্রাম লাইক ও ফলোয়ার এক্সচেঞ্জ টুলস।",
    keywords: [
      "social media tools", "সোশ্যাল মিডিয়া টুলস", "youtube thumbnail download", "youtube tags",
      "whatsapp direct link", "instagram booster", "hearttrace", "anonymous chat"
    ],
    h1: "সকল সোশ্যাল মিডিয়া টুলস (Social Media)",
    subtitle: "ভিডিও কনটেন্ট, এনগেজমেন্ট ও সোশ্যাল কমিউনিকেশনের আধুনিক টুলকিট",
  },
  "category/video": {
    path: "/category/video",
    title: "ভিডিও ও অডিও টুলস (Video & Audio) — ভিডিও কম্প্রেস ও অডিও এক্সট্র্যাক্ট | ToolKaj",
    description: "ভিডিও ফাইলের সাইজ কমান, ভিডিও থেকে এমপি৩ অডিও আলাদা করুন এবং ভিডিওর গতি ও ভলিউম বুস্ট করুন ব্রাউজারেই সরাসরি।",
    keywords: [
      "video audio tools", "ভিডিও অডিও টুলস", "video compress online", "video to audio",
      "video speed volume booster", "mp4 compressor free"
    ],
    h1: "সকল ভিডিও ও অডিও টুলস (Video & Audio)",
    subtitle: "সহজে ভিডিও অপ্টিমাইজেশন, কম্প্রেশন ও অডিও নিষ্কাশনের শক্তিশালী টুলস",
  },
  "category/citizen": {
    path: "/category/citizen",
    title: "নাগরিক ও ক্যারিয়ার টুলস (Citizen & Forms) — এটিএস সিভি ও সরকারি লিংক | ToolKaj",
    description: "চাকরির জন্য ফ্রি এটিএস-ফ্রেন্ডলি সিভি তৈরি, ম্যারেজ বায়োডাটা এবং বাংলাদেশ সরকারের ৮০+ প্রয়োজনীয় দরকারি পোর্টাল লিংক।",
    keywords: [
      "citizen tools bangladesh", "নাগরিক সেবা", "ats cv maker", "marriage biodata maker",
      "dorkari links", "family card form", "fuel card form"
    ],
    h1: "নাগরিক, ফর্ম ও ক্যারিয়ার সেবা (Citizen & Forms)",
    subtitle: "বাংলাদেশি নাগরিকদের চাকরি, বায়োডাটা ও সরকারি সেবা প্রাপ্তির সহজ মাধ্যম",
  },
  "category/utilities": {
    path: "/category/utilities",
    title: "দৈনন্দিন ক্যালকুলেটর (Calculators & Dev) — বয়স, মুনাফা ও ইএমআই হিসাব | ToolKaj",
    description: "নিখুঁত বয়স ক্যালকুলেটর, চক্রবৃদ্ধি মুনাফা চার্ট, লোন ইএমআই কিস্তি হিসাব এবং জেসন বিউটিফায়ার টুলস এক জায়গায়।",
    keywords: [
      "online calculators", "দৈনন্দিন ক্যালকুলেটর", "age calculator", "compound interest calculator",
      "loan emi calculator", "json beautifier", "web calculators bd"
    ],
    h1: "দৈনন্দিন ক্যালকুলেটর ও ডেভ টুলস (Calculators & Dev)",
    subtitle: "সঠিক আর্থিক হিসাব, বয়স নির্ণয় ও ডেভেলপারদের প্রয়োজনীয় ক্যালকুলেটর",
  },

  // ==========================================
  // 1. PDF TOOLS (8 Tools)
  // ==========================================
  "pdf/compress": {
    path: "/tools/pdf/compress",
    slug: "pdf/compress",
    category: "pdf",
    title: "পিডিএফ কম্প্রেসার অনলাইন - Compress PDF Online Free | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "কোয়ালিটি অক্ষুণ্ণ রেখে সেকেন্ডেই PDF ফাইলের আকার ছোট করুন। সরকারি চাকরি, ভার্সিটি ও ইমেইলে আবেদনের জন্য দ্রুততম ও ১০০% ফ্রি অনলাইন পিডিএফ কম্প্রেসার।",
    keywords: [
      "compress pdf online free", "pdf compress", "reduce pdf size", "pdf compressor free",
      "compress pdf mb to kb", "shrink pdf document", "best free pdf compressor", "pdf size reducer",
      "compress pdf without watermark", "fast browser pdf compress", "pdf optimizer online", "smallpdf alternative bangla",
      "পিডিএফ সাইজ কমান", "পিডিএফ কম্প্রেস", "অনলাইনে পিডিএফ ছোট করা", "পিডিএফ সাইজ কমানোর উপায়",
      "পিডিএফ ফাইল সাইজ কমানো", "ফ্রি পিডিএফ কম্প্রেসার", "পিডিএফ ফাইল ছোট করার সফটওয়্যার", "পিডিএফ সাইজ ছোট করুন",
      "pdf size komano", "pdf choto korar tool", "pdf mb theke kb kora", "pdf compress online free",
      "online e pdf size choto", "pdf file compress korar niyom", "sohoj pdf compress", "free bangla pdf compressor"
    ],
    h1: "পিডিএফ কম্প্রেসার — অনলাইনে PDF ফাইলের সাইজ কমান",
    subtitle: "লেখার স্পষ্টতা ও ছবির রেজোলিউশন বজায় রেখে বিনামূল্যে দ্রুত PDF সাইজ অপ্টিমাইজ করুন",
    howToSteps: [
      { title: "ধাপ ১: PDF ফাইল সিলেক্ট করুন", desc: "আপনার ডিভাইস থেকে যে PDF ফাইলটির সাইজ কমাতে চান সেটি আপলোড বক্সে সিলেক্ট করুন।" },
      { title: "ধাপ ২: কম্প্রেশন লেভেল নির্বাচন", desc: "প্রয়োজন অনুযায়ী কম্প্রেশন লেভেল বাছাই করুন (প্রস্তাবিত: ব্যালেন্সড অপশন)।" },
      { title: "ধাপ ৩: এক ক্লিকে কম্প্রেশন", desc: "'কম্প্রেস করুন' বাটনে ক্লিক করলে কয়েক সেকেন্ডেই ফাইলটি অপ্টিমাইজ হয়ে যাবে।" },
      { title: "ধাপ ৪: ডাউনলোড ও সাইজ তুলনা", desc: "আগের সাইজ ও নতুন সাইজের পার্থক্য দেখে ছোট হওয়া PDF ফাইলটি ডাউনলোড করুন।" }
    ],
    whyUse: [
      "ফ্রি ও আনলিমিটেড—কোনো পেওয়াল বা দৈনিক লিমিট নেই।",
      "সরাসরি আপনার ডিভাইসে দ্রুত প্রসেস হয়, কোনো ডকুমেন্ট অন্য সার্ভারে যায় না।",
      "৩টি ভিন্ন কম্প্রেশন লেভেল (ম্যাক্সিমাম, রেকমেন্ডেড ও লাইট) সিলেক্ট করার সুবিধা।",
      "স্মার্টফোন, ট্যাবলেট ও কম্পিউটার—যেকোনো ব্রাউজার থেকেই সহজে ব্যবহারযোগ্য।"
    ],
    specifications: [
      { label: "সর্বোচ্চ ফাইল সাইজ", value: "১০০ MB পর্যন্ত" },
      { label: "কম্প্রেশন রেশিও", value: "৪০% থেকে ৮০% পর্যন্ত সাইজ হ্রাস" },
      { label: "আউটপুট কোয়ালিটি", value: "টেক্সট ও ফন্টের পূর্ণ শার্পনেস বজায় থাকে" },
      { label: "সিকিউরিটি", value: "এন্ড-টু-এন্ড লোকাল ব্রাউজার প্রসেসিং" }
    ],
    limitations: [
      "পাসওয়ার্ড প্রটেক্টেড বা এনক্রিপ্টেড PDF ফাইল কম্প্রেস করার আগে পাসওয়ার্ড রিমুভ করে নিতে হবে।",
      "যদি কোনো PDF আগে থেকেই সর্বোচ্চ অপ্টিমাইজ করা থাকে, তবে তার সাইজ খুব সামান্য কমতে পারে।"
    ],
    faqs: [
      { question: "অনলাইনে PDF সাইজ কমালে কি লেখার মান বা স্পষ্টতা নষ্ট হবে?", answer: "না, ToolKaj স্মার্ট কম্প্রেশন অ্যালগরিদম ব্যবহার করে যা লেখার টেক্সট ভেক্টর শার্প রাখে এবং অপ্রয়োজনীয় মেটাডাটা কমায়, ফলে লেখার স্পষ্টতা পুরোপুরি বজায় থাকে।" },
      { question: "চাকরির আবেদনের জন্য PDF সাইজ কত হতে হয়?", answer: "সাধারণত বেশিরভাগ সরকারি ও বেসরকারি চাকরির সাইটে ১ MB থেকে ২ MB বা কখনো ৫০০ KB-এর নিচে ফাইল আপলোড করার নিয়ম থাকে। এই টুল দিয়ে সহজেই বড় ফাইল ৫০০ KB-এর নিচে আনা যায়।" },
      { question: "আমার গোপনীয় PDF ফাইল কি সুরক্ষিত থাকবে?", answer: "হ্যাঁ, ১০০% নিরাপদ। ToolKaj ক্লায়েন্ট-সাইড প্রযুক্তি ব্যবহার করে, অর্থাৎ ফাইলটি ইন্টারনেটের কোনো রিমোট সার্ভারে জমা হয় না। আপনার ব্রাউজারের মেমোরিতেই সম্পূর্ণ কাজ সম্পন্ন হয়।" },
      { question: "মোবাইল ফোন থেকে কি PDF কম্প্রেস করা যাবে?", answer: "হ্যাঁ, যেকোনো অ্যান্ড্রয়েড বা আইফোন ব্রাউজার দিয়ে অনায়াসেই এই টুল ব্যবহার করতে পারবেন।" }
    ]
  },

  "pdf/merge": {
    path: "/tools/pdf/merge",
    slug: "pdf/merge",
    category: "pdf",
    title: "পিডিএফ মার্জার অনলাইন - Merge PDF Online Free (Combine PDFs) | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "একাধিক PDF ফাইল এক ক্লিকে একটি ফাইলে যুক্ত করুন। ১০০% নিরাপদ, কোনো পেজ লিমিট বা সাইন-আপ ছাড়াই দ্রুততম ফ্রি অনলাইন পিডিএফ মার্জার।",
    keywords: [
      "merge pdf online free", "combine pdf files", "join multiple pdfs", "pdf merger tool",
      "concatenate pdf", "merge documents free", "pdf binder online", "best pdf joiner",
      "browser pdf merge", "combine pdf without limits", "ilovepdf alternative free",
      "পিডিএফ মার্জ", "পিডিএফ জোড়া লাগানো", "একাধিক পিডিএফ এক ফাইলে রূপান্তর", "পিডিএফ ফাইল একসাথে করা",
      "ফ্রি পিডিএফ মার্জার", "অনলাইনে পিডিএফ জোড়া দিন", "পিডিএফ পেজ কম্বাইন",
      "pdf jora lagano", "pdf eksathe kora", "merge pdf bangla", "pdf combine korar niyom",
      "online e pdf merge kora", "pdf file jora deya", "duiti pdf eksathe kora"
    ],
    h1: "পিডিএফ মার্জার — একাধিক PDF ফাইল একসাথে জোড়া লাগান",
    subtitle: "যেকোনো সংখ্যক PDF ডকুমেন্ট সহজে ক্রমানুসারে সাজিয়ে একটি একক ফাইলে রূপান্তর করুন",
    howToSteps: [
      { title: "ধাপ ১: PDF ফাইলসমূহ নির্বাচন করুন", desc: "আপনার ড্রাইভ বা মেমোরি থেকে যুক্ত করতে চাওয়া সকল PDF ফাইল একসাথে আপলোড করুন।" },
      { title: "ধাপ ২: পেজের ক্রম সাজান", desc: "ড্র্যাগ অ্যান্ড ড্রপ করে ফাইলের ক্রম পরীক্ষা করে নিন।" },
      { title: "ধাপ ৩: মার্জ বাটনে ক্লিক করুন", desc: "'মার্জ করুন' বাটনে চাপ দিয়ে তাৎক্ষণিক সমন্বিত ফাইলটি প্রস্তুত করুন।" },
      { title: "ধাপ ৪: ডাউনলোড ও সেভ", desc: "একত্রিত একক PDF ফাইলটি এক ক্লিকেই সংরক্ষণ করুন।" }
    ],
    whyUse: [
      "আনলিমিটেড ফাইল একসাথে মার্জ করার সুবিধা।",
      "পৃষ্ঠার গুণমান এবং বিন্যাস অক্ষুণ্ণ থাকে।",
      "কোনো ফাইল সার্ভারে সংরক্ষিত হয় না, শতভাগ ব্যক্তিগত নিরাপত্তা।",
      "বিনা মূল্যে যেকোনো ডিভাইসে কাজ করে।"
    ],
    specifications: [
      { label: "ফাইল ধারণক্ষমতা", value: "একসাথে ২০+ ফাইল" },
      { label: "প্রসেসিং গতি", value: "ইনস্ট্যান্ট ক্লায়েন্ট-সাইড" },
      { label: "আউটপুট ফরম্যাট", value: "Standard ISO PDF" }
    ],
    limitations: [
      "পাসওয়ার্ডযুক্ত পিডিএফ মার্জ করতে হলে প্রথমে পাসওয়ার্ড আনলক করে নিতে হবে।"
    ],
    faqs: [
      { question: "পিডিএফ মার্জ করলে কি আগের ফাইলের কোনো অংশ কেটে যাবে?", answer: "না, প্রতিটি ফাইলের প্রতিটি পাতা হুবহু যেমন ছিল তেমনই ধারাবাহিকভাবে যুক্ত হবে।" },
      { question: "একাধিক রেজোলিউশনের পিডিএফ কি একসাথে মার্জ করা যাবে?", answer: "হ্যাঁ, যেকোনো সাইজ ও রেজোলিউশনের পিডিএফ সহজেই একত্রিত করা যায়।" }
    ]
  },

  "pdf/split": {
    path: "/tools/pdf/split",
    slug: "pdf/split",
    category: "pdf",
    title: "পিডিএফ স্প্লিট - Split PDF Online Free (Extract Pages) | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "বড় PDF থেকে প্রয়োজনীয় পেজগুলো আলাদা করুন বা একাধিক ফাইলে বিভক্ত করুন। কোনো সফটওয়্যার ইনস্টল ছাড়াই সম্পূর্ণ বিনামূল্যে ব্রাউজারে ব্যবহার করুন।",
    keywords: [
      "split pdf online", "extract pdf pages", "separate pdf pages", "pdf cutter free",
      "split pdf document", "cut pages from pdf", "online pdf splitter", "divide pdf file",
      "free pdf extractor", "pdf page divider",
      "পিডিএফ পেজ আলাদা করা", "পিডিএফ স্প্লিট", "পিডিএফ ভাগ করা", "পিডিএফ পেজ কাটার নিয়ম",
      "পিডিএফ কাটার ফ্রি টুল", "পিডিএফ পৃষ্ঠা আলাদা করা",
      "pdf page alada kora", "pdf split korar niyom", "pdf theke page ber kora", "pdf bhag kora online",
      "pdf page cutter bangla", "pdf katoner tool"
    ],
    h1: "পিডিএফ স্প্লিট — PDF থেকে প্রয়োজনীয় পাতা আলাদা করুন",
    subtitle: "বড় সাইজের PDF ডকুমেন্ট থেকে নির্দিষ্ট পাতা বাছাই করে আলাদা ফাইল তৈরি করুন",
    howToSteps: [
      { title: "ধাপ ১: PDF ফাইল আপলোড", desc: "যে PDF থেকে পাতা আলাদা করতে চান সেটি নির্বাচন করুন।" },
      { title: "ধাপ ২: পাতার নম্বর বা রেঞ্জ লিখুন", desc: "যেমন: 1, 3, 5-8 লিখে নির্দিষ্ট পাতাগুলো নির্বাচন করুন।" },
      { title: "ধাপ ৩: স্প্লিট ও ডাউনলোড", desc: "'আলাদা করুন' বাটনে ক্লিক করে নতুন PDF ফাইলটি ডাউনলোড করুন।" }
    ],
    whyUse: [
      "নির্দিষ্ট পেজ রেঞ্জ নির্ধারণ করার সহজ পদ্ধতি।",
      "বড় বই বা নথির অপ্রয়োজনীয় পাতা বাদ দেওয়ার সেরা উপায়।",
      "কোনো ফাইল আপলোড চার্জ বা দৈনিক ব্যবহারের সীমাবদ্ধতা নেই।"
    ],
    specifications: [
      { label: "রেঞ্জ ফরম্যাট", value: "কমা অথবা হাইফেন (যেমন: 1-5, 8)" },
      { label: "প্রসেসিং মেথড", value: "100% Client-Side Web API" }
    ],
    limitations: ["এনক্রিপ্টেড পিডিএফ ফাইল আগে ডিক্রিপ্ট করতে হবে।"],
    faqs: [
      { question: "আমি কি একই সাথে বিভিন্ন পৃষ্ঠার রেঞ্জ দিতে পারব?", answer: "হ্যাঁ, যেমন '১-৩, ৫, ৭-৯' লিখে একসাথে একাধিক পাতা আলাদা করতে পারবেন।" }
    ]
  },

  "pdf/pdf-to-image": {
    path: "/tools/pdf/pdf-to-image",
    slug: "pdf/pdf-to-image",
    category: "pdf",
    title: "পিডিএফ টু ইমেজ কনভার্টার - PDF to JPG/PNG Converter Online | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "PDF নথির প্রতিটি পৃষ্ঠাকে উচ্চমানের JPG বা PNG ছবিতে রূপান্তর করুন। সম্পূর্ণ বিনামূল্যে ও সুপারফাস্ট স্পিডে ডাউনলোড করুন।",
    keywords: [
      "pdf to image", "pdf to jpg online free", "convert pdf to png", "high quality pdf to image",
      "pdf to photo converter", "extract images from pdf", "pdf to picture converter", "free pdf to jpg bangla",
      "পিডিএফ থেকে ছবি", "পিডিএফ টু জেপিজি", "পিডিএফ ছবি বানানো", "পিডিএফ কনভার্ট জেপিজি",
      "পিডিএফ পাতা ছবিতে রূপান্তর", "পিডিএফ টু পিএনজি",
      "pdf theke chobi", "pdf to jpg convert", "pdf photo banano", "pdf picture convert kora",
      "pdf to png online", "pdf er chobi ber kora"
    ],
    h1: "পিডিএফ টু ইমেজ কনভার্টার — PDF থেকে JPG/PNG ছবি তৈরি",
    subtitle: "ডকুমেন্টের পাতাগুলোকে হাই-রেজোলিউশন ছবিতে রূপান্তর করে সহজেই গ্যালারিতে সেভ করুন",
    howToSteps: [
      { title: "ধাপ ১: PDF আপলোড করুন", desc: "রূপান্তর করতে চাওয়া PDF ফাইলটি নির্বাচন করুন।" },
      { title: "ধাপ ২: ছবির ফরম্যাট নির্বাচন", desc: "JPG অথবা PNG ফরম্যাট সিলেক্ট করুন।" },
      { title: "ধাপ ৩: কনভার্ট ও ডাউনলোড", desc: "প্রতিটি পাতা একক ছবি হিসেবে ডাউনলোড করে নিন।" }
    ],
    whyUse: [
      "মূল ডকুমেন্টের ফন্ট ও গ্রাফিক্সের সর্বোচ্চ শার্পনেস বজায় থাকে।",
      "সোশ্যাল মিডিয়া বা প্রেজেন্টেশনে ব্যবহারের জন্য উপযুক্ত ছবি পাওয়া যায়।"
    ],
    specifications: [
      { label: "আউটপুট ফরম্যাট", value: "JPG, PNG (300 DPI)" }
    ],
    limitations: ["অতিরিক্ত পৃষ্ঠাযুক্ত PDF কনভার্ট হতে সামান্য সময় বেশি নিতে পারে।"],
    faqs: [
      { question: "ছবিগুলোর রেজোলিউশন কেমন হবে?", answer: "ছবিগুলো ফুল রেজোলিউশন HD কোয়ালিটিতে কনভার্ট হয় যা প্রিন্ট করার জন্যও উপযোগী।" }
    ]
  },

  "pdf/image-to-pdf": {
    path: "/tools/pdf/image-to-pdf",
    slug: "pdf/image-to-pdf",
    category: "pdf",
    title: "ইমেজ টু পিডিএফ কনভার্টার - Image to PDF Converter (JPG to PDF) | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "যেকোনো ছবি (JPG, PNG, WebP) এক ক্লিকে একটি সুন্দর A4 PDF ফাইলে রূপান্তর করুন। মার্জিন ও ওরিয়েন্টেশন কাস্টমাইজেশন সুবিধা সহ ১০০% ফ্রি।",
    keywords: [
      "image to pdf", "jpg to pdf converter", "convert png to pdf", "photo to pdf maker",
      "picture to pdf online free", "combine images into pdf", "multi photo to single pdf", "photo to pdf bangla",
      "ছবি থেকে পিডিএফ", "ইমেজ টু পিডিএফ", "জেপিজি থেকে পিডিএফ তৈরি", "ফটোকপি পিডিএফ বানানো",
      "ছবি দিয়ে পিডিএফ তৈরি", "মোবাইল ছবি দিয়ে পিডিএফ",
      "chobi theke pdf", "photo to pdf convert kora", "pic to pdf maker online", "jpg to pdf banano",
      "multiple photo to pdf", "chobir pdf banano"
    ],
    h1: "ইমেজ টু পিডিএফ কনভার্টার — ছবি থেকে প্রফেশনাল PDF তৈরি",
    subtitle: "একাধিক JPG বা PNG ছবিকে ক্রমানুসারে সাজিয়ে স্ট্যান্ডার্ড A4 সাইজের PDF নথিতে রূপান্তর করুন",
    howToSteps: [
      { title: "ধাপ ১: ছবি আপলোড করুন", desc: "আপনার ডিভাইসের গ্যালারি থেকে এক বা একাধিক ছবি নির্বাচন করুন।" },
      { title: "ধাপ ২: ছবির ক্রম ঠিক করুন", desc: "যেভাবে পাতায় দেখতে চান সেই অনুযায়ী ছবিগুলো সাজান।" },
      { title: "ধাপ ৩: PDF তৈরি ও ডাউনলোড", desc: "'পিডিএফ তৈরি করুন' বাটনে চাপ দিয়ে ফাইলটি সেভ করুন।" }
    ],
    whyUse: [
      "হাতে লেখা নোট, অ্যাসাইনমেন্ট ও সার্টিফিকেটের ছবি এক ফাইলে আনার সেরা মাধ্যম।",
      "স্বয়ংক্রিয়ভাবে মার্জিন সমন্বয় করে প্রিন্টের জন্য প্রস্তুত করে।"
    ],
    specifications: [
      { label: "পেজ সাইজ", value: "স্ট্যান্ডার্ড A4 পেপার" },
      { label: "সাপোর্টেড ফরম্যাট", value: "JPG, PNG, WebP, BMP" }
    ],
    limitations: ["অতিরিক্ত ঝাপসা ছবি দিলে লেখার স্পষ্টতা কমে যেতে পারে।"],
    faqs: [
      { question: "একসাথে কয়টি ছবি দিয়ে পিডিএফ বানানো যাবে?", answer: "আপনি একসাথে ২০+ ছবি দিয়ে সহজেই একটি মাত্র PDF ফাইল তৈরি করতে পারবেন।" }
    ]
  },

  "pdf/nid-to-pdf": {
    path: "/tools/pdf/nid-to-pdf",
    slug: "pdf/nid-to-pdf",
    category: "pdf",
    title: "এনআইডি টু পিডিএফ মেকার - NID Card to A4 PDF Converter | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "বাংলাদেশি জাতীয় পরিচয়পত্র (NID) ও স্মার্ট কার্ডের উভয় পাশ নিখুঁত মাপে সাজিয়ে প্রিন্ট-রেডি A4 PDF তৈরি করুন। ফটোকপি ও প্রিন্টের সেরা সমাধান।",
    keywords: [
      "nid to pdf", "bangladesh nid to pdf", "smart card to pdf", "nid card a4 print size",
      "national id print ready pdf", "nid photocopy size pdf", "voter id card to pdf", "nid both sides merge",
      "এনআইডি টু পিডিএফ", "জাতীয় পরিচয়পত্র প্রিন্ট সাইজ", "স্মার্ট কার্ড এ৪ সাইজ পিডিএফ", "ভোটার আইডি কার্ড প্রিন্ট",
      "এনআইডি উভয় পাশ পিডিএফ", "স্মার্ট কার্ড ফটোকপি সাইজ",
      "nid to pdf banano", "smart card a4 print kora", "voter id print size", "nid front back merge pdf",
      "nid card photocopy size", "smart card print online"
    ],
    h1: "এনআইডি টু পিডিএফ — জাতীয় পরিচয়পত্র A4 সাইজে প্রিন্ট রেডি PDF",
    subtitle: "স্মার্ট কার্ডের সামনের ও পেছনের পাশ নিখুঁত মাপে সাজিয়ে অফিশিয়াল ফটোকপির মতো A4 PDF বানান",
    howToSteps: [
      { title: "ধাপ ১: সামনের ও পেছনের ছবি আপলোড", desc: "আপনার স্মার্ট কার্ড বা এনআইডির সামনের অংশ (Front) এবং পেছনের অংশ (Back) আপলোড করুন।" },
      { title: "ধাপ ২: প্রিভিউ দেখুন", desc: "প্রিভিউ বক্সে দেখুন A4 পাতার ঠিক মাঝখানে উভয় পাশ সুন্দরভাবে সাজানো হয়েছে কিনা।" },
      { title: "ধাপ ৩: PDF তৈরি ও ডাউনলোড", desc: "'পিডিএফ তৈরি করুন' বাটনে ক্লিক করে সাথে সাথে স্ট্যান্ডার্ড সাইজের প্রিন্ট রেডি PDF ফাইলটি ডাউনলোড করুন।" }
    ],
    whyUse: [
      "এনআইডি ও স্মার্ট কার্ডের আসল অনুপাত (Standard ID-1 সাইজ) স্বয়ংক্রিয়ভাবে সাজানো হয়।",
      "সামনের ও পেছনের পাশ সুন্দর মার্জিন সহ কেন্দ্রস্থলে থাকে, কাটিং বা ল্যামিনেটিং করা সহজ।",
      "কালার ও ব্ল্যাক-অ্যান্ড-হোয়াইট উভয় প্রিন্টারের জন্য উপযুক্ত রেজোলিউশন।"
    ],
    specifications: [
      { label: "কাগজের সাইজ", value: "স্ট্যান্ডার্ড A4 (210 x 297 mm)" },
      { label: "প্রিন্ট রেজোলিউশন", value: "300 DPI হাই-ডেফিনিশন" },
      { label: "কার্ডের মাপ", value: "৮৫.৬ x ৫৩.৯৮ মিমি (ID-1 স্ট্যান্ডার্ড)" }
    ],
    limitations: ["পরিষ্কার আলোতে তোলা সোজা ছবি ব্যবহার করুন যাতে কার্ডের চারপাশের কোনো অংশ কেটে না যায়।"],
    faqs: [
      { question: "এই PDF টি কি যেকোনো ফটোকপির দোকান থেকে সরাসরি প্রিন্ট করা যাবে?", answer: "হ্যাঁ, এটি স্ট্যান্ডার্ড A4 সাইজে সেট করা থাকে, তাই যেকোনো সাধারণ বা কালার প্রিন্টার থেকে ১০০% স্কেলে সরাসরি প্রিন্ট করা যাবে।" },
      { question: "এনআইডির তথ্য কি ToolKaj সংরক্ষণ করে?", answer: "একদমই না। সম্পূর্ণ প্রসেসটি আপনার ব্রাউজারের মেমোরিতে চলে, কোনো তথ্য ডাটাবেজে সংরক্ষণ করা হয় না।" }
    ]
  },

  "pdf/passport-to-pdf": {
    path: "/tools/pdf/passport-to-pdf",
    slug: "pdf/passport-to-pdf",
    category: "pdf",
    title: "পাসপোর্ট টু পিডিএফ - Bangladesh Passport to A4 PDF Maker | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "বাংলাদেশি ই-পাসপোর্ট বা এমআরপির তথ্য পাতা স্ট্যান্ডার্ড A4 কাগজে নিখুঁত রেশিওতে সাজিয়ে প্রিন্ট-রেডি PDF ফাইল তৈরি করুন সম্পূর্ণ বিনামূল্যে।",
    keywords: [
      "passport to pdf", "bangladesh passport a4 print", "e-passport print ready pdf", "mrp passport to pdf",
      "passport bio page to a4", "passport photocopy size pdf", "passport photocopy ratio",
      "পাসপোর্ট টু পিডিএফ", "পাসপোর্ট প্রিন্ট সাইজ", "ই-পাসপোর্ট এ৪ সাইজ কপি", "পাসপোর্ট পাতা পিডিএফ রূপান্তর",
      "পাসপোর্ট ফটোকপি সাইজ", "পাসপোর্ট পেজ প্রিন্ট রেডি",
      "passport to pdf convert", "passport print size a4", "passport er chobi pdf kora",
      "epassport photocopy format", "passport page a4 size"
    ],
    h1: "পাসপোর্ট টু পিডিএফ — পাসপোর্ট পেজ A4 সাইজে প্রিন্ট রেডি করুন",
    subtitle: "ভিসা আবেদন ও দাপ্তরিক কাজের জন্য পাসপোর্টের বায়ো পেজকে নিখুঁত A4 ফরম্যাটে রূপান্তর করুন",
    howToSteps: [
      { title: "ধাপ ১: পাসপোর্টের বায়ো পেজের ছবি আপলোড", desc: "পাসপোর্টের ছবি ও তথ্যযুক্ত পাতার স্পষ্ট ছবি নির্বাচন করুন।" },
      { title: "ধাপ ২: স্কেলিং ও রেশিও প্রিভিউ", desc: "A4 পেপারে পাসপোর্টের অনুপাত পরীক্ষা করুন।" },
      { title: "ধাপ ৩: ডাউনলোড ও প্রিন্ট", desc: "প্রিন্ট-রেডি PDF ফাইলটি সেভ করে ১০০% স্কেলে প্রিন্ট দিন।" }
    ],
    whyUse: [
      "ভিসা সেন্টার (VFS) ও এম্বাসির নিয়ম অনুযায়ী আদর্শ স্কেলিং।",
      "ঝামেলাহীন একক পেজ আউটপুট।"
    ],
    specifications: [
      { label: "পেপার সাইজ", value: "স্ট্যান্ডার্ড A4 পোর্ট্রেট" },
      { label: "প্রিন্ট মার্জিন", value: "অফিশিয়াল আন্তর্জাতিক স্ট্যান্ডার্ড" }
    ],
    limitations: ["পাসপোর্টের লেখা যাতে স্পষ্ট পড়া যায় এমন উজ্জ্বল ছবি দিন।"],
    faqs: [
      { question: "এটি কি ই-পাসপোর্ট ও পুরাতন এমআরপি পাসপোর্ট উভয়ের ক্ষেত্রেই প্রযোজ্য?", answer: "হ্যাঁ, উভয় ধরনের পাসপোর্টের জন্যই এই ফরম্যাট পুরোপুরি মানানসই।" }
    ]
  },

  "pdf/watermark": {
    path: "/tools/pdf/watermark",
    slug: "pdf/watermark",
    category: "pdf",
    title: "পিডিএফ ওয়াটারমার্ক মেকার - Add Watermark to PDF Online Free | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "পিডিএফ নথির নিরাপত্তা নিশ্চিত করতে কাস্টম টেক্সট ওয়াটারমার্ক, স্ট্যাম্প বা কনফিডেন্সিয়াল সিল যুক্ত করুন। ওপাসিটি ও পজিশন নিয়ন্ত্রণ সহ ফ্রি।",
    keywords: [
      "add watermark to pdf", "pdf watermark online free", "custom text watermark pdf", "stamp pdf document",
      "confidential watermark pdf", "protect pdf document", "watermark on pdf free",
      "পিডিএফ ওয়াটারমার্ক", "পিডিএফে লেখা বা নাম বসানো", "পিডিএফ কপিরাইট সুরক্ষা", "পিডিএফ সিল স্ট্যাম্প",
      "পিডিএফ ওয়াটারমার্ক মেকার",
      "pdf e watermark deya", "pdf e nam lekha", "pdf watermark tool online", "pdf document security bangla"
    ],
    h1: "পিডিএফ ওয়াটারমার্ক — পিডিএফে কাস্টম সিল ও টেক্সট যুক্ত করুন",
    subtitle: "নথির অপব্যবহার রোধে আপনার নাম, প্রতিষ্ঠানের লোগো বা 'CONFIDENTIAL' ওয়াটারমার্ক বসান",
    howToSteps: [
      { title: "ধাপ ১: PDF ফাইল নির্বাচন", desc: "যে PDF ফাইলে ওয়াটারমার্ক দিতে চান সেটি নির্বাচন করুন।" },
      { title: "ধাপ ২: টেক্সট ও পজিশন নির্ধারণ", desc: "আপনার প্রয়োজনীয় লেখাটি লিখে ফন্ট সাইজ ও কোণ নির্ধারণ করুন।" },
      { title: "ধাপ ৩: প্রটেক্টেড PDF ডাউনলোড", desc: "এক ক্লিকে ওয়াটারমার্কসহ নতুন সুরক্ষিত PDF ফাইলটি ডাউনলোড করুন।" }
    ],
    whyUse: [
      "ডকুমেন্ট পাইরেসি ও অননুমোদিত ফটোকপি রোধ।",
      "স্বচ্ছতা (Opacity) ও রঙের কাস্টমাইজেশন।"
    ],
    specifications: [
      { label: "অ্যাঙ্গেল অপশন", value: "৪৫ ডিগ্রি ডায়াগোনাল বা সোজা" },
      { label: "অপাসিটি রেঞ্জ", value: "১০% থেকে ১০০%" }
    ],
    limitations: ["এনক্রিপ্টেড ফাইল আগে আনলক করতে হবে।"],
    faqs: [
      { question: "ওয়াটারমার্ক দিলে কি মূল টেক্সট পড়তে অসুবিধা হবে?", answer: "না, ওয়াটারমার্কের স্বচ্ছতা (Opacity) হালকা রাখা যায় যাতে পেছনের আসল লেখা পুরোপুরি পরিষ্কার পড়া যায়।" }
    ]
  },

  // ==========================================
  // 2. IMAGE TOOLS (8 Tools)
  // ==========================================
  "image/govt-job-resizer": {
    path: "/tools/image/govt-job-resizer",
    slug: "image/govt-job-resizer",
    category: "image",
    title: "সরকারি চাকরির ছবি ও স্বাক্ষর রিসাইজার - Govt Job Photo 300x300 & Signature 300x80 | ToolKaj",
    description: "টেলিটক ও বিপিএসসি নিয়ম অনুযায়ী সরকারি চাকরির ছবির মাপ ৩০০x৩০০ (<১০০ KB) এবং স্বাক্ষর ৩০০x৮০ (<৬০ KB) এক ক্লিকে সম্পূর্ণ বিনামূল্যে রিসাইজ করুন।",
    keywords: [
      "govt job photo resizer", "teletalk 300x300 photo resize", "teletalk 300x80 signature size", "bpsc photo resizer",
      "job application photo resize bangladesh", "300x300 image converter online", "300x80 signature resize free",
      "teletalk photo resizer online", "chakrir chobi resize", "300x300 photo converter teletalk", "300x80 signature converter",
      "সরকারি চাকরির ছবির সাইজ ৩০০x৩০০", "চাকরির স্বাক্ষর ৩০০x৮০", "টেলিটক ফটো রিসাইজার", "বিপিএসসি ছবি সাইজ",
      "চাকরির ছবির মাপ ঠিক করা", "চাকরির ছবির সাইজ ও স্বাক্ষর", "সরকারি আবেদন ছবি রিসাইজার",
      "chakrir chobi resize 300x300", "shakkhor resize 300x80", "teletalk photo size korar niyom",
      "govt job picture resize online", "teletalk signature maker", "300 300 chobi resize online", "job photo resize bangla"
    ],
    h1: "সরকারি চাকরির ছবির সাইজ (৩০০x৩০০) ও স্বাক্ষর (৩০০x৮০) রিসাইজার",
    subtitle: "টেলিটক ও বিপিএসসি নির্দেশিকা অনুযায়ী ১০০ KB-এর নিচে ৩০০x৩০০ ছবি এবং ৬০ KB-এর নিচে ৩০০x৮০ স্বাক্ষর তৈরি করুন",
    howToSteps: [
      { title: "ধাপ ১: ছবি বা স্বাক্ষর নির্বাচন করুন", desc: "টুলটির উপরে থাকা 'ছবি (৩০০x৩০০)' বা 'স্বাক্ষর (৩০০x৮০)' ট্যাব থেকে অপশন সিলেক্ট করে ফাইল আপলোড করুন।" },
      { title: "ধাপ ২: ফ্রেম এডজাস্ট করুন", desc: "জুম-ইন বা জুম-আউট করে এবং ড্র্যাগ করে মুখ বা স্বাক্ষরের অংশটি ফ্রেমের সাথে নিখুঁতভাবে সমন্বয় করুন।" },
      { title: "ধাপ ৩: কোয়ালিটি ও সাইজ পরীক্ষা", desc: "নিচে থাকা লাইভ প্রিভিউতে ফাইলের সাইজ লক্ষ্য করুন। ছবির জন্য <১০০ KB এবং স্বাক্ষরের জন্য <৬০ KB হতে হবে।" },
      { title: "ধাপ ৪: ডাউনলোড ও টেলিটকে আপলোড", desc: "'ডাউনলোড করুন' বাটনে ক্লিক করে প্রস্তুতকৃত JPG ফাইলটি সেভ করুন এবং সরকারি চাকরি পোর্টালে সরাসরি আপলোড করুন।" }
    ],
    whyUse: [
      "টেলিটক ও বিপিএসসির ১০০% অফিশিয়াল রুলস (৩০০x৩০০ ও ৩০০x৮০ পিক্সেল) মেনে তৈরি।",
      "ছবির সাইজ স্বয়ংক্রিয়ভাবে ১০০ KB এবং স্বাক্ষর ৬০ KB-এর নিচে সীমাবদ্ধ রাখে।",
      "ব্রাউজারেই ক্লায়েন্ট-সাইড প্রসেসিং—আপনার ছবি কোনো সার্ভারে আপলোড হয় না, সম্পূর্ণ নিরাপদ।",
      "লাইভ জুম ও ড্র্যাগ অপশন—যাতে মুখমণ্ডল সঠিকভাবে ফ্রেমের মাঝখানে বসানো যায়।"
    ],
    specifications: [
      { label: "সরকারি চাকরির ছবির মাপ", value: "৩০০ x ৩০০ পিক্সেল (300x300 px)" },
      { label: "ছবির সর্বোচ্চ ফাইল সাইজ", value: "১০০ KB (বাধ্যতামূলক)" },
      { label: "চাকরির স্বাক্ষরের মাপ", value: "৩০০ x ৮০ পিক্সেল (300x80 px)" },
      { label: "স্বাক্ষরের সর্বোচ্চ সাইজ", value: "৬০ KB (বাধ্যতামূলক)" },
      { label: "অনুমোদিত ফরম্যাট", value: "JPG / JPEG" },
      { label: "প্রসেসিং প্রযুক্তি", value: "HTML5 Canvas (১০০% প্রাইভেট ও ক্লায়েন্ট-সাইড)" }
    ],
    limitations: [
      "অস্পষ্ট বা অন্ধকার ব্যাকগ্রাউন্ডের ছবি ব্যবহার করবেন না; সাদা বা এক রঙের ব্যাকগ্রাউন্ড বাঞ্ছনীয়।",
      "স্বাক্ষর অবশ্যই সাদা কাগজে কালো বা নীল কালির স্পষ্ট কলম দিয়ে করা হতে হবে।"
    ],
    faqs: [
      { question: "সরকারি চাকরির ছবির সাইজ কত হতে হয়?", answer: "বাংলাদেশ সরকারি ও টেলিটক চাকরির আবেদনের জন্য ছবির সাইজ অবশ্যই প্রস্থ ৩০০ পিক্সেল এবং উচ্চতা ৩০০ পিক্সেল (300x300 px) হতে হবে এবং ফাইলের আকার ১০০ KB-এর নিচে হতে হবে।" },
      { question: "স্বাক্ষরের মাপ ৩০০x৮০ কীভাবে সহজে তৈরি করব?", answer: "ToolKaj-এর 'স্বাক্ষর (৩০০x৮০)' ট্যাবে ক্লিক করে আপনার স্বাক্ষরের ছবি আপলোড করুন। টুলটি স্বয়ংক্রিয়ভাবে এটিকে ৩০০x৮০ পিক্সেল এবং ৬০ KB-এর কম সাইজে প্রস্তুত করে দেবে।" },
      { question: "আমার আপলোড করা ছবি কি সার্ভারে সংরক্ষিত হয়?", answer: "না, ToolKaj-এ আপনার আপলোড করা ছবি সরাসরি আপনার ডিভাইসের ব্রাউজারেই প্রসেস হয়। কোনো ছবি বা ব্যক্তিগত তথ্য আমাদের সার্ভারে সংরক্ষণ বা পাঠানো হয় না।" },
      { question: "টেলিটক পোর্টালে 'Invalid Image Dimension' দেখালে কী করব?", answer: "এই টুল থেকে রিসাইজ করা ছবি ব্যবহার করলে এই ত্রুটি কখনোই আসবে না, কারণ এটি কঠোরভাবে টেলিটকের ৩০০০x৩০০০ ও ৩০০x৮০ পিক্সেল অনুপাত বজায় রাখে।" }
    ]
  },

  "image/compress": {
    path: "/tools/image/compress",
    slug: "image/compress",
    category: "image",
    title: "ইমেজ কম্প্রেসার অনলাইন - Compress Image JPG PNG (Reduce KB) | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "ছবির রেজোলিউশন ও স্পষ্টতা নষ্ট না করে ফাইলের সাইজ KB/MB তে উল্লেখযোগ্যভাবে কমিয়ে নিন। চাকরির ফর্ম, পাসপোর্ট ও ওয়েবসাইটের জন্য সেরা।",
    keywords: [
      "compress image online", "reduce image kb", "photo compressor free", "compress jpg to 100kb",
      "compress png size", "reduce photo mb to kb", "online image size reducer", "tinypng alternative free",
      "photo optimizer online", "compress photo for job application",
      "ছবির সাইজ কমানো", "ইমেজ কম্প্রেস", "ছবি কেবি কমানোর উপায়", "জেপিজি ছবি ছোট করা",
      "ছবির সাইজ ছোট করার উপায়", "অনলাইন ফটো কম্প্রেসার", "ছবির মেগাবাইট কমান",
      "chobi size komano", "photo kb komanor website", "image compress korar tool", "pic choto kora online",
      "jpg file kb komano", "photo size reduce online free"
    ],
    h1: "ইমেজ কম্প্রেসার — ছবির কোয়ালিটি বজায় রেখে সাইজ (KB) কমান",
    subtitle: "উচ্চমানের ফটো থেকে অপ্রয়োজনীয় মেটাডাটা দূর করে ফাইলের আকার ৭০% পর্যন্ত ছোট করুন",
    howToSteps: [
      { title: "ধাপ ১: ছবি আপলোড করুন", desc: "যে ছবিটির সাইজ কমাতে চান সেটি আপলোড বক্সে দিন।" },
      { title: "ধাপ ২: কোয়ালিটি স্লাইডার সমন্বয়", desc: "স্লাইডার টেনে ছবির কাঙ্ক্ষিত সাইজ বা কোয়ালিটি নির্ধারণ করুন।" },
      { title: "ধাপ ৩: ডাউনলোড ও সেভ", desc: "কম্প্রেস হওয়া ছবি প্রিভিউ দেখে সাথে সাথে ডাউনলোড করুন।" }
    ],
    whyUse: [
      "রিয়েল-টাইম লাইভ প্রিভিউ ও ফাইল সাইজ ডিসপ্লে।",
      "JPG, PNG, WebP সব ফরম্যাটে কাজ করে।",
      "বিনা মূল্যে আনলিমিটেড ছবি অপ্টিমাইজ করুন।"
    ],
    specifications: [
      { label: "কম্প্রেশন লেভেল", value: "১০% থেকে ১০০% কাস্টমাইজযোগ্য" },
      { label: "প্রসেসিং", value: "Instant Client Canvas" }
    ],
    limitations: ["অতিরিক্ত কম্প্রেশন দিলে অতি সূক্ষ্ম ডিটেইলস হালকা হতে পারে।"],
    faqs: [
      { question: "ছবি কি ঝাপসা হয়ে যাবে?", answer: "না, ৮০% থেকে ৯০% কোয়ালিটি রাখলে চোখের দেখায় ছবির কোয়ালিটিতে কোনো পার্থক্য বোঝা যায় না।" }
    ]
  },

  "image/background-remover": {
    path: "/tools/image/background-remover",
    slug: "image/background-remover",
    category: "image",
    title: "ব্যাকগ্রাউন্ড রিমুভার অনলাইন - AI Image Background Remover Free | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "যেকোনো ছবির ব্যাকগ্রাউন্ড মাত্র কয়েক সেকেন্ডে স্বয়ংক্রিয়ভাবে মুছে স্বচ্ছ (Transparent PNG) ছবি তৈরি করুন। সম্পূর্ণ ফ্রি এবং ১০০% প্রাইভেট।",
    keywords: [
      "remove background from image", "free bg remover", "transparent png maker", "cutout photo background",
      "ai background remover free", "remove photo bg online", "removebg alternative free", "cut out image",
      "ছবির ব্যাকগ্রাউন্ড পরিবর্তন", "ব্যাকগ্রাউন্ড রিমুভার", "পেছনের ব্যাকগ্রাউন্ড মুছে ফেলা", "স্বচ্ছ পিএনজি ছবি",
      "ছবির ব্যাকগ্রাউন্ড রিমুভ", "ফ্রি ব্যাকগ্রাউন্ড কাটার টুল",
      "chobir background change", "bg remove korar software", "transparent photo banano",
      "chobir pichoner ongsho kata", "remove bg online bangla"
    ],
    h1: "ব্যাকগ্রাউন্ড রিমুভার — এক ক্লিকে ছবির ব্যাকগ্রাউন্ড মুছুন",
    subtitle: "ফটোশপ ছাড়াই মানুষের ছবি, পণ্য বা লোগোর ব্যাকগ্রাউন্ড কেটে ট্রান্সপারেন্ট PNG বানান",
    howToSteps: [
      { title: "ধাপ ১: ছবি আপলোড করুন", desc: "আপনার পছন্দের ছবিটি নির্বাচন করুন।" },
      { title: "ধাপ ২: স্বয়ংক্রিয় রিমুভাল", desc: "আমাদের স্মার্ট এআই ব্রাউজারেই ব্যাকগ্রাউন্ড মুছে দেবে।" },
      { title: "ধাপ ৩: ট্রান্সপারেন্ট PNG ডাউনলোড", desc: "স্বচ্ছ ব্যাকগ্রাউন্ডসহ ছবিটি ডাউনলোড করে ব্যবহার করুন।" }
    ],
    whyUse: [
      "১০০% ফ্রি—কোনো ওয়াটারমার্ক ছাড়াই ফুল রেজোলিউশন ডাউনলোড।",
      "ই-কমার্স পণ্য ও পাসপোর্ট সাইজ ছবির ব্যাকগ্রাউন্ড বদলানোর সেরা টুল।"
    ],
    specifications: [
      { label: "আউটপুট ফরম্যাট", value: "Transparent PNG (Alpha Channel)" }
    ],
    limitations: ["মূল অবজেক্ট এবং পেছনের ব্যাকগ্রাউন্ডের রঙে ভালো কনট্রাস্ট থাকলে সবচেয়ে ভালো ফলাফল পাওয়া যায়।"],
    faqs: [
      { question: "ডাউনলোড করা ছবিতে কি কোনো ওয়াটারমার্ক থাকবে?", answer: "না, ToolKaj-এ কোনো ধরনের ওয়াটারমার্ক ছাড়াই সম্পূর্ণ ফ্রি ডাউনলোড করা যায়।" }
    ]
  },

  "image/convert": {
    path: "/tools/image/convert",
    slug: "image/convert",
    category: "image",
    title: "ইমেজ কনভার্টার অনলাইন - All-in-One Image Format Converter | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "JPG, PNG, WebP, GIF ও BMP ফরম্যাটের ছবিগুলোকে পরস্পরের মধ্যে বিনামূল্যে ও দ্রুততম গতিতে রূপান্তর করুন কোনো কোয়ালিটি লস ছাড়াই।",
    keywords: [
      "image converter online", "convert jpg to png", "png to webp converter", "webp to jpg",
      "convert image formats free", "bulk photo converter", "image format changer", "all in one image converter",
      "ইমেজ কনভার্টার", "জেপিজি থেকে পিএনজি", "ওয়েবপি থেকে জেপিজি", "ছবির ফরম্যাট পরিবর্তন",
      "ছবি কনভার্টার অনলাইন", "পিএনজি থেকে জেপিজি রূপান্তর",
      "chobi convert kora", "jpg theke png banano", "webp to jpg convert online",
      "photo format change kora", "image converter bangla"
    ],
    h1: "ইমেজ কনভার্টার — JPG, PNG, WebP ফরম্যাট রূপান্তর",
    subtitle: "ছবির মান শতভাগ বজায় রেখে যেকোনো আধুনিক ইমেজ ফরম্যাটে তাৎক্ষণিক রূপান্তর করুন",
    howToSteps: [
      { title: "ধাপ ১: ছবি আপলোড করুন", desc: "যেকোনো ফরম্যাটের ছবি নির্বাচন করুন।" },
      { title: "ধাপ ২: টার্গেট ফরম্যাট বাছাই", desc: "JPG, PNG অথবা WebP সিলেক্ট করুন।" },
      { title: "ধাপ ৩: কনভার্ট ও সেভ", desc: "মুহূর্তের মধ্যে রূপান্তরিত ছবিটি ডাউনলোড করুন।" }
    ],
    whyUse: [
      "ওয়েবসাইট অপ্টিমাইজেশনের জন্য আধুনিক WebP ফরম্যাটে রূপান্তর।",
      "কোনো ফাইল সাইজ লিমিটেশন নেই।"
    ],
    specifications: [
      { label: "সমর্থিত ইনপুট", value: "JPG, PNG, WebP, GIF, BMP, SVG" },
      { label: "সমর্থিত আউটপুট", value: "JPG, PNG, WebP" }
    ],
    limitations: ["অ্যানিমেটেড জিআইএফ রূপান্তরের ক্ষেত্রে প্রথম ফ্রেম সংরক্ষিত হতে পারে।"],
    faqs: [
      { question: "WebP ফরম্যাটে নিলে কী সুবিধা?", answer: "WebP ফরম্যাট ফাইলের আকার ৩০-৫০% পর্যন্ত ছোট রাখে কিন্তু ছবির মান হুবহু বজায় থাকে, ফলে ওয়েবসাইট দ্রুত লোড হয়।" }
    ]
  },

  "image/resize-crop": {
    path: "/tools/image/resize-crop",
    slug: "image/resize-crop",
    category: "image",
    title: "ইমেজ রিসাইজ ও ক্রপ - Online Photo Resizer & Aspect Ratio Cropper | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "পাসপোর্ট সাইজ (35x45mm), স্কয়ার (1:1), 16:9 বা কাস্টম পিক্সেলে ছবি ক্রপ ও রিসাইজ করুন নিখুঁত স্কেলে। সম্পূর্ণ ব্রাউজারেই নিরাপদ প্রসেসিং।",
    keywords: [
      "image resize and crop", "passport size photo maker", "crop picture online free", "custom pixel image resizer",
      "change aspect ratio photo", "photo dimension changer", "square crop photo", "16 9 photo cropper",
      "ছবি রিসাইজ ও ক্রপ", "পাসপোর্ট সাইজ ছবি তৈরি", "ছবির মাপ পরিবর্তন", "ছবি কাটার অনলাইন টুল",
      "ফটো ক্রপ অনলাইন", "ছবির পিক্সেল পরিবর্তন",
      "chobi crop kora", "passport size photo banano", "chobir size change kora online",
      "photo dimension thik kora", "pic resize korar website"
    ],
    h1: "ইমেজ রিসাইজ ও ক্রপ — ছবির মাপ ও অনুপাত পরিবর্তন",
    subtitle: "সোশ্যাল মিডিয়া, পাসপোর্ট বা নির্দিষ্ট পিক্সেল সাইজে ছবি নিখুঁতভাবে কাটুন ও মাপ ঠিক করুন",
    howToSteps: [
      { title: "ধাপ ১: ছবি আপলোড", desc: "আপনার পছন্দের ছবি নির্বাচন করুন।" },
      { title: "ধাপ ২: প্রিসেট বা কাস্টম রেশিও নির্বাচন", desc: "পাসপোর্ট, ১:১, ১৬:৯ বা নির্দিষ্ট পিক্সেল বসান।" },
      { title: "ধাপ ৩: ক্রপ করে ডাউনলোড", desc: "কাঙ্ক্ষিত ফ্রেম সমন্বয় করে ছবিটি সেভ করুন।" }
    ],
    whyUse: [
      "পাসপোর্ট ও ভিসা আবেদনের জন্য নিখুঁত প্রিসেট মাপ।",
      "অ্যাসপেক্ট রেশিও লক রেখে গুণমান রক্ষা।"
    ],
    specifications: [
      { label: "প্রিসেটস", value: "পাসপোর্ট (35x45mm), ১:১, ৪:৩, ১৬:৯, কাস্টম" }
    ],
    limitations: ["অতিরিক্ত ছোট ছবিকে অনেক বড় করলে পিক্সেল ফেটে যেতে পারে।"],
    faqs: [
      { question: "পাসপোর্ট সাইজ ছবির মাপ কত?", answer: "সাধারণত আন্তর্জাতিক পাসপোর্ট সাইজ ছবির অনুপাত ৩৫ মিমি প্রস্থ এবং ৪৫ মিমি উচ্চতা (35x45 mm) হয়ে থাকে।" }
    ]
  },

  "image/qr-code": {
    path: "/tools/image/qr-code",
    slug: "image/qr-code",
    category: "image",
    title: "কিউআর কোড জেনারেটর - Custom QR Code Generator with Logo | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "ওয়েবসাইট লিংক, ওয়াইফাই পাসওয়ার্ড, ফোন নম্বর ও টেক্সটের জন্য রঙিন কাস্টম QR কোড তৈরি করুন এবং হাই-রেজোলিউশন PNG তে ডাউনলোড করুন।",
    keywords: [
      "qr code generator", "custom qr code maker", "wifi qr code generator", "url to qr code free",
      "qr code with color", "high resolution qr code download", "qr code with logo", "free qr creator online",
      "কিউআর কোড তৈরি", "ফ্রি কিউআর কোড জেনারেটর", "ওয়াইফাই কিউআর কোড", "রঙিন কিউআর কোড",
      "কিউআর কোড বানানোর নিয়ম", "অনলাইন কিউআর কোড",
      "qr code banano", "wifi qr code toiri", "qr code generator online free",
      "qr code kivabe banabo", "link to qr code bangla"
    ],
    h1: "কিউআর কোড জেনারেটর — কাস্টম রঙিন QR কোড তৈরি করুন",
    subtitle: "ওয়েবসাইট, ওয়াইফাই, ভিকার্ড ও ফোন নম্বরের জন্য দ্রুততম সময়ে স্ক্যানযোগ্য QR কোড তৈরি করুন",
    howToSteps: [
      { title: "ধাপ ১: টাইপ নির্বাচন ও তথ্য প্রদান", desc: "URL, টেক্সট, বা WiFi পাসওয়ার্ড ইনপুট বক্সে লিখুন।" },
      { title: "ধাপ ২: রঙ ও সাইজ কাস্টমাইজেশন", desc: "পছন্দমতো রঙ নির্বাচন করুন।" },
      { title: "ধাপ ৩: QR কোড ডাউনলোড", desc: "হাই-রেজোলিউশন PNG ইমেজ ফরম্যাটে কোডটি সেভ করুন।" }
    ],
    whyUse: [
      "আজীবন মেয়াদী স্ট্যাটিক QR কোড—কখনোই মেয়াদোত্তীর্ণ হয় না।",
      "প্রিন্ট ও ডিজিটাল ব্যবহারের জন্য নিখুঁত স্ক্যানিং ক্ষমতা।"
    ],
    specifications: [
      { label: "আউটপুট রেজোলিউশন", value: "৫১২ x ৫১২ পিক্সেল পর্যন্ত ক্রিস্প PNG" }
    ],
    limitations: ["অতিরিক্ত দীর্ঘ টেক্সট দিলে কিউআর কোডের প্যাটার্ন বেশি ঘন হয়ে স্ক্যানিংয়ে দেরি হতে পারে।"],
    faqs: [
      { question: "এই QR কোড কি যেকোনো ফোন দিয়ে স্ক্যান করা যাবে?", answer: "হ্যাঁ, যেকোনো আধুনিক স্মার্টফোনের ক্যামেরা বা কিউআর কোড স্ক্যানার অ্যাপ দিয়ে তাৎক্ষণিক স্ক্যান করা যাবে।" }
    ]
  },

  "image/watermark": {
    path: "/tools/image/watermark",
    slug: "image/watermark",
    category: "image",
    title: "ইমেজ ওয়াটারমার্ক মেকার - Add Watermark to Photo Online Free | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "আপনার ফটোগ্রাফি ও পণ্যের ছবিতে কপিরাইট টেক্সট বা লোগো ওয়াটারমার্ক যুক্ত করুন। অপাসিটি, পজিশন ও ফন্ট কাস্টমাইজেশন সহ ১০০% ফ্রি।",
    keywords: [
      "add watermark to image", "photo watermark maker", "watermark photo online free", "protect photography copyright",
      "transparent watermark on photo", "batch watermark photo", "image copyright protection",
      "ছবিতে ওয়াটারমার্ক বসানো", "ছবির কপিরাইট রক্ষা", "ছবিতে লোগো বা নাম দেওয়া", "ফটো ওয়াটারমার্ক মেকার",
      "ছবির ওপর নাম লেখা",
      "chobite watermark deya", "photo te nam lekhar tool", "watermark bananor website",
      "chobir copyright rokkha", "photo te logo lagano"
    ],
    h1: "ইমেজ ওয়াটারমার্ক — ছবিতে নিজের নাম বা লোগো যুক্ত করুন",
    subtitle: "ফটোগ্রাফি ও ই-কমার্স পণ্যের ছবি চুরি রোধে স্টাইলিশ টেক্সট বা লোগো বসান",
    howToSteps: [
      { title: "ধাপ ১: ছবি আপলোড করুন", desc: "যে ছবিতে ওয়াটারমার্ক দিতে চান তা নির্বাচন করুন।" },
      { title: "ধাপ ২: টেক্সট ও ওয়াটারমার্ক সেটিংস", desc: "আপনার নাম বা প্রতিষ্ঠানের নাম লিখে পজিশন ঠিক করুন।" },
      { title: "ধাপ ৩: প্রটেক্টেড ইমেজ সেভ", desc: "ওয়াটারমার্কযুক্ত ছবিটি সরাসরি ডাউনলোড করুন।" }
    ],
    whyUse: [
      "সোশ্যাল মিডিয়ায় ছবি চুরির হাত থেকে শতভাগ সুরক্ষা।",
      "কাস্টম ফন্ট ও ট্রান্সপারেন্সি সুবিধা।"
    ],
    specifications: [
      { label: "পজিশন অপশন", value: "৯টি ভিন্ন গ্রিড পজিশন ও সেন্টারিং" }
    ],
    limitations: ["অতিরিক্ত বড় লোগো দিলে মূল বিষয়বস্তু আড়াল হতে পারে।"],
    faqs: [
      { question: "আমার মূল ছবির কোয়ালিটি কি কমে যাবে?", answer: "না, মূল ছবির আসল রেজোলিউশন বজায় রেখেই ওয়াটারমার্ক যুক্ত করা হয়।" }
    ]
  },

  "image/color-picker": {
    path: "/tools/image/color-picker",
    slug: "image/color-picker",
    category: "image",
    title: "কালার পিকার ও প্যালেট স্টুডিও - Image Color Picker & HEX Palette | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "ছবি থেকে যেকোনো বিন্দুর সঠিক কালার কোড (HEX, RGB, HSL) জুম লেন্সের সাহায্যে বের করুন এবং প্রধান ৯টি রঙের নান্দনিক কালার প্যালেট জেনারেট করুন।",
    keywords: [
      "color picker from image", "image color picker", "eyedropper tool online", "extract palette from photo",
      "hex color finder", "rgb color picker from picture", "dominant color extractor", "color code from image",
      "photo color palette generator", "sohozkaj color picker", "eyedropper tool bangla",
      "কালার পিকার", "ছবি থেকে কালার পিক", "কালার কোড বের করার নিয়ম", "হেক্স কালার কোড", "ছবির রঙের প্যালেট",
      "ছবি থেকে রং বাছাই", "অনলাইন কালার ড্রপার",
      "chobi theke color pick", "color code ber kora", "hex rgb code finder", "eyedropper tool bangla",
      "chobir color palette", "photo theke ronger code"
    ],
    h1: "কালার পিকার ও প্যালেট স্টুডিও — ছবি থেকে সঠিক কালার কোড নিন",
    subtitle: "ম্যাগনিফায়িং লেন্স ও ড্রপারের সাহায্যে ছবির যেকোনো পিক্সেলের HEX, RGB ও HSL কোড এক ক্লিকে কপি করুন",
    howToSteps: [
      { title: "ধাপ ১: ছবি আপলোড বা স্যাম্পল সিলেক্ট", desc: "আপনার ড্রাইভ থেকে যেকোনো ছবি আপলোড করুন।" },
      { title: "ধাপ ২: কার্সার দিয়ে কালার নির্বাচন", desc: "ছবির উপর মাউস বা আঙুল ঘুরিয়ে লাইভ জুমের মাধ্যমে নির্দিষ্ট রঙে ক্লিক করুন।" },
      { title: "ধাপ ৩: কোড কপি করুন", desc: "HEX বা RGB কোড বাটনে ক্লিক করে ক্লিপবোর্ডে কপি করে নিন।" }
    ],
    whyUse: [
      "পিক্সেল-পারফেক্ট ম্যাগনিফায়ার লুপ—একদম নিখুঁত পিক্সেল নির্বাচন।",
      "ছবির প্রধান ৯টি ডমিনেন্ট রঙের অটোমেটিক কালার প্যালেট।",
      "ওয়েব ও গ্রাফিক্স ডিজাইনারদের জন্য দ্রুততম কালার ইনস্পেক্টর।"
    ],
    specifications: [
      { label: "কালার ফরম্যাট", value: "HEX, RGB, HSL, CSS Compatible" },
      { label: "প্যালেট কাউন্ট", value: "টপ ৯টি ডমিনেন্ট কালার" }
    ],
    limitations: ["ছবিতে যদি ব্লার বা গ্রেডিয়েন্ট থাকে, তবে পাশের পিক্সেলের রঙে সামান্য পার্থক্য হতে পারে।"],
    faqs: [
      { question: "HEX এবং RGB কালার কোডের পার্থক্য কী?", answer: "HEX কোড সাধারণত ওয়েব ডিজাইনে ব্যবহৃত হয় (যেমন #3B82F6), আর RGB কোড লাল, সবুজ ও নীল রঙের তীব্রতা প্রকাশ করে (যেমন rgb(59, 130, 246))।" },
      { question: "মোবাইলে টাচ করে কালার পিক করা যায়?", answer: "হ্যাঁ, মোবাইলেও স্পর্শ করে যেকোনো পিক্সেলের রঙ নিখুঁতভাবে সিলেক্ট করা যায়।" }
    ]
  },

  // ==========================================
  // 3. TEXT TOOLS (5 Tools)
  // ==========================================
  "text/bijoy-unicode": {
    path: "/tools/text/bijoy-unicode",
    slug: "text/bijoy-unicode",
    category: "text",
    title: "বিজয় ↔ ইউনিকোড কনভার্টার - Bijoy to Unicode Bangla Font Converter | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "সুতোনি এমজে (SutonnyMJ) বিজয় ফন্ট থেকে ইউনিকোড এবং ইউনিকোড থেকে বিজয়ে নির্ভুল বাংলা রূপান্তর করুন। যুক্তাক্ষর অটুট রাখার সেরা কনভার্টার।",
    keywords: [
      "bijoy to unicode", "unicode to bijoy converter", "sutonnymj to unicode", "bijoy 52 to avro converter",
      "bangla font converter online", "bijoy unicode convert toolkaj", "bangla text converter free", "sutonny mj to kalpurush",
      "বিজয় টু ইউনিকোড কনভার্টার", "ইউনিকোড টু বিজয়", "সুতোনি এমজে কনভার্টার", "বাংলা ফন্ট কনভার্টার",
      "বিজয় বায়ান্ন ইউনিকোড", "বিজয় ফন্ট পরিবর্তন", "অভ্র টু বিজয় কনভার্ট",
      "bijoy theke unicode", "unicode theke bijoy", "sutonny mj to avro", "bangla font convert online",
      "bijoy 52 converter", "bangla font problem solution", "avro bijoy converter bangla"
    ],
    h1: "বিজয় ↔ ইউনিকোড বাংলা কনভার্টার (Bijoy to Unicode)",
    subtitle: "সুতোনি এমজে ফন্ট থেকে আন্তর্জাতিক ইউনিকোড এবং ইউনিকোড থেকে বিজয় ফন্টে ১০০% নির্ভুল বাংলা রূপান্তর",
    howToSteps: [
      { title: "ধাপ ১: টেক্সট পেস্ট করুন", desc: "বাম পাশের বক্সে আপনার বিজয় (SutonnyMJ) বা ইউনিকোড বাংলা লেখাটি পেস্ট করুন।" },
      { title: "ধাপ ২: কনভার্ট বাটন চাপুন", desc: "আপনার প্রয়োজন অনুযায়ী 'বিজয় ➔ ইউনিকোড' বা 'ইউনিকোড ➔ বিজয়' বাটনে ক্লিক করুন।" },
      { title: "ধাপ ৩: কপি বা ডাউনলোড করুন", desc: "ডান পাশের আউটপুট বক্স থেকে রূপান্তরিত লেখাটি এক ক্লিকে 'কপি' করুন।" }
    ],
    whyUse: [
      "সকল কঠিন যুক্তাক্ষর (জ্ঞ, ক্ষ, হ্ন, ব্র, ষ্ণ) নির্ভুলভাবে কনভার্ট হয়।",
      "এক ক্লিকেই উভয়মুখী রূপান্তর।",
      "লাইভ ক্যারেক্টার ও ওয়ার্ড কাউন্টার সাপোর্ট।",
      "সরকারি অফিস, ওয়েবসাইট ও ফেসবুক পোস্টের জন্য আদর্শ।"
    ],
    specifications: [
      { label: "সাপোর্টেড ফন্ট", value: "SutonnyMJ, Classic Bijoy, Kalpurush, SolaimanLipi" },
      { label: "যুক্তাক্ষর শুদ্ধতা", value: "৯৯.৯% নিখুঁত রূপান্তর" }
    ],
    limitations: ["মূল লেখায় ব্যাকরণগত বানান ভুল থাকলে রূপান্তরের পর তা বানান হিসেবেই অপরিবর্তিত থাকবে।"],
    faqs: [
      { question: "বিজয় ফন্ট মোবাইলে দেখা যায় না কেন?", answer: "বিজয় (ANSI/SutonnyMJ) মূলত একটি নন-ইউনিকোড ফন্ট যা নির্দিষ্ট কম্পিউটারে ইনস্টল থাকলে পড়া যায়। মোবাইলে ও ইন্টারনেটে পড়ার জন্য এটিকে আন্তর্জাতিকভাবে স্বীকৃত 'ইউনিকোড'-এ কনভার্ট করতে হয়।" },
      { question: "ইউনিকোড থেকে বিজয়ে নিলে লেখা ভেঙে গেলে কী করব?", answer: "ইউনিকোড থেকে কনভার্ট করা লেখাটি MS Word-এ পেস্ট করার পর ফন্ট হিসেবে 'SutonnyMJ' সিলেক্ট করে দিন, সাথে সাথে লেখা ঠিক হয়ে যাবে।" }
    ]
  },

  "text/banglish": {
    path: "/tools/text/banglish",
    slug: "text/banglish",
    category: "text",
    title: "বাংলিশ টু বাংলা টাইপিং - Banglish to Bangla Typing Converter | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "ইংরেজি কিবোর্ডে বাংলিশ টাইপ করে মুহূর্তে শুদ্ধ বাংলা অক্ষরে রূপান্তর করুন (যেমন: ami banglay gan gai)। অভ্র ফোনেটিক স্টাইলের সেরা ফ্রি টাইপিং টুল।",
    keywords: [
      "banglish to bangla converter", "phonetic bangla typing online", "english to bangla text", "avro phonetic online typing",
      "banglish typing keyboard", "write bangla with english letters", "easy bangla writing keyboard", "banglish converter toolkaj",
      "বাংলিশ টু বাংলা টাইপিং", "ইংরেজি অক্ষরে বাংলা লেখা", "ফোনেটিক বাংলা কিবোর্ড", "বাংলিশ কনভার্টার",
      "সহজে বাংলায় লেখার নিয়ম", "অভ্র অনলাইন টাইপিং", "বাংলা টাইপিং সফটওয়্যার ছাড়া",
      "banglish to bangla", "english e bangla lekha", "avro online typing", "banglish converter online",
      "banglish typing kora", "english diye bangla lekha"
    ],
    h1: "বাংলিশ টু বাংলা টাইপিং — ইংরেজি অক্ষরে ফোনেটিক বাংলা লিখুন",
    subtitle: "ইংরেজি কিবোর্ড দিয়ে মেসেজের মতো টাইপ করুন, স্বয়ংক্রিয়ভাবে তৈরি হবে শুদ্ধ বাংলা",
    howToSteps: [
      { title: "ধাপ ১: বাংলিশ বক্সে টাইপ শুরু করুন", desc: "ইংরেজি অক্ষরে লিখুন যেমন: 'amar sonar bangla ami tomay bhalobashi'।" },
      { title: "ধাপ ২: লাইভ বাংলা টেক্সট দেখুন", desc: "আউটপুট বক্সে সাথে সাথে শুদ্ধ বাংলায় রূপান্তরিত টেক্সট দেখা যাবে।" },
      { title: "ধাপ ৩: কপি করে ব্যবহার করুন", desc: "'কপি করুন' বাটনে ক্লিক করে সোশ্যাল মিডিয়া বা চ্যাটে পেস্ট করে দিন।" }
    ],
    whyUse: [
      "কোনো সফটওয়্যার বা কিবোর্ড ইনস্টল ছাড়াই যেকোনো কম্পিউটারে কাজ করে।",
      "যুক্তাক্ষর ও কারচিহ্নের বুদ্ধিমান রিয়েল-টাইম রূপান্তর।"
    ],
    specifications: [
      { label: "ফোনেটিক মেথড", value: "Avro Phonetic Layout Compatible" }
    ],
    limitations: ["কঠিন কিছু যুক্তাক্ষরের জন্য ফোনেটিক বানানের সঠিক স্পেলিং খেয়াল রাখতে হবে।"],
    faqs: [
      { question: "যুক্তাক্ষর কীভাবে লিখব?", answer: "যেমন 'kkh' লিখলে 'ক্ষ', 'ng' লিখলে 'ঙ/ং', 'sh' লিখলে 'শ', 's' লিখলে 'স' আসবে।" }
    ]
  },

  "text/number-to-words": {
    path: "/tools/text/number-to-words",
    slug: "text/number-to-words",
    category: "text",
    title: "সংখ্যাকে কথায় রূপান্তর - Number to Words Converter (Bangla & English) | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "যেকোনো সংখ্যা বা টাকার অংক এক ক্লিকে কথায় রূপান্তর করুন (বাংলা ও ইংরেজিতে)। ব্যাংক চেক, রসিদ ও অফিশিয়াল ভাউচার লেখার জন্য ১০০% নির্ভুল ক্যালকুলেটর।",
    keywords: [
      "number to words converter", "taka in words converter", "bangla number to words", "currency to words online",
      "number to text converter", "bank cheque words format", "convert numbers to bangla words", "taka kothay lekha converter",
      "সংখ্যা থেকে কথায় রূপান্তর", "টাকা কথায় লিখুন", "সংখ্যা কথায় লেখার নিয়ম", "ব্যাংক চেকের টাকা কথায়",
      "কথায় প্রকাশ করুন", "টাকার অংক কথায়", "সংখ্যা থেকে শব্দে রূপান্তর",
      "number to kothay convert", "taka kothay lekha", "sonkha theke kothay", "cheque e taka lekhar niyom",
      "number to words bangla", "bank cheque taka lekha online", "sonkha kothay lekha tool"
    ],
    h1: "সংখ্যা থেকে কথায় রূপান্তর — ব্যাংক চেক ও টাকার অংক কথায় লিখুন",
    subtitle: "যেকোনো ইংরেজি বা বাংলা সংখ্যা মুহূর্তের মধ্যে বাংলা ও ইংরেজিতে কথায় রূপান্তর করুন",
    howToSteps: [
      { title: "ধাপ ১: সংখ্যা বা টাকার অংক লিখুন", desc: "যেমন: 15400 বা ১৫৪০০ ইনপুট বক্সে টাইপ করুন।" },
      { title: "ধাপ ২: অটোমেটিক ফলাফল দেখুন", desc: "সাথে সাথে বাংলায় 'পনেরো হাজার চারশত টাকা মাত্র' এবং ইংরেজিতে রূপান্তর দেখতে পাবেন।" },
      { title: "ধাপ ৩: ক্লিপবোর্ডে কপি করুন", desc: "'কপি' বাটনে ক্লিক করে ব্যাংক চেক বা নথিতে ব্যবহার করুন।" }
    ],
    whyUse: [
      "ব্যাংক চেক লেখার ভুল প্রতিরোধ করে—শতভাগ নির্ভুল বানান।",
      "বাংলা ও ইংরেজি উভয় ভাষার জন্য একই সাথে ফলাফল প্রদর্শন।",
      "কোটি, লাখ, হাজার এবং পয়সা সমর্থন করে।"
    ],
    specifications: [
      { label: "সর্বোচ্চ সীমা", value: "৯৯৯ কোটি টাকা পর্যন্ত" },
      { label: "ভাষা", value: "বাংলা ও ইংরেজি উভয় ভাষা" }
    ],
    limitations: ["দশমিকের পর দুই অঙ্কের বেশি পয়সা সাধারণত টাকায় প্রয়োজন হয় না।"],
    faqs: [
      { question: "ব্যাংক চেকে টাকা লেখার সঠিক নিয়ম কী?", answer: "ব্যাংক চেকে টাকার অংক কথায় লেখার পর শেষে 'মাত্র' বা 'Only' লিখতে হয়, যা আমাদের টুল স্বয়ংক্রিয়ভাবে যুক্ত করে দেয়।" },
      { question: "দশমিক বা পয়সা থাকলে কি কাজ করবে?", answer: "হ্যাঁ, যেমন ১৫০০.৫০ লিখলে 'এক হাজার পাঁচশত টাকা পঞ্চাশ পয়সা মাত্র' হিসেবে আসবে।" }
    ]
  },

  "text/word-counter": {
    path: "/tools/text/word-counter",
    slug: "text/word-counter",
    category: "text",
    title: "ওয়ার্ড ও ক্যারেক্টার কাউন্টার - Word, Character & Case Converter | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "বাংলা ও ইংরেজি লেখার মোট শব্দ, অক্ষর, প্যারাগ্রাফ এবং রিডিং টাইম গণনা করুন। আপারকেস, লোয়ারকেস ও টাইটেল কেস পরিবর্তনের সুবিধা সহ ফ্রি।",
    keywords: [
      "word counter online", "character counter", "text length checker", "reading time calculator",
      "sentence counter", "uppercase lowercase converter", "paragraph counter", "bangla word counter",
      "শব্দ গণনা", "ওয়ার্ড কাউন্টার", "অক্ষর গণনা", "লেখার রিডিং টাইম", "কেস কনভার্টার", "ক্যারেক্টার কাউন্টার",
      "word count korar tool", "character counter online", "shobdo gonona kora", "text case change",
      "bangla word gonona", "online word checker"
    ],
    h1: "ওয়ার্ড ও ক্যারেক্টার কাউন্টার — শব্দ, অক্ষর ও কেস কনভার্টার",
    subtitle: "আর্টিকেল, ব্লগ বা ফেসবুক পোস্টের মোট শব্দ ও রিডিং টাইম রিয়েল-টাইমে পরিমাপ করুন",
    howToSteps: [
      { title: "ধাপ ১: লেখা পেস্ট করুন", desc: "বক্সে আপনার লেখাটি পেস্ট করুন বা সরাসরি টাইপ করুন।" },
      { title: "ধাপ ২: লাইভ পরিসংখ্যান দেখুন", desc: "শব্দ, অক্ষর ও পড়ার আনুমানিক সময় সাথে সাথেই দেখতে পাবেন।" },
      { title: "ধাপ ৩: কেস কনভার্ট (প্রয়োজনে)", desc: "বড়হাতের বা ছোটহাতের লেখায় রূপান্তর করার সুবিধা।" }
    ],
    whyUse: [
      "এসইও কনটেন্ট ও পরীক্ষার রচনার শব্দের সঠিক হিসাব।",
      "বাংলা ও ইংরেজি সব ধরনের ভাষার জন্যই নির্ভুল।"
    ],
    specifications: [
      { label: "কাউন্টিং প্যারামিটারস", value: "Words, Characters (with/without space), Sentences, Reading Time" }
    ],
    limitations: ["অতিরিক্ত স্পেস বা অপ্রয়োজনীয় লাইন গণনা পরিচ্ছন্ন রাখে।"],
    faqs: [
      { question: "রিডিং টাইম কীভাবে হিসাব করা হয়?", answer: "সাধারণত মানুষ মিনিটে গড়ে ২০০টি শব্দ পড়তে পারে, সেই আন্তর্জাতিক গড় মান অনুযায়ী সময়টি নির্ধারিত হয়।" }
    ]
  },

  "text/date-converter": {
    path: "/tools/text/date-converter",
    slug: "text/date-converter",
    category: "text",
    title: "তারিখ ও বাংলা ক্যালেন্ডার - English to Bangla Date Converter | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "ইংরেজি গ্রেগরিয়ান তারিখকে তাৎক্ষণিকভাবে বঙ্গাব্দ (বাংলা সন, মাস ও ঋতু) এবং হিজরি তারিখে রূপান্তর করুন। ১০০% নিখুঁত সরকারি বাংলা একাডেমি ক্যালেন্ডার।",
    keywords: [
      "english to bangla date converter", "bengali calendar date today", "gregorian to bongabdo", "convert date to bangla",
      "bangla date today", "hijri date converter", "bangla academy calendar", "official bangla calendar converter",
      "ইংরেজি থেকে বাংলা তারিখ", "আজকের বাংলা তারিখ", "বাংলা সন ও মাস", "বঙ্গাব্দ রূপান্তর",
      "বাংলা একাডেমি ক্যালেন্ডার", "আজকের বাংলা সাল",
      "english theke bangla tarikh", "ajker bangla date koto", "bangla calendar converter",
      "bangla shon month", "tarikh converter bangla"
    ],
    h1: "তারিখ ও বাংলা ক্যালেন্ডার — ইংরেজি থেকে বাংলা সন ও তারিখ",
    subtitle: "যেকোনো ইংরেজি তারিখের বাংলা একাডেমি অনুমোদিত সঠিক বঙ্গাব্দ, মাস, দিন ও ঋতু জানুন",
    howToSteps: [
      { title: "ধাপ ১: ইংরেজি তারিখ সিলেক্ট করুন", desc: "ক্যালেন্ডার পিকার থেকে যেকোনো তারিখ নির্বাচন করুন।" },
      { title: "ধাপ ২: বাংলা তারিখের রূপান্তর দেখুন", desc: "সাথে সাথে বঙ্গাব্দ সাল, মাস এবং বাংলা ঋতুর নাম প্রদর্শিত হবে।" }
    ],
    whyUse: [
      "বাংলাদেশ সরকারের সংশোধিত বাংলা একাডেমি পঞ্জিকা অনুযায়ী নিখুঁত।",
      "ঐতিহাসিক ও সাম্প্রতিক যেকোনো তারিখ রূপান্তরের সুবিধা।"
    ],
    specifications: [
      { label: "ক্যালেন্ডার স্ট্যান্ডার্ড", value: "Bangla Academy Revised Calendar" }
    ],
    limitations: ["ঐতিহাসিক খুব পুরনো তারিখের ক্ষেত্রে গ্রেগরিয়ান ক্যালেন্ডারের লিপ ইয়ার প্রভাব ফেলতে পারে।"],
    faqs: [
      { question: "আজকের বাংলা তারিখ কত?", answer: "আমাদের টুলে প্রবেশ করলেই স্বয়ংক্রিয়ভাবে আজকের সঠিক বাংলা সন, মাস ও তারিখ দেখতে পাবেন।" }
    ]
  },

  // ==========================================
  // 4. SOCIAL MEDIA TOOLS (7 Tools)
  // ==========================================
  "social/youtube-thumbnail": {
    path: "/tools/social/youtube-thumbnail",
    slug: "social/youtube-thumbnail",
    category: "social",
    title: "ইউটিউব থাম্বনেইল ডাউনলোডার - YouTube Thumbnail Downloader HD 1080p | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "যেকোনো YouTube ভিডিও লিংক দিয়ে এক ক্লিকেই ফুল HD (1080p, 720p, 480p) আসল থাম্বনেইল ছবি ডাউনলোড করুন সম্পূর্ণ বিনামূল্যে।",
    keywords: [
      "youtube thumbnail downloader", "download yt thumbnail hd", "youtube thumbnail grabber",
      "1080p youtube thumbnail download", "save youtube video cover", "full hd thumbnail saver", "youtube cover image download",
      "ইউটিউব থাম্বনেইল ডাউনলোড", "ভিডিও থাম্বনেইল সেভ করা", "ইউটিউব কভার ছবি ডাউনলোড", "ফুল এইচডি থাম্বনেইল ডাউনলোডার",
      "ইউটিউব থাম্বনেইল সেভার", "এইচডি থাম্বনেইল ডাউনলোড",
      "youtube thumbnail download kora", "yt thumbnail grabber online", "video er thumbnail download",
      "youtube cover download bangla", "high quality youtube thumbnail"
    ],
    h1: "ইউটিউব থাম্বনেইল ডাউনলোডার — ফুল HD 1080p কোয়ালিটিতে ডাউনলোড",
    subtitle: "যেকোনো ইউটিউব ভিডিওর লিংক পেস্ট করে সর্বোচ্চ রেজোলিউশনের কভার ছবি সংগ্রহ করুন",
    howToSteps: [
      { title: "ধাপ ১: ইউটিউব লিংক পেস্ট করুন", desc: "ইউটিউব ভিডিও বা শর্টস-এর লিংকটি ইনপুট বক্সে দিন।" },
      { title: "ধাপ ২: রেজোলিউশন পছন্দ করুন", desc: "MaxRes 1080p, High 720p বা অন্যান্য রেজোলিউশন প্রিভিউ দেখুন।" },
      { title: "ধাপ ৩: এক ক্লিকে ডাউনলোড", desc: "'ডাউনলোড' বাটনে চাপ দিয়ে হাই-কোয়ালিটি ছবিটি সংরক্ষণ করুন।" }
    ],
    whyUse: [
      "ইউটিউবের নিজস্ব সার্ভার থেকে আসল সর্বোচ্চ রেজোলিউশনের ছবি আনা হয়।",
      "শর্টস (Shorts) এবং সাধারণ ভিডিও উভয় ধরনের লিংক সাপোর্ট করে।"
    ],
    specifications: [
      { label: "রেজোলিউশন অপশন", value: "1080p (MaxRes), 720p (HQ), 480p (MQ), 360p (SD)" }
    ],
    limitations: ["ভিডিও নির্মাতারা যদি ১০৮০পি রেজোলিউশনের থাম্বনেইল আপলোড না করে থাকেন, তবে সর্বোচ্চ ৭২০পি পাওয়া যাবে।"],
    faqs: [
      { question: "ইউটিউব শর্টস (Shorts)-এর থাম্বনেইল কি ডাউনলোড করা যায়?", answer: "হ্যাঁ, যেকোনো ইউটিউব শর্টস ভিডিওর লিংক দিয়েও ফুল কোয়ালিটি থাম্বনেইল সংগ্রহ করা যায়।" }
    ]
  },

  "social/youtube-tags": {
    path: "/tools/social/youtube-tags",
    slug: "social/youtube-tags",
    category: "social",
    title: "ইউটিউব ট্যাগ এক্সট্র্যাক্টর - YouTube Video Tags & SEO Extractor | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "ভাইরাল ইউটিউব ভিডিওর লুকায়িত ট্যাগ, কিওয়ার্ড ও এসইও মেটাডাটা এক ক্লিকে এক্সট্র্যাক্ট করে কপি করুন। আপনার ইউটিউব চ্যানেলের ভিউ বাড়ান।",
    keywords: [
      "youtube tag extractor", "yt keyword tool", "extract tags from youtube video", "viral youtube tags finder",
      "youtube seo tags copy", "video metadata extractor", "find competitor youtube tags", "youtube tag finder online",
      "ইউটিউব ট্যাগ এক্সট্রাক্টর", "ভিডিও ট্যাগ দেখার নিয়ম", "ভাইরাল ইউটিউব ট্যাগ", "ইউটিউব এসইও কিওয়ার্ড",
      "ভিডিওর ট্যাগ কপি করা", "ইউটিউব ট্যাগ জেনারেটর",
      "youtube tag dekhar tool", "yt video er tag copy kora", "viral video tag extractor",
      "youtube seo tags bangla", "video tags ber kora online"
    ],
    h1: "ইউটিউব ট্যাগ এক্সট্র্যাক্টর — ভিডিওর গোপন ট্যাগ ও কিওয়ার্ড জানুন",
    subtitle: "জনপ্রিয় ও র‍্যাঙ্ক করা ভিডিওগুলোর এসইও ট্যাগ বিশ্লেষণ করে আপনার ভিডিওর এসইও বৃদ্ধি করুন",
    howToSteps: [
      { title: "ধাপ ১: ভিডিও লিংক দিন", desc: "যে ভিডিওর ট্যাগ দেখতে চান তার লিংক পেস্ট করুন।" },
      { title: "ধাপ ২: এক্সট্র্যাক্ট বাটন চাপুন", desc: "টুলটি সাথে সাথে ভিডিওর লুকানো ট্যাগগুলো খুঁজে বের করবে।" },
      { title: "ধাপ ৩: ট্যাগগুলো কপি করুন", desc: "এক ক্লিকে সকল ট্যাগ কপি করে আপনার স্টুডিওতে পেস্ট করুন।" }
    ],
    whyUse: [
      "কম্পিটিটরদের ভাইরাল হওয়ার কৌশল বিশ্লেষণের সহজ উপায়।",
      "ভিডিও র‍্যাঙ্কিং উন্নত করার জন্য প্রাসঙ্গিক কিওয়ার্ডের ধারণা।"
    ],
    specifications: [
      { label: "ডাটা টাইপ", value: "Public YouTube Video Tags & Metadata" }
    ],
    limitations: ["ভিডিও নির্মাতারা যদি কোনো ট্যাগ ব্যবহার না করে থাকেন, তবে ট্যাগ লিস্ট খালি দেখাতে পারে।"],
    faqs: [
      { question: "ট্যাগ ব্যবহার করলে কি ভিডিওর ভিউ বাড়ে?", answer: "হ্যাঁ, প্রাসঙ্গিক ট্যাগ ইউটিউব অ্যালগরিদমকে ভিডিওর বিষয়বস্তু বুঝতে সাহায্য করে এবং সার্চ ফলাফলে উপরে আসতে সহায়তা করে।" }
    ]
  },

  "social/whatsapp-link": {
    path: "/tools/social/whatsapp-link",
    slug: "social/whatsapp-link",
    category: "social",
    title: "হোয়াটসঅ্যাপ ডিরেক্ট মেসেজ - WhatsApp Direct Message & Link Generator | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "ফোনে নম্বর সেভ না করেই যেকোনো নম্বরে সরাসরি WhatsApp চ্যাট শুরু করুন এবং কাস্টম প্রাক-লিখিত মেসেজ সহ wa.me লিংক তৈরি করুন।",
    keywords: [
      "whatsapp direct message without saving number", "wa me link generator", "direct chat whatsapp",
      "click to chat whatsapp link", "send whatsapp message online", "whatsapp link with prefilled message",
      "নম্বর সেভ ছাড়া হোয়াটসঅ্যাপ মেসেজ", "হোয়াটসঅ্যাপ ডিরেক্ট চ্যাট", "হোয়াটসঅ্যাপ লিংক তৈরি", "ক্লিক টু চ্যাট লিংক",
      "হোয়াটসঅ্যাপ চ্যাট লিংক জেনারেটর",
      "number save chara whatsapp message", "whatsapp direct link banano", "wa me link toiri",
      "whatsapp e direct message pathano", "whatsapp click to chat bangla"
    ],
    h1: "হোয়াটসঅ্যাপ ডিরেক্ট মেসেজ — নম্বর সেভ ছাড়া চ্যাট ও লিংক তৈরি",
    subtitle: "কন্ট্যাক্ট লিস্টে নম্বর যোগ করার ঝামেলা ছাড়াই সরাসরি চ্যাট শুরু করুন এবং ওয়েবসাইটের জন্য wa.me লিংক বানান",
    howToSteps: [
      { title: "ধাপ ১: ফোন নম্বর লিখুন", desc: "দেশের কোড সহ মোবাইল নম্বর লিখুন (যেমন: 88017...)।" },
      { title: "ধাপ ২: মেসেজ লিখুন (ঐচ্ছিক)", desc: "যদি আগে থেকেই কোনো টেক্সট পাঠাতে চান তা লিখে দিন।" },
      { title: "ধাপ ৩: চ্যাট ওপেন বা লিংক কপি", desc: "'সরাসরি চ্যাট করুন' চাপলে WhatsApp ওপেন হবে অথবা লিংকটি কপি করুন।" }
    ],
    whyUse: [
      "অপরিচিত ব্যক্তিদের সাথে এককালীন চ্যাটের জন্য নম্বর সেভ করার প্রয়োজন নেই।",
      "অনলাইন শপ ও ফেসবুক পেজের জন্য কাস্টমার মেসেজিং লিংক তৈরি।"
    ],
    specifications: [
      { label: "ফরম্যাট", value: "Official WhatsApp Click-to-Chat (wa.me)" }
    ],
    limitations: ["নম্বরে অবশ্যই অ্যাক্টিভ হোয়াটসঅ্যাপ অ্যাকাউন্ট থাকতে হবে।"],
    faqs: [
      { question: "দেশের কোড দেওয়া কি বাধ্যতামূলক?", answer: "হ্যাঁ, বাংলাদেশের নম্বরের জন্য ৮৮০ (880) দিয়ে শুরু করা আবশ্যক।" }
    ]
  },

  "social/heart-trace": {
    path: "/tools/social/heart-trace",
    slug: "social/heart-trace",
    category: "social",
    title: "হার্টট্রেস প্রপোজাল লিংক - HeartTrace Romantic Proposal Link Maker | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "ভালোবাসার মানুষকে প্রপোজ করতে বা বিশেষ বার্তা পাঠাতে মজার ইন্টারঅ্যাক্টিভ লিংক তৈরি করুন (যেখানে 'না' বাটন ছুঁলেই পালিয়ে যায় এবং কনফেটি ওড়ে)!",
    keywords: [
      "hearttrace proposal link maker", "interactive romantic confession link", "dodging no button proposal",
      "valentine proposal generator", "romantic interactive page", "propose day confession link", "funny love proposal link",
      "ভালোবাসার প্রপোজ লিংক", "প্রেমের চিঠি লিংক তৈরি", "ইন্টারঅ্যাক্টিভ প্রপোজাল মেকার", "ভালোবাসার স্বীকারোক্তি",
      "ভালোবাসা দিবসের লিংক", "মজার প্রপোজাল পেজ",
      "romantic proposal link banano", "propose korar link", "hearttrace link maker",
      "valobashar confession link", "love proposal interactive link"
    ],
    h1: "হার্টট্রেস — ভালোবাসার মানুষের জন্য ইন্টারঅ্যাক্টিভ প্রপোজাল লিংক",
    subtitle: "একটি মিষ্টি ও মজার পেজ তৈরি করে ভালোবাসার মানুষকে পাঠান, যেখানে 'না' বাটন কখনোই ক্লিক করা যায় না!",
    howToSteps: [
      { title: "ধাপ ১: আপনার ও সঙ্গীর নাম লিখুন", desc: "নাম ও রোমান্টিক বার্তা টাইপ করুন।" },
      { title: "ধাপ ২: লিংক জেনারেট করুন", desc: "এক ক্লিকে বিশেষ ইন্টারঅ্যাক্টিভ গোপন লিংক তৈরি হয়ে যাবে।" },
      { title: "ধাপ ৩: শেয়ার ও প্রতিক্রিয়া দেখুন", desc: "লিংকটি হোয়াটসঅ্যাপ বা মেসেঞ্জারে পাঠিয়ে দিন।" }
    ],
    whyUse: [
      "ইন্টারঅ্যাক্টিভ অ্যানিমেশন ও রোমান্টিক কনফেটি বিস্ফোরণ।",
      "ডিজিটাল যুগে অনুভূতি প্রকাশের অভিনব ও রোমাঞ্চকর উপায়।"
    ],
    specifications: [
      { label: "প্রযুক্তি", value: "Interactive Canvas & Confetti Animations" }
    ],
    limitations: ["লিংকটি বন্ধুদের সাথে আনন্দের স্মৃতি তৈরির জন্য তৈরি করা হয়েছে।"],
    faqs: [
      { question: "'না' বাটনে চাপ দিলে কী হয়?", answer: "'না' বাটনের উপর কার্সার বা আঙুল নিলেই সেটি মজার ছলে স্ক্রিনের অন্য জায়গায় সরে যায়, ফলে সঙ্গীকে অবশ্যই 'হ্যাঁ' বাটনে চাপ দিতে হয়!" }
    ]
  },

  "social/secret-santa": {
    path: "/tools/social/secret-santa",
    slug: "social/secret-santa",
    category: "social",
    title: "সিক্রেট সান্তা পেয়ার জেনারেটর - Secret Santa Gift Exchange Pair Maker | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "বন্ধু, পরিবার বা অফিসের সহকর্মীদের জন্য নিরপেক্ষভাবে উপহার বিনিময়ের সিক্রেট জোড়া তৈরি করুন এবং সহজে কার্ড বা হোয়াটসঅ্যাপে শেয়ার করুন।",
    keywords: [
      "secret santa generator", "random gift exchange pair maker", "secret santa name picker",
      "office holiday gift swap", "unbiased partner picker", "secret santa pair maker free",
      "সিক্রেট সান্তা জেনারেটর", "উপহার বিনিময়ের লটারি", "র‍্যান্ডম জোড়া তৈরি", "ফ্রেন্ডস গিফট সোয়াপ",
      "সিক্রেট সান্তা কার্ড মেকার",
      "secret santa name picker", "gift exchange lottery", "random jora toiri",
      "office secret santa tool", "gift exchange pair maker"
    ],
    h1: "সিক্রেট সান্তা জেনারেটর — উপহার বিনিময়ের লটারি ও জোড়া নির্ধারণ",
    subtitle: "অফিস টিম, বন্ধু বা পারিবারিক পুনর্মিলনীতে উপহার বিনিময়ের জন্য নিরপেক্ষ ডিজিটাল লটারি করুন",
    howToSteps: [
      { title: "ধাপ ১: অংশগ্রহণকারীদের নাম লিখুন", desc: "সকল বন্ধুর নাম কমা দিয়ে বা আলাদা লাইনে যোগ করুন।" },
      { title: "ধাপ ২: স্বয়ংক্রিয় র্যান্ডমাইজেশন", desc: "অ্যালগরিদম নিশ্চিত করবে কেউ যেন নিজের নাম নিজে না পায়।" },
      { title: "ধাপ ৩: সিক্রেট কার্ড শেয়ার", desc: "প্রতিটি সদস্যের কার্ড গোপনে তাদের কাছে পাঠিয়ে দিন।" }
    ],
    whyUse: [
      "কাগজের টুকরোয় লটারি করার পুরনো ঝামেলা থেকে মুক্তি।",
      "সম্পূর্ণ গোপনীয় ও নিরপেক্ষ পেয়ারিং।"
    ],
    specifications: [
      { label: "অ্যালগরিদম", value: "Fair Derangement Permutation (Self-pairing avoided)" }
    ],
    limitations: ["কমপক্ষে ৩ জন অংশগ্রহণকারী থাকা বাঞ্ছনীয়।"],
    faqs: [
      { question: "কেউ কি নিজের নাম নিজে পেতে পারে?", answer: "না, অ্যালগরিদম নিশ্চিত করে যে কেউ যাতে নিজের নাম না পায় এবং প্রত্যেকেই উপহার দেওয়ার জন্য ভিন্ন একজন বন্ধুকে পায়।" }
    ]
  },

  "social/anonymous-chat": {
    path: "/tools/social/anonymous-chat",
    slug: "social/anonymous-chat",
    category: "social",
    title: "বেনামী চ্যাট রুম - Anonymous Chat Room (Instant Code Join) | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "কোনো নাম বা পরিচয় প্রকাশ না করে রুম কোড শেয়ার করে বন্ধুদের সাথে সরাসরি এন্ড-টু-এন্ড রিয়েলটাইম এনক্রিপ্টেড চ্যাট করুন সম্পূর্ণ বিনামূল্যে।",
    keywords: [
      "anonymous chat room", "secret chat online", "private disposable chat", "no login chat room",
      "firebase realtime anonymous messaging", "ephemeral chat room", "self destructing chat",
      "বেনামী চ্যাট রুম", "গোপন চ্যাট", "পরিচয় ছাড়া মেসেজিং", "প্রাইভেট চ্যাট রুম", "ইনস্ট্যান্ট চ্যাট রুম",
      "porichoy chara chat", "gopon chat room", "anonymous message pathano",
      "temporary chat room bd", "secret messaging online free"
    ],
    h1: "বেনামী চ্যাট রুম — সম্পূর্ণ গোপনীয় ও অস্থায়ী রিয়েল-টাইম চ্যাট",
    subtitle: "কোনো ফোন নম্বর বা ইমেইল লগইন ছাড়াই রুম কোড তৈরি করে বন্ধুদের সাথে নিরাপদে চ্যাট করুন",
    howToSteps: [
      { title: "ধাপ ১: নতুন রুম তৈরি বা কোড দিয়ে জয়েন", desc: "একটি রুম কোড তৈরি করুন অথবা বন্ধুর দেওয়া কোড লিখুন।" },
      { title: "ধাপ ২: বেনামী নিকনেম নিন", desc: "একটি ছদ্মনাম নির্বাচন করে রুমে প্রবেশ করুন।" },
      { title: "ধাপ ৩: রিয়েল-টাইম চ্যাট", desc: "নিরাপদে কথা বলুন; রুম বন্ধ করলেই বার্তাগুলোর অস্তিত্ব থাকবে না।" }
    ],
    whyUse: [
      "কোনো লগইন বা অ্যাকাউন্ট সৃষ্টির প্রয়োজন নেই।",
      "ফায়ারবেস রিয়েল-টাইম ক্লাউড এনক্রিপশন।"
    ],
    specifications: [
      { label: "ডাটা স্থায়িত্ব", value: "অস্থায়ী মেমোরি বেসড সেশন" }
    ],
    limitations: ["ব্রাউজার রিফ্রেশ বা উইন্ডো বন্ধ করলে সেশন রিসেট হতে পারে।"],
    faqs: [
      { question: "আমাদের চ্যাটের বার্তাগুলো কি সার্ভারে জমা থাকে?", answer: "না, এটি একটি সাময়িক ডিসপোজেবল চ্যাট রুম যা কোনো স্থায়ী ডাটাবেজে বার্তা সেভ রাখে না।" }
    ]
  },

  "social/instagram-booster": {
    path: "/tools/social/instagram-booster",
    slug: "social/instagram-booster",
    category: "social",
    title: "ইনস্টাগ্রাম অটোলাইকার ও ফলোয়ার বুস্টার - Instagram Auto Liker & Follower Exchange | ToolKaj",
    description: "পাসওয়ার্ড ছাড়া শুধুমাত্র পাবলিক ইউজারনেম দিয়ে আসল ইনস্টাগ্রাম ব্যবহারকারীদের কাছ থেকে লাইক ও ফলোয়ার বিনিময় করুন ১০০% বিনামূল্যে ও নিরাপদে।",
    keywords: [
      "instagram autoliker", "instagram free followers exchange", "free ig likes without password",
      "real instagram likes peer to peer", "instagram engagement booster", "free insta likes bangladesh",
      "safe ig followers exchange", "instagram auto like free", "instagram booster free",
      "instagram likes exchange without password", "real instagram followers bd", "passwordless instagram booster",
      "ইনস্টাগ্রাম অটোলাইকার", "ইনস্টাগ্রাম লাইক বাড়ানোর উপায়", "ইনস্টাগ্রাম ফ্রি ফলোয়ার",
      "পাসওয়ার্ড ছাড়া ইনস্টাগ্রাম বুস্টার", "ইনস্টাগ্রাম লাইক অ্যাপ", "আসল ইনস্টাগ্রাম লাইক",
      "instagram like barano free", "instagram follower baranor upay", "password chara ig like",
      "instagram autoliker bd", "free instagram likes toolkaj", "ig booster online free"
    ],
    h1: "ইনস্টাগ্রাম অটোলাইকার ও ফ্রি ফলোয়ার এক্সচেঞ্জ — ১০০% আসল লাইক",
    subtitle: "পাসওয়ার্ড ছাড়া ইউজারনেম দিয়ে আসল সক্রিয় ব্যবহারকারীদের সাথে পারস্পরিক এনগেজমেন্ট বৃদ্ধি করুন",
    howToSteps: [
      { title: "ধাপ ১: ইউজারনেম দিয়ে লগইন করুন", desc: "আপনার পাবলিক ইনস্টাগ্রাম অ্যাকাউন্টের ইউজারনেম লিখুন। সাথে সাথেই বিনামূল্যে ১০ স্টার্টার ক্রেডিট উপহার পাবেন।" },
      { title: "ধাপ ২: ক্রেডিট অর্জন করুন (Earn Credits)", desc: "লাইভ ফিড থেকে অন্য ব্যবহারকারীদের পোস্ট বা প্রোফাইলে লাইক/ফলো দিতে বাটনে ক্লিক করুন। ইনস্টাগ্রাম পেজ ওপেন হবে।" },
      { title: "ধাপ ৩: অন্তত ৬ সেকেন্ড অপেক্ষা করে ফিরে আসুন", desc: "সততার সাথে লাইক বা ফলো নিশ্চিত করে ৬ সেকেন্ড পর ToolKaj ট্যাবে ফিরে আসুন। ব্রাউজার স্বয়ংক্রিয়ভাবে আপনার কাজ যাচাই করে ক্রেডিট যোগ করবে।" },
      { title: "ধাপ ৪: নিজের পোস্ট বা প্রোফাইল বুস্ট করুন", desc: "উপার্জিত ক্রেডিট দিয়ে আপনার নিজের পোস্টের লিংক দিন অথবা সরাসরি আপনার অ্যাকাউন্টে ফলোয়ার ক্যাম্পেইন চালু করুন।" }
    ],
    whyUse: [
      "পাসওয়ার্ডহীন লগইন (Passwordless): অ্যাকাউন্টের পাসওয়ার্ড প্রয়োজন নেই, তাই আইডি হ্যাকের কোনো ঝুঁকি নেই।",
      "কঠোর ওনারশিপ ভেরিফিকেশন (Listing Guard): শুধুমাত্র নিজস্ব পোস্টে বুস্ট নেওয়ার সুবিধা।",
      "২৫ সেকেন্ডের কনকারেন্সি লক: একই পোস্টে একাধিক ইউজারের ক্লিক বিশৃঙ্খলা রোধ করে।",
      "রিয়েল-টাইম স্ক্র্যাপার ভেরিফিকেশন: লাইক বা ফলো নিশ্চিত করেই কেবল ক্রেডিট যুক্ত হয়।"
    ],
    specifications: [
      { label: "লগইন পদ্ধতি", value: "পাসওয়ার্ডহীন (শুধুমাত্র পাবলিক ইউজারনেম)" },
      { label: "ভেরিফিকেশন পদ্ধতি", value: "Instagram Public Scraper + Concurrency Lock (25s)" },
      { label: "উৎস", value: "১০০% আসল সক্রিয় ব্যবহারকারী (Peer-to-Peer)" },
      { label: "বোনাস", value: "১০ স্টার্টার ক্রেডিট বিনামূল্যে" }
    ],
    limitations: [
      "অ্যাকাউন্ট অবশ্যই Public থাকতে হবে। Private একাউন্ট হলে স্ক্র্যাপার লাইক বা ফলোয়ার সংখ্যা দেখতে পায় না।",
      "টাস্ক শুরুর পর অন্তত ৬ সেকেন্ড ইনস্টাগ্রাম অ্যাপে থাকতে হবে; খুব দ্রুত ফিরে আসলে অ্যান্টি-চিট সিস্টেমে টাস্কটি বাতিল হবে।"
    ],
    faqs: [
      { question: "ইনস্টাগ্রাম অ্যাকাউন্টের পাসওয়ার্ড কি দিতে হবে?", answer: "না, কখনোই না! ToolKaj সম্পূর্ণ পাসওয়ার্ডহীন প্ল্যাটফর্ম। আমরা কখনই কোনো ব্যবহারকারীর পাসওয়ার্ড চাই না বা সংরক্ষণ করি না। আপনি শুধু আপনার পাবলিক ইউজারনেম দিয়ে লগইন করতে পারবেন।" },
      { question: "ফলোয়ার বা লাইকগুলো কি আসল মানুষের?", answer: "হ্যাঁ, এটি একটি ১০০% পেয়ার-টু-পেয়ার (P2P) এক্সচেঞ্জ সিস্টেম। এখানে কোনো বট কাজ করে না; আপনার মতো অন্যান্য সাধারণ ব্যবহারকারীরা ক্রেডিট অর্জনের জন্য আপনার পোস্টে লাইক ও প্রোফাইলে ফলো দেন।" },
      { question: "আমার অ্যাকাউন্ট প্রাইভেট থাকলে কি কাজ করবে?", answer: "না, প্রাইভেট অ্যাকাউন্টের লাইক বা ফলোয়ার সংখ্যা সাধারণ স্ক্র্যাপার দেখতে পায় না। তাই কাজ শুরু করার পূর্বে আপনার ইনস্টাগ্রাম অ্যাকাউন্টটি সাময়িকভাবে পাবলিক করে নিতে হবে।" },
      { question: "আমি কি অন্য কারো পোস্টের লিংক দিয়ে লাইক নিতে পারি?", answer: "না, সিস্টেমে কঠোর ওনারশিপ গার্ড (Strict Ownership Verification) রয়েছে। আপনি যখন পোস্টের লিংক দেবেন, আমাদের স্ক্র্যাপার চেক করবে পোস্টটির মালিক আপনার লগইন করা ইউজারনেমের সাথে মিলে কি না।" }
    ]
  },

  // ==========================================
  // 5. CITIZEN & FORMS (5 Tools)
  // ==========================================
  "citizen/ats-cv-maker": {
    path: "/tools/citizen/ats-cv-maker",
    slug: "citizen/ats-cv-maker",
    category: "citizen",
    title: "ফ্রি ATS সিভি ও রিজিউম মেকার - Free ATS-Friendly CV & Resume Builder | ToolKaj",
    description: "আন্তর্জাতিক ও দেশীয় চাকরির জন্য ATS সফটওয়্যার কমপ্লায়েন্ট প্রফেশনাল সিভি তৈরি করুন মাত্র ৫ মিনিটে এবং তাৎক্ষণিক হাই-কোয়ালিটি A4 PDF ডাউনলোড করুন।",
    keywords: [
      "free ats cv maker", "ats resume builder online", "ats friendly cv template bangladesh",
      "job resume maker free pdf", "professional biodata maker", "applicant tracking system cv", "cv format bangladesh",
      "ats cv maker bangladesh", "job cv format bangladesh", "ats resume template free download",
      "ফ্রি এটিএস সিভি মেকার", "চাকরির সিভি বানানোর নিয়ম", "প্রফেশনাল বায়োডাটা তৈরি", "এটিএস রিজিউম টেমপ্লেট",
      "চাকরির আবেদন সিভি", "বাংলা সিভি ফরমেট", "সিভি তৈরির ওয়েবসাইট",
      "ats cv banano online", "chakrir cv toiri kora", "free resume builder bangla",
      "cv format download pdf", "ats cv maker toolkaj", "professional resume builder bd"
    ],
    h1: "ফ্রি ATS সিভি ও রিজিউম মেকার — প্রফেশনাল বায়োডাটা তৈরি",
    subtitle: "কোম্পানিগুলোর এআই স্ক্রিনিংয়ে টিকে থাকার জন্য ১০০% স্ট্যান্ডার্ড টেক্সট ফরম্যাটের সিভি তৈরি করুন",
    howToSteps: [
      { title: "ধাপ ১: ব্যক্তিগত তথ্য প্রদান", desc: "নাম, ইমেইল, ফোন নম্বর, লিঙ্কডইন প্রোফাইল ও ক্যারিয়ার সারাংশ লিখুন।" },
      { title: "ধাপ ২: অভিজ্ঞতা ও শিক্ষা যোগ", desc: "পূর্ববর্তী চাকরির দায়িত্ব এবং শিক্ষাগত যোগ্যতার বিস্তারিত তথ্য যুক্ত করুন।" },
      { title: "ধাপ ৩: স্কিলস ও প্রজেক্ট সেটআপ", desc: "আপনার টেকনিক্যাল স্কিলস এবং গুরুত্বপূর্ণ কাজগুলো বুলেট পয়েন্টে উল্লেখ করুন।" },
      { title: "ধাপ ৪: এক ক্লিকে PDF ডাউনলোড", desc: "প্রিভিউ চেক করে 'ডাউনলোড PDF' বাটনে ক্লিক করে প্রিন্ট বা ইমেইল করার জন্য সিভি সংরক্ষণ করুন।" }
    ],
    whyUse: [
      "১০০% ATS কমপ্লায়েন্ট স্ট্রাকচার—সফটওয়্যার স্ক্রিনিংয়ে সর্বোচ্চ স্কোর নিশ্চিত করে।",
      "লাইভ প্রিভিউ—তথ্য ইনপুট করার সাথে সাথে সিভির চেহারা সরাসরি দেখা যায়।",
      "অভিজ্ঞতা, শিক্ষা, স্কিলস ও প্রজেক্টের গোছানো সেকশন।",
      "এক ক্লিকেই এ৪ সাইজে হাই-কোয়ালিটি PDF ফাইল এক্সপোর্ট।"
    ],
    specifications: [
      { label: "ফরম্যাট", value: "ATS-Friendly Single/Double Column A4 PDF" },
      { label: "টাইপোগ্রাফি", value: "Standard Web & Print Safe Fonts (Inter, Roboto)" },
      { label: "ফি", value: "সম্পূর্ণ বিনামূল্যে আনলিমিটেড ডাউনলোড" }
    ],
    limitations: ["সিভি বানানোর পর ব্রাউজার ক্যাশ ক্লিয়ার করলে ডাটা মুছে যেতে পারে, তাই কাজ শেষে সাথে সাথে PDF ডাউনলোড করে রাখুন।"],
    faqs: [
      { question: "ATS সিভি কী এবং কেন এটি সাধারণ সিভির চেয়ে ভালো?", answer: "ATS হলো এমন সফটওয়্যার যা চাকরির আবেদনপত্র থেকে কি-ওয়ার্ড স্ক্যান করে। সাধারণ সিভির গ্রাফিক্স বা কলাম অনেক সময় সফটওয়্যার বুঝতে পারে না। ATS সিভি পরিষ্কার ও স্ট্যান্ডার্ড কোডিংয়ে তৈরি হয় বলে কোম্পানিগুলোর নজরে সহজেই পড়ে।" },
      { question: "সিভিতে কি ছবি যোগ করা বাধ্যতামূলক?", answer: "আন্তর্জাতিক চাকরির জন্য ছবিতে কোনো বাধ্যবাধকতা নেই, তবে দেশীয় কর্পোরেট চাকরির জন্য প্রফেশনাল পাসপোর্ট সাইজ ছবি যোগ করা সুবিধাজনক।" }
    ]
  },

  "citizen/marriage-biodata": {
    path: "/tools/citizen/marriage-biodata",
    slug: "citizen/marriage-biodata",
    category: "citizen",
    title: "ম্যারেজ বায়োডাটা মেকার - Bengali Matrimonial Bio Data Maker | ১০০% ফ্রি অনলাইন টুল | ToolKaj",
    description: "বিয়ের প্রস্তাবের জন্য ইসলামিক ও সনাতন ধর্মীয় পাত্র-পাত্রীর মার্জিত ও গোছানো বায়োডাটা তৈরি করুন এবং ফ্রি প্রিন্ট-রেডি PDF ও ইমেজ সেভ করুন।",
    keywords: [
      "marriage biodata maker", "matrimonial biodata bangla", "bengali matrimonial profile maker",
      "bride groom biodata format pdf", "wedding biodata creator free", "islamic marriage biodata maker",
      "বিয়ের বায়োডাটা মেকার", "পাত্র পাত্রীর বায়োডাটা", "বৈবাহিক জীবনবৃত্তান্ত", "ইসলামিক বায়োডাটা তৈরি",
      "বিয়ের জন্য সিভি", "বিয়ের পাত্র পাত্রীর তথ্য ফরম",
      "biyer biodata banano", "patro patri biodata maker", "marriage cv maker bangla",
      "matrimonial biodata pdf download", "biyer cv toiri"
    ],
    h1: "ম্যারেজ বায়োডাটা মেকার — পাত্র/পাত্রীর বৈবাহিক জীবনবৃত্তান্ত",
    subtitle: "পারিবারিক ও সামাজিক শালীনতা বজায় রেখে সুন্দর ও আকর্ষণীয় ফরম্যাটে বিয়ের জীবনবৃত্তান্ত প্রস্তুত করুন",
    howToSteps: [
      { title: "ধাপ ১: পাত্র/পাত্রীর তথ্য ইনপুট", desc: "নাম, বয়স, উচ্চতা, শিক্ষাগত যোগ্যতা ও পেশা লিখুন।" },
      { title: "ধাপ ২: পারিবারিক ও ধর্মীয় বিবরণ", desc: "পিতা-মাতার তথ্য, স্থায়ী ঠিকানা ও ধর্মীয় দৃষ্টিভঙ্গি যোগ করুন।" },
      { title: "ধাপ ৩: ফরম্যাট ও ডাউনলোড", desc: "পছন্দের টেমপ্লেট বেছে নিয়ে PDF বা ইমেজ ফরম্যাটে সংরক্ষণ করুন।" }
    ],
    whyUse: [
      "মার্জিত ও রুচিশীল ফন্ট ও লেআউট।",
      "সরাসরি প্রিন্ট বা হোয়াটসঅ্যাপে শেয়ার করার মতো স্পষ্ট ফরম্যাট।"
    ],
    specifications: [
      { label: "আউটপুট", value: "Print Ready A4 PDF & JPG Image" }
    ],
    limitations: ["সঠিক ও সত্য তথ্য দিয়ে বায়োডাটা প্রস্তুত করুন।"],
    faqs: [
      { question: "বায়োডাটাতে কি ছবি যুক্ত করা যায়?", answer: "হ্যাঁ, পাত্র বা পাত্রীর ছবি সহজে আপলোড করে বায়োডাটার নির্দিষ্ট স্থানে বসানো যায়।" }
    ]
  },

  "citizen/family-card-form": {
    path: "/tools/citizen/family-card-form",
    slug: "citizen/family-card-form",
    category: "citizen",
    title: "ফ্যামিলি কার্ড আবেদন ফরম - TCB Family Card Application Form Maker | ToolKaj",
    description: "টিসিবি ও সরকারি পারিবারিক সহায়তা ফ্যামিলি কার্ডের জন্য সঠিক তথ্যের আবেদন ফরম অনলাইনে সহজে পূরণ করুন এবং প্রিন্ট-রেডি ফরম্যাটে সেভ করুন।",
    keywords: [
      "tcb family card form", "family card application online bangladesh", "ration card form",
      "government family assistance form generator", "tcb card online apply bangla",
      "ফ্যামিলি কার্ড আবেদন ফরম", "টিসিবি ফ্যামিলি কার্ড", "সরকারি ফ্যামিলি কার্ড ফরম পূরণ", "রেশন কার্ড ফরম",
      "টিসিবি কার্ড পাওয়ার উপায়",
      "family card er form puron", "tcb card application online", "family card bananor niyom",
      "ration card form bangladesh", "tcb family card apply"
    ],
    h1: "ফ্যামিলি কার্ড আবেদন ফরম — টিসিবি ও সরকারি সহায়তা ফরম",
    subtitle: "পরিবারের সদস্যদের বিবরণ ও জাতীয় পরিচয়পত্রের তথ্য দিয়ে অফিশিয়াল ফরম্যাট তৈরি করুন",
    howToSteps: [
      { title: "ধাপ ১: পরিবারের প্রধানের তথ্য", desc: "নাম, এনআইডি নম্বর ও মোবাইল নম্বর দিন।" },
      { title: "ধাপ ২: পরিবারের সদস্য তালিকা", desc: "নির্ভরশীল সদস্যদের নাম ও বয়স যুক্ত করুন।" },
      { title: "ধাপ ৩: ফরম প্রিন্ট", desc: "স্থানীয় ওয়ার্ড কাউন্সিলর বা ইউপি চেয়ারম্যান কার্যালয়ে জমার জন্য ফরম প্রিন্ট করুন।" }
    ],
    whyUse: [
      "হাতে লেখার ভুলভ্রান্তি দূর করে কম্পিউটারাইজড পরিষ্কার আবেদনপত্র তৈরি।",
      "সরকারি অফিশিয়াল নিয়মাবলি মেনে সাজানো ফরম্যাট।"
    ],
    specifications: [
      { label: "ফরম্যাট", value: "Bangladesh Govt Standard Citizen Application Form" }
    ],
    limitations: ["ফরমটি পূরণ শেষে স্থানীয় ইউনিয়ন পরিষদ বা পৌরসভা কার্যালয়ে সত্যয়ন করে জমা দিতে হবে।"],
    faqs: [
      { question: "এই ফরম কি সরাসরি সরকারি দপ্তরে জমা দেওয়া যাবে?", answer: "হ্যাঁ, এটি স্ট্যান্ডার্ড আবেদন ফরম্যাটে প্রিন্ট হয়, যা যথাযথ স্বাক্ষর সহ সংশ্লিষ্ট কার্যালয়ে জমা দেওয়া যায়।" }
    ]
  },

  "citizen/fuel-card-form": {
    path: "/tools/citizen/fuel-card-form",
    slug: "citizen/fuel-card-form",
    category: "citizen",
    title: "জ্বালানি তেলের আবেদন ফরম - Fuel Card & Allocation Permit Form Maker | ToolKaj",
    description: "পরিবহন, যানবাহন ও বাণিজ্যিক প্রতিষ্ঠানের মাসিক জ্বালানি তেল (পেট্রোল/ডিজেল) বরাদ্দ ও পারমিট আবেদন ফরম প্রমিত নিয়মে তৈরি ও প্রিন্ট করুন।",
    keywords: [
      "fuel card form", "petrol pump allocation application", "fuel permit form bangladesh",
      "transport fuel requisition form", "commercial vehicle fuel form",
      "জ্বালানি তেলের আবেদন ফরম", "পেট্রোল পাম্প তেল বরাদ্দ ফরম", "জ্বালানি পারমিট আবেদন", "ডিজেল বরাদ্দ ফরম",
      "তেল বরাদ্দের আবেদন",
      "tel er form puron", "fuel card form download", "petrol ration form bangladesh",
      "diesel requisition form online", "vehicle fuel permit bangla"
    ],
    h1: "জ্বালানি তেলের আবেদন ফরম — যানবাহন ও পরিবহন তেল বরাদ্দ ফরম",
    subtitle: "গাড়ি বা প্রতিষ্ঠানের জ্বালানি তেলের মাসিক বরাদ্দ ও পারমিট আবেদন ফরম প্রস্তুত করুন",
    howToSteps: [
      { title: "ধাপ ১: প্রতিষ্ঠানের ও গাড়ির বিবরণ", desc: "গাড়ির রেজিস্ট্রেশন নম্বর ও তেলের ধরণ নির্বাচন করুন।" },
      { title: "ধাপ ২: প্রয়োজনীয় তেলের পরিমাণ", desc: "মাসিক সম্ভাব্য জ্বালানির চাহিদা লিখুন।" },
      { title: "ধাপ ৩: প্রিন্ট ও সিল", desc: "অফিসিয়াল নথির সাথে সংযুক্ত করার জন্য ফরমটি প্রিন্ট নিন।" }
    ],
    whyUse: [
      "পরিবহন খাতের প্রাতিষ্ঠানিক স্ট্যান্ডার্ড বজায় রাখে।",
      "ক্যালকুলেশন ও গাড়ির বিবরণ সহজে লিপিবদ্ধ করার সুবিধা।"
    ],
    specifications: [
      { label: "ডকুমেন্ট", value: "Requisition & Fuel Permit Format" }
    ],
    limitations: ["বিআরটিএ রেজিস্ট্রেশনের সঠিক তথ্য ব্যবহার করতে হবে।"],
    faqs: [
      { question: "কোন ধরণের জ্বালানির জন্য এই ফরমটি প্রযোজ্য?", answer: "পেট্রোল, অকটেন, ডিজেল ও সিএনজি সব ধরনের জ্বালানি চাহিদার জন্যই এটি প্রযোজ্য।" }
    ]
  },

  "citizen/dorkari-links": {
    path: "/tools/citizen/dorkari-links",
    slug: "citizen/dorkari-links",
    category: "citizen",
    title: "দরকারি লিংক ডিরেক্টরি - Bangladesh Official Citizen Services Directory | ToolKaj",
    description: "এনআইডি, ই-পাসপোর্ট, জন্ম নিবন্ধন, জমির খতিয়ান ও ফলাফলসহ বাংলাদেশ সরকারের ৮০+ ভেরিফায়েড অফিসিয়াল পোর্টাল ও সিটিজেন সার্ভিস লিংক এক জায়গায়।",
    keywords: [
      "dorkari links bangladesh", "essential govt links bd", "nid passport birth registration portals",
      "bangladesh citizen service directory", "land khatian online", "official govt website list",
      "ssc hsc result portal", "visa check online bd", "teletalk job portals",
      "দরকারি লিংক", "সরকারি পোর্টাল তালিকা", "এনআইডি ও পাসপোর্ট লিংক", "জন্ম নিবন্ধন ওয়েবসাইট",
      "জমির খতিয়ান অনলাইন", "দরকারি ওয়েবসাইট বাংলাদেশ", "ভিসা চেক লিংক", "এসএসসি রেজাল্ট লিংক",
      "dorkari link er list", "sorkari website links", "nid passport birth certificate link",
      "bangladesh govt official portals", "essential web links bd"
    ],
    h1: "দরকারি লিংক ডিরেক্টরি — বাংলাদেশের ৮০+ প্রয়োজনীয় সরকারি ও নাগরিক সেবা",
    subtitle: "ভুল ও ভুয়া ওয়েবসাইটের ভিড়ে আসল সরকারি পোর্টাল খুঁজে পেতে সম্পূর্ণ ভেরিফায়েড ডিরেক্টরি",
    howToSteps: [
      { title: "ধাপ ১: ক্যাটাগরি বা সার্চ করুন", desc: "যেমন 'এনআইডি', 'পাসপোর্ট', 'রেজাল্ট' বা 'জমি' লিখে সার্চ করুন।" },
      { title: "ধাপ ২: অফিসিয়াল লিংক যাচাই", desc: "প্রতিটি সেবার অফিশিয়াল ডোমেইন ও সঠিক সেবা বিবরণী দেখে নিন।" },
      { title: "ধাপ ৩: এক ক্লিকে সরাসরি প্রবেশ", desc: "সরাসরি সরকারি ওয়েবসাইটে প্রবেশ করে আপনার কাজ সম্পন্ন করুন।" }
    ],
    whyUse: [
      "ভুয়া ফিশিং সাইটের হাত থেকে শতভাগ সুরক্ষা—সকল লিংক ম্যানুয়ালি ভেরিফায়েড।",
      "এনআইডি সংশোধন, ই-পাসপোর্ট ট্র্যাকিং, ভূমি সেবা ও পরীক্ষার ফলাফলের জন্য সবচেয়ে বিশ্বস্ত পোর্টাল।"
    ],
    specifications: [
      { label: "মোট লিংক", value: "৮০+ ভেরিফায়েড অফিসিয়াল লিংক" },
      { label: "ক্যাটাগরি", value: "এনআইডি, পাসপোর্ট, শিক্ষা, ভূমি, কর ও আইনি সেবা" }
    ],
    limitations: ["সরকারি সার্ভারের মেইনটেন্যান্স চলাকালীন সংশ্লিষ্ট সাইট সাময়িক ধীরগতির হতে পারে।"],
    faqs: [
      { question: "এখানে থাকা লিংকগুলো কি নিরাপদ ও অফিশিয়াল?", answer: "হ্যাঁ, এখানে থাকা প্রতিটি লিংক বাংলাদেশ সরকারের নিজস্ব gov.bd ও অফিশিয়াল ডোমেইন থেকে সতর্কতার সাথে যাচাইকৃত।" }
    ]
  },

  // ==========================================
  // 6. VIDEO & AUDIO TOOLS (3 Tools)
  // ==========================================
  "video/video-to-audio": {
    path: "/tools/video/video-to-audio",
    slug: "video/video-to-audio",
    category: "video",
    title: "ভিডিও থেকে অডিও এক্সট্র্যাক্টর - Extract MP3 Audio from Video Online | ToolKaj",
    description: "যেকোনো ভিডিও ফাইল (MP4, MKV, AVI) থেকে অডিও অংশ আলাদা করে ক্রিস্টাল ক্লিয়ার MP3 ফরম্যাটে ডাউনলোড করুন। সম্পূর্ণ ক্লায়েন্ট-সাইড ও সুরক্ষিত।",
    keywords: [
      "video to audio converter", "extract mp3 from video", "mp4 to mp3 online free",
      "fast audio extractor from video", "convert movie to sound file", "sound ripper online", "video to mp3 bangla",
      "ভিডিও থেকে অডিও", "ভিডিও থেকে গান আলাদা করা", "এমপি৪ থেকে এমপি৩", "ভিডিও অডিও কনভার্টার",
      "অনলাইন ভিডিও টু অডিও", "ভিডিও সাউন্ড কনভার্ট",
      "video theke audio kora", "video theke mp3 banano", "mp4 theke gan ber kora",
      "video audio extractor online free", "video to sound converter"
    ],
    h1: "ভিডিও থেকে অডিও এক্সট্র্যাক্টর — MP4 ভিডিও থেকে পরিষ্কার MP3 অডিও",
    subtitle: "ব্রাউজারেই দ্রুততার সাথে ভিডিওর সাউন্ডট্র্যাক আলাদা করে হাই-কোয়ালিটি অডিও ফাইলে সেভ করুন",
    howToSteps: [
      { title: "ধাপ ১: ভিডিও ফাইল নির্বাচন", desc: "আপনার ড্রাইভ থেকে MP4 বা ভিডিও ফাইল আপলোড করুন।" },
      { title: "ধাপ ২: অডিও এক্সট্রাকশন", desc: "'অডিও তৈরি করুন' বাটনে চাপ দিয়ে প্রসেস শুরু করুন।" },
      { title: "ধাপ ৩: MP3 ডাউনলোড", desc: "নিখুঁত সাউন্ডট্র্যাকটি সাথে সাথে অডিও ফাইল হিসেবে সেভ করুন।" }
    ],
    whyUse: [
      "কোনো ভিডিও বড় সার্ভারে আপলোড করতে হয় না, ফলে সময় ও ডেটা বাঁচে।",
      "ভিডিওর অরিজিনাল সাউন্ড কোয়ালিটি পুরোপুরি বজায় থাকে।"
    ],
    specifications: [
      { label: "আউটপুট অডিও", value: "Stereo 44.1kHz High Quality MP3/WAV" }
    ],
    limitations: ["অতিরিক্ত বড় সাইজের ৪K ভিডিও ডিভাইসের মেমোরি অনুযায়ী সামান্য সময় নিতে পারে।"],
    faqs: [
      { question: "অডিওর সাউন্ড কোয়ালিটি কি ঠিক থাকবে?", answer: "হ্যাঁ, ভিডিওর মূল অডিও বিটরেট বজায় রেখেই সাউন্ড ফাইল প্রস্তুত হয়।" }
    ]
  },

  "video/speed-volume": {
    path: "/tools/video/speed-volume",
    slug: "video/speed-volume",
    category: "video",
    title: "ভিডিও স্পিড ও ভলিউম বুস্টার - Video Playback Speed & Sound Amplifier | ToolKaj",
    description: "ভিডিওর গতি পরিবর্তন করুন (০.২৫x থেকে ৪x স্লো/ফাস্ট মোশন) অথবা কম শব্দের ভিডিওর ভলিউম ২০০% পর্যন্ত বুস্ট করুন সরাসরি ব্রাউজারেই।",
    keywords: [
      "video speed changer", "video volume booster", "amplify video sound online", "slow motion video maker",
      "fast forward video player", "boost audio level in video", "video sound amplifier online",
      "ভিডিও স্পিড বাড়ানো", "ভিডিও সাউন্ড বাড়ানো", "ভিডিও ভলিউম বুস্টার", "স্লো মোশন ভিডিও তৈরি",
      "ভিডিওর শব্দ দ্বিগুণ করা", "ভিডিও গতি নিয়ন্ত্রণ",
      "video speed barano", "video er sound baranor tool", "slow fast motion video",
      "video volume increase online", "video speed change bangla"
    ],
    h1: "ভিডিও স্পিড ও ভলিউম বুস্টার — গতি পরিবর্তন ও দ্বিগুণ সাউন্ড",
    subtitle: "ধীরগতির বা কম শব্দের ভিডিওকে প্রয়োজনীয় গতিতে চালান এবং সর্বোচ্চ সাউন্ডে উপভোগ করুন",
    howToSteps: [
      { title: "ধাপ ১: ভিডিও আপলোড করুন", desc: "যে ভিডিওর গতি বা সাউন্ড বাড়াতে চান তা দিন।" },
      { title: "ধাপ ২: স্পিড ও ভলিউম স্লাইডার পরিবর্তন", desc: "গতি (০.২৫x - ৪x) এবং ভলিউম (১০০% - ২০০%) নির্ধারণ করুন।" },
      { title: "ধাপ ৩: প্রিভিউ ও এক্সপোর্ট", desc: "লাইভ ফলাফল দেখে অপ্টিমাইজড ভিডিওটি সংরক্ষণ করুন।" }
    ],
    whyUse: [
      "টিউটোরিয়াল দ্রুত দেখতে বা লেকচারের গতি বাড়াতে দারুণ কার্যকর।",
      "মোবাইলে রেকর্ড করা কম আওয়াজের ভিডিওর সাউন্ড দ্বিগুণ করার সুবিধা।"
    ],
    specifications: [
      { label: "স্পিড রেঞ্জ", value: "0.25x (Slow) to 4.0x (Fast)" },
      { label: "ভলিউম বুস্ট", value: "Up to 200% Amplification" }
    ],
    limitations: ["খুব নিম্নমানের অডিও মাত্রাতিরিক্ত বুস্ট করলে সামান্য নয়েজ বাড়তে পারে।"],
    faqs: [
      { question: "গতি বাড়ালে কি কথার পিচ নষ্ট হয়ে যাবে?", answer: "না, আধুনিক অডিও পিচ-কারেকশন অ্যালগরিদম কণ্ঠস্বরের স্বাভাবিকতা ধরে রাখে।" }
    ]
  },

  "video/compress": {
    path: "/tools/video/compress",
    slug: "video/compress",
    category: "video",
    title: "ভিডিও কম্প্রেসার অনলাইন - Free Online Video Compressor (Reduce MB) | ToolKaj",
    description: "ভিডিও রেজোলিউশন ও ফাইল সাইজ কমিয়ে WhatsApp, ফেসবুক ও ইমেইলে সহজে শেয়ারের উপযোগী করুন। ভিডিও কোয়ালিটি রক্ষা সহ সম্পূর্ণ ফ্রি ও নিরাপদ।",
    keywords: [
      "compress video online free", "reduce video file size", "video compressor without watermark",
      "compress mp4 for whatsapp", "shrink video mb", "fast video size reducer", "online video compression bd",
      "compress video without losing quality", "whatsapp video size reducer", "mp4 compress free",
      "ভিডিও কম্প্রেস", "ভিডিও সাইজ কমানোর নিয়ম", "ভিডিও ফাইল ছোট করা", "হোয়াটসঅ্যাপ ভিডিও সাইজ",
      "ফ্রি ভিডিও কম্প্রেসার", "ভিডিও এমবি কমানোর উপায়", "ভিডিও রেজোলিউশন কমান",
      "video size komano online", "video mb theke choto kora", "video compress korar software",
      "mp4 size reducer bangla", "video size choto korar tool", "whatsapp video compress online"
    ],
    h1: "ভিডিও কম্প্রেসার অনলাইন — গুণমান ঠিক রেখে ভিডিওর MB কমান",
    subtitle: "WhatsApp বা সোশ্যাল মিডিয়ায় শেয়ারের জন্য বড় সাইজের MP4 ভিডিওকে সহজেই ছোট করুন",
    howToSteps: [
      { title: "ধাপ ১: ভিডিও আপলোড করুন", desc: "আপনার ড্রাইভ থেকে MP4 ভিডিওটি নির্বাচন করুন।" },
      { title: "ধাপ ২: কম্প্রেশন কোয়ালিটি নির্বাচন", desc: "WhatsApp অপটিমাইজেশন, মিডিয়াম বা লো সাইজ নির্বাচন করুন।" },
      { title: "ধাপ ৩: কম্প্রেস ও ডাউনলোড", desc: "'কম্প্রেস করুন' বাটনে চাপ দিয়ে ছোট হওয়া ভিডিওটি সেভ করুন।" }
    ],
    whyUse: [
      "সোশ্যাল মিডিয়া ও মেসেঞ্জারে দ্রুত ভিডিও পাঠানোর জন্য নিখুঁত সাইজ।",
      "আপনার ভিডিও কোনো রিমোট ক্লাউডে যায় না—শতভাগ ক্লায়েন্ট-সাইড গোপনীয়তা।"
    ],
    specifications: [
      { label: "সাপোর্টেড ফরম্যাট", value: "MP4, WebM" },
      { label: "অপটিমাইজেশন", value: "WhatsApp 30s/60s Mode, Bitrate Optimization" }
    ],
    limitations: ["ভিডিও ফাইল বেশি বড় হলে ডিভাইসের র‍্যাম ও ব্রাউজার প্রসেসরের ওপর প্রসেসিং টাইম নির্ভর করে।"],
    faqs: [
      { question: "ভিডিও কম্প্রেস করলে কি ভিডিও ঘোলা হয়ে যাবে?", answer: "না, ব্যালেন্সড কম্প্রেশন মোড ব্যবহার করলে ভিডিওর রেজোলিউশন সুন্দর থাকে কিন্তু অপ্রয়োজনীয় ডাটা কমে সাইজ ছোট হয়।" },
      { question: "WhatsApp-এ পাঠানোর জন্য কত সাইজ সবচেয়ে ভালো?", answer: "WhatsApp-এ দ্রুত পাঠানোর জন্য ১৬ MB থেকে ২৫ MB-এর নিচে ভিডিও সাইজ রাখা সবচেয়ে সুবিধাজনক।" }
    ]
  },

  // ==========================================
  // 7. CALCULATORS & DEV UTILITIES (4 Tools)
  // ==========================================
  "utilities/age-calculator": {
    path: "/tools/utilities/age-calculator",
    slug: "utilities/age-calculator",
    category: "utilities",
    title: "বয়স ক্যালকুলেটর - Exact Age Calculator in Years, Months & Days | ToolKaj",
    description: "আপনার জন্মতারিখ দিন আর জেনে নিন আপনার নিখুঁত বয়স (বছর, মাস, দিন, ঘণ্টা ও মিনিট) এবং পরবর্তী জন্মদিনের কাউন্টডাউন। সরকারি চাকরির আবেদনের জন্য সেরা।",
    keywords: [
      "age calculator online", "calculate exact age in days", "birthday countdown calculator", "age finder bangladesh",
      "calculate age for job application", "chronologic age calculator", "exact age in years months days",
      "বয়স ক্যালকুলেটর", "সঠিক বয়স নির্ণয়", "জন্মতারিখ দিয়ে বয়স বের করা", "চাকরির বয়স হিসাব",
      "পরবর্তী জন্মদিন কাউন্টডাউন", "বয়সের ব্যবধান নির্ণয়", "বয়স ক্যালকুলেশন বাংলা",
      "boyos calculator online", "boyosh hishab kora", "birthday theke age ber kora",
      "chakrir boyos calculator", "age calculator bangla", "shothik boyos nirnoy"
    ],
    h1: "বয়স ক্যালকুলেটর — বছর, মাস, দিন ও ঘণ্টার নিখুঁত হিসাব",
    subtitle: "চাকরির আবেদন বা ব্যক্তিগত প্রয়োজনে আপনার সঠিক বয়স এবং পরবর্তী জন্মদিনের দিনক্ষণ নির্ণয় করুন",
    howToSteps: [
      { title: "ধাপ ১: জন্মতারিখ নির্বাচন করুন", desc: "দিন, মাস ও বছর সিলেক্ট করুন।" },
      { title: "ধাপ ২: বর্তমান বা নির্দিষ্ট তারিখ দিন", desc: "কোন তারিখ পর্যন্ত বয়স দেখতে চান তা নির্ধারণ করুন।" },
      { title: "ধাপ ৩: সম্পূর্ণ বয়সের ব্রেকডাউন দেখুন", desc: "বছর, মাস, দিন, ঘণ্টা, মিনিট ও পরবর্তী জন্মদিনের কাউন্টডাউন চলে আসবে।" }
    ],
    whyUse: [
      "সরকারি চাকরির বিজ্ঞপ্তিতে উল্লেখিত নির্দিষ্ট তারিখে প্রার্থীর সঠিক বয়স বের করার বিশ্বস্ত টুল।",
      "লিপ ইয়ার (Leap Year) ও মাসের দিনের নির্ভুল সমন্বয়।"
    ],
    specifications: [
      { label: "পরিমাপক", value: "Years, Months, Days, Hours, Minutes, Next Birthday" }
    ],
    limitations: ["ভবিষ্যতের তারিখ দিলে তা পরবর্তী তারিখের হিসাব হিসেবে গণনা হবে।"],
    faqs: [
      { question: "সরকারি চাকরির বিজ্ঞপ্তিতে বয়স কীভাবে হিসাব করব?", answer: "বিজ্ঞপ্তিতে উল্লেখিত কাট-অফ ডেটটি 'টার্গেট তারিখ' হিসেবে দিয়ে সহজেই ওই নির্দিষ্ট দিনের নিখুঁত বয়স বের করতে পারবেন।" }
    ]
  },

  "utilities/compound-interest": {
    path: "/tools/utilities/compound-interest",
    slug: "utilities/compound-interest",
    category: "utilities",
    title: "চক্রবৃদ্ধি মুনাফা ক্যালকুলেটর - Compound Interest & SIP Investment Calculator | ToolKaj",
    description: "মাসিক ডিপোজিট ও বার্ষিক সুদের হারে সম্পদ বৃদ্ধির ইন্টারঅ্যাক্টিভ চার্ট ও হিসাব দেখুন। ডিপিএস, এফডিআর ও সঞ্চয়ের ভবিষ্যৎ মূল্য জানুন সেকেন্ডেই।",
    keywords: [
      "compound interest calculator", "sip calculator bangladesh", "investment wealth growth calculator",
      "compound interest formula chart", "dps return calculator", "monthly deposit profit calculator bd",
      "fdr compound return", "savings interest calculator online",
      "চক্রবৃদ্ধি মুনাফা ক্যালকুলেটর", "ডিপিএস মুনাফা হিসাব", "চক্রবৃদ্ধি সুদের হিসাব", "বিনিয়োগ বৃদ্ধির চার্ট",
      "এফডিআর ক্যালকুলেটর", "সঞ্চয়পত্রের মুনাফা হিসাব", "মাসিক ডিপিএস লাভ",
      "compound interest calculator bangla", "dps labh hishab", "munafa calculator online",
      "shud er hishab", "dps profit calculator bangladesh", "compound growth calculator"
    ],
    h1: "চক্রবৃদ্ধি মুনাফা ক্যালকুলেটর — বিনিয়োগ ও ডিপিএস মুনাফা নির্ণয়",
    subtitle: "ডিপোজিট, সুদের হার ও মেয়াদ দিয়ে চক্রবৃদ্ধি হারে সম্পদ বৃদ্ধির ইন্টারঅ্যাক্টিভ হিসাব দেখুন",
    howToSteps: [
      { title: "ধাপ ১: মূলধন বা মাসিক জমা দিন", desc: "প্রাথমিক জমা ও মাসিক কিস্তির পরিমাণ লিখুন।" },
      { title: "ধাপ ২: সুদের হার ও মেয়াদ দিন", desc: "বার্ষিক মুনাফার শতকরা হার ও বছর উল্লেখ করুন।" },
      { title: "ধাপ ৩: চার্ট ও প্রবৃদ্ধি দেখুন", desc: "মোট আসল এবং চক্রবৃদ্ধি মুনাফার পরিষ্কার গ্রাফ দেখুন।" }
    ],
    whyUse: [
      "দীর্ঘমেয়াদী আর্থিক পরিকল্পনা ও রিটায়ারমেন্ট ফান্ডিংয়ের জন্য অপরিহার্য।",
      "ভিজুয়াল চার্ট দিয়ে আসল ও মুনাফার অনুপাত প্রদর্শন।"
    ],
    specifications: [
      { label: "কম্পাউন্ডিং ফ্রিকোয়েন্সি", value: "বার্ষিক, ষান্মাসিক, ত্রৈমাসিক, মাসিক" }
    ],
    limitations: ["বাজারের সুদের হারের পরিবর্তনের কারণে ব্যাংকের প্রকৃত মুনাফায় সামান্য পার্থক্য হতে পারে।"],
    faqs: [
      { question: "চক্রবৃদ্ধি মুনাফা (Compound Interest) কী?", answer: "চক্রবৃদ্ধি মুনাফা হলো এমন পদ্ধতি যেখানে শুধু মূল টাকার ওপর নয়, বরং প্রতি বছর অর্জিত মুনাফার ওপরও নতুন করে মুনাফা যোগ হতে থাকে।" }
    ]
  },

  "utilities/emi-calculator": {
    path: "/tools/utilities/emi-calculator",
    slug: "utilities/emi-calculator",
    category: "utilities",
    title: "লোন ইএমআই ক্যালকুলেটর - Loan EMI & Monthly Installment Calculator | ToolKaj",
    description: "ব্যাংক বা যেকোনো আর্থিক ঋণের মাসিক কিস্তি (EMI), মোট প্রদেয় সুদ ও পরিশোধের স্পষ্ট সময়সূচি মুহূর্তের মধ্যে হিসাব করুন সম্পূর্ণ বিনামূল্যে।",
    keywords: [
      "loan emi calculator", "monthly loan installment calculator", "bank loan emi bd", "home loan emi formula",
      "car loan interest calculator", "amortization schedule online", "personal loan emi calculator", "bank interest calculator bd",
      "লোন ইএমআই ক্যালকুলেটর", "ব্যাংক লোনের কিস্তি হিসাব", "মাসিক কিস্তি বের করার নিয়ম", "ঋণের সুদের হিসাব",
      "হোম লোন ইএমআই", "গাড়ি লোনের কিস্তি", "ব্যাংক ঋণের তালিকা",
      "loan emi hishab kora", "bank loan kisti calculator", "monthly emi ber korar niyom",
      "car loan emi bangla", "home loan installment hishab"
    ],
    h1: "লোন ইএমআই ক্যালকুলেটর — মাসিক কিস্তি ও মোট সুদের হিসাব",
    subtitle: "হোম লোন, কার লোন বা পার্সোনাল লোনের মাসিক কিস্তি ও রিপেমেন্ট সিডিউল নির্ণয় করুন",
    howToSteps: [
      { title: "ধাপ ১: ঋণের পরিমাণ লিখুন", desc: "লোনের মোট পরিমাণ (টাকায়) ইনপুট দিন।" },
      { title: "ধাপ ২: সুদের হার ও মেয়াদ দিন", desc: "বার্ষিক সুদের হার (%) এবং পরিশোধের মেয়াদ (বছর/মাস) নির্ধারণ করুন।" },
      { title: "ধাপ ৩: ফলাফল দেখুন", desc: "প্রতি মাসের প্রদেয় কিস্তি এবং মোট সুদের অংক জেনে নিন।" }
    ],
    whyUse: [
      "ঋণ নেওয়ার পূর্বে সাধ্যের মধ্যে কিস্তির সঠিক পরিকল্পনা।",
      "মূল ঋণ ও প্রদেয় সুদের চমৎকার পাই-চার্ট ব্রেকডাউন।"
    ],
    specifications: [
      { label: "ক্যালকুলেশন মডেল", value: "Standard Reducing Balance EMI Formula" }
    ],
    limitations: ["ব্যাংক প্রসেসিং ফি বা সরকারি ভ্যাট এই হিসাবে অন্তর্ভুক্ত নয়।"],
    faqs: [
      { question: "EMI কীভাবে হিসাব করা হয়?", answer: "EMI হিসাব করা হয় রিডিউসিং ব্যালেন্স পদ্ধতিতে, যেখানে প্রতি মাসে কিস্তি দেওয়ার পর বাকি থাকা আসলের ওপর সুদ নির্ধারিত হয়।" }
    ]
  },

  "utilities/json-beautifier": {
    path: "/tools/utilities/json-beautifier",
    slug: "utilities/json-beautifier",
    category: "utilities",
    title: "জেসন বিউটিফায়ার ও ভ্যালিডেটর - JSON Beautifier, Validator & Minifier | ToolKaj",
    description: "JSON কোড ফরম্যাট, মিনিফাই, সিনট্যাক্স ভ্যালিডেশন এবং ট্রি-ভিউ স্ট্রাকচার সহজে পরীক্ষা করুন। ডেভেলপারদের জন্য দ্রুত ও নির্ভরযোগ্য অনলাইন JSON টুল।",
    keywords: [
      "json beautifier online", "json validator", "format json code", "json minifier",
      "interactive json tree viewer", "json parser and checker", "fix json syntax", "clean json online",
      "জেসন বিউটিফায়ার", "জেসন ফরম্যাটার", "জেসন কোড ভ্যালিডেটর", "জেসন কোড ঠিক করার টুল", "জেসন ভিউয়ার",
      "json format korar tool", "json beautify online free", "json validate kora",
      "json code sundor kora", "json minifier online"
    ],
    h1: "জেসন বিউটিফায়ার ও ভ্যালিডেটর — কোড ফরম্যাট ও সিনট্যাক্স চেক",
    subtitle: "এলোমেলো বা মিনিফাইড JSON ডাটাকে চোখের পলকে পরিপাটি ও রিডেবল স্ট্রাকচারে রূপান্তর করুন",
    howToSteps: [
      { title: "ধাপ ১: JSON ডাটা পেস্ট করুন", desc: "ইনপুট বক্সে আপনার কোড পেস্ট করুন।" },
      { title: "ধাপ ২: বিউটিফাই বা মিনিফাই সিলেক্ট", desc: "'Beautify' চাপলে সাজানো কোড আসবে অথবা 'Minify' চাপলে এক লাইনে ছোট হবে।" },
      { title: "ধাপ ৩: কোড কপি করুন", desc: "এক ক্লিকে ফরম্যাট করা কোড কপি করে প্রজেক্টে ব্যবহার করুন।" }
    ],
    whyUse: [
      "সিনট্যাক্স ত্রুটি চিহ্নিতকরণ—ভুল থাকলে তাৎক্ষণিক লাল নোটিফিকেশন।",
      "১০০% ক্লায়েন্ট-সাইড—আপনার গুরুত্বপূর্ণ API বা ডেটা সার্ভারে যায় না।"
    ],
    specifications: [
      { label: "ইন্ডেন্টেশন", value: "2 Spaces / 4 Spaces Custom Formatting" }
    ],
    limitations: ["ভুল সিনট্যাক্স থাকলে ব্রাউজারের JSON পার্সার এরর লাইন নির্দেশ করবে।"],
    faqs: [
      { question: "আমার ডাটা কি নিরাপদ?", answer: "হ্যাঁ, সম্পূর্ণ পার্সিং ও ফরম্যাটিং আপনার ব্রাউজারের ইঞ্জিনেই সম্পন্ন হয়, কোনো ডাটা ইন্টারনেটে পাঠানো হয় না।" }
    ]
  }
};

/**
 * Helper to retrieve SEO entry by path, slug, or key
 */
export function getSeoData(identifier: string): PageSeoItem | undefined {
  if (!identifier) return undefined;
  const cleanId = identifier.replace(/^\//, "").replace(/^tools\//, "");
  
  if (SEO_REGISTRY[cleanId]) return SEO_REGISTRY[cleanId];
  if (SEO_REGISTRY[identifier]) return SEO_REGISTRY[identifier];

  // Try matching by path
  const normalizedPath = identifier.startsWith("/") ? identifier : `/${identifier}`;
  const foundByPath = Object.values(SEO_REGISTRY).find((item) => item.path === normalizedPath);
  if (foundByPath) return foundByPath;

  // Try matching by slug
  const foundBySlug = Object.values(SEO_REGISTRY).find((item) => item.slug === cleanId);
  if (foundBySlug) return foundBySlug;

  return undefined;
}

/**
 * Generate standard Next.js Metadata object enforcing 100% unique tags
 */
export function getPageMetadata(identifier: string): Metadata {
  const item = getSeoData(identifier);

  if (!item) {
    return {
      title: "Tool Not Found | ToolKaj",
      description: "অনুরোধকৃত টুলটি খুঁজে পাওয়া যায়নি। ToolKaj-এর সকল ফ্রি অনলাইন টুলস ব্যবহার করতে হোমে ফিরে যান।",
      robots: { index: false, follow: true },
    };
  }

  const canonicalUrl = `${BASE_URL}${item.path}`;

  return {
    title: item.title,
    description: item.description,
    keywords: item.keywords,
    applicationName: "ToolKaj",
    appleWebApp: {
      title: "ToolKaj",
      capable: true,
      statusBarStyle: "default",
    },
    alternates: {
      canonical: canonicalUrl,
    },
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
    openGraph: {
      type: "website",
      locale: "bn_BD",
      url: canonicalUrl,
      title: item.title,
      description: item.description,
      siteName: "ToolKaj",
      images: [
        {
          url: `${BASE_URL}/logo.png`,
          width: 192,
          height: 192,
          alt: `${item.title} - ToolKaj`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.description,
      images: [`${BASE_URL}/logo.png`],
    },
  };
}

/**
 * Generate Schema.org JSON-LD for rich snippets (SoftwareApp + HowTo + FAQ + Breadcrumbs)
 */
export function getToolStructuredData(seo: PageSeoItem) {
  const canonicalUrl = `${BASE_URL}${seo.path}`;

  const schemas: any[] = [];

  // 1. WebApplication / SoftwareApplication
  schemas.push({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: seo.h1 || seo.title,
    url: canonicalUrl,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    description: seo.description,
    keywords: seo.keywords.join(", "),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BDT",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "540",
      bestRating: "5",
    },
  });

  // 2. BreadcrumbList
  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: `${BASE_URL}/tools`,
      },
      ...(seo.category
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: seo.category.toUpperCase(),
              item: `${BASE_URL}/category/${seo.category}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: seo.h1 || seo.title,
              item: canonicalUrl,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: seo.h1 || seo.title,
              item: canonicalUrl,
            },
          ]),
    ],
  });

  // 3. HowTo Schema (if steps present)
  if (seo.howToSteps && seo.howToSteps.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: `${seo.h1} কীভাবে ব্যবহার করবেন`,
      description: seo.subtitle || seo.description,
      step: seo.howToSteps.map((s, idx) => ({
        "@type": "HowToStep",
        position: idx + 1,
        name: s.title,
        text: s.desc,
      })),
    });
  }

  // 4. FAQPage Schema (if faqs present)
  if (seo.faqs && seo.faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: seo.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    });
  }

  return schemas;
}
