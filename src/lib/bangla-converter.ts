/**
 * Comprehensive Bengali utilities:
 * 1. Bijoy (ANSI) <-> Unicode conversion
 * 2. Banglish to Bengali phonetic transliteration
 * 3. Number to Words (Bengali & English Currency)
 */

import { ConvertToUnicode, ConvertToASCII } from "./unicode2ascii";

export function convertBijoyToUnicode(src: string): string {
  if (!src) return "";
  return ConvertToUnicode("bijoy", src);
}

export function convertUnicodeToBijoy(src: string): string {
  if (!src) return "";
  return ConvertToASCII("bijoy", src);
}

// --- Banglish to Bengali Phonetic Transliteration ---
const phoneticMap: Record<string, string> = {
  k: "ক", kh: "খ", g: "গ", gh: "ঘ", ng: "ঙ",
  ch: "চ", chh: "ছ", c: "চ", j: "জ", jh: "ঝ",
  t: "ট", th: "ঠ", d: "ড", dh: "ঢ", n: "ন",
  T: "ত", Th: "থ", D: "দ", Dh: "ধ",
  p: "প", f: "ফ", ph: "ফ", b: "ব", bh: "ভ", v: "ভ", m: "ম",
  z: "য", r: "র", l: "ল", sh: "শ", Sh: "ষ", s: "স", h: "হ",
  R: "ড়", Rh: "ঢ়", y: "য়",
  aa: "া", a: "", i: "ি", ee: "ী", I: "ী",
  u: "ু", oo: "ূ", U: "ূ", e: "ে", oi: "ৈ", o: "ো", ou: "ৌ",
  ri: "ৃ",
};

export function convertBanglishToBangla(input: string): string {
  if (!input) return "";

  // Comprehensive common words dictionary for high precision
  const commonWords: Record<string, string> = {
    "ami": "আমি", "tumi": "তুমি", "apni": "আপনি", "amra": "আমরা",
    "tomra": "তোমরা", "apnara": "আপনারা", "tara": "তারা", "se": "সে", "tini": "তিনি",
    "kemon": "কেমন", "acho": "আছো", "achen": "আছেন", "achis": "আছিস",
    "valo": "ভালো", "bhalo": "ভালো", "dhonnobad": "ধন্যবাদ", "bangla": "বাংলা",
    "bangladesh": "বাংলাদেশ", "amar": "আমার", "tomar": "তোমার", "apnar": "আপনার",
    "sonar": "সোনার", "desh": "দেশ", "ki": "কী", "kire": "কীরে", "keno": "কেন",
    "kothay": "কোথায়", "kokhon": "কখন", "kivabe": "কীভাবে", "ke": "কে",
    "nam": "নাম", "korcho": "করছো", "korchen": "করছেন", "korchi": "করছি",
    "koro": "করো", "korbo": "করবো", "korte": "করতে", "hobe": "হবে",
    "hoy": "হয়", "holo": "হলো", "ekhon": "এখন", "shob": "সব",
    "kaj": "কাজ", "sohoz": "সহজ", "shundor": "সুন্দর", "onek": "অনেক",
    "valobashi": "ভালোবাসি", "bhalobashi": "ভালোবাসি", "bondhu": "বন্ধু",
    "bhai": "ভাই", "bon": "বোন", "baba": "বাবা", "ma": "মা",
    "shobai": "সবাই", "dhaka": "ঢাকা", "bari": "বাড়ি", "thako": "থাকো",
    "khobor": "খবর", "kotha": "কথা", "bolo": "বলো", "bolchi": "বলছি",
    "shuno": "শুনো", "jani": "জানি", "janina": "জানিনা", "parbo": "পারবো",
    "ashbo": "আসবো", "jachhi": "যাচ্ছি", "dekho": "দেখো", "dekhte": "দেখতে",
    "khabar": "খাবার", "pani": "পানি", "shomoy": "সময়", "din": "দিন",
    "raat": "রাত", "shokal": "সকাল", "shondha": "সন্ধ্যা", "shobthike": "সবথেকে",
    "notun": "নতুন", "puran": "পুরান", "shothik": "সঠিক", "vul": "ভুল",
  };

  // Phonetic rule-based transliterator for any other word
  const transliterateWord = (word: string): string => {
    const lower = word.toLowerCase();
    if (commonWords[lower]) {
      return commonWords[lower];
    }

    // Rules for phonetics
    const initialVowels: [RegExp, string][] = [
      [/^aa/i, "আ"], [/^a/i, "অ"], [/^ee/i, "ঈ"], [/^i/i, "ই"],
      [/^oo/i, "ঊ"], [/^u/i, "উ"], [/^e/i, "এ"], [/^oi/i, "ঐ"],
      [/^o/i, "ও"], [/^ou/i, "ঔ"],
    ];

    const consonants: [string, string][] = [
      ["kkh", "ক্ষ"], ["kkh", "ক্ষ"], ["chh", "ছ"], ["sh", "শ"],
      ["th", "থ"], ["dh", "ধ"], ["kh", "খ"], ["gh", "ঘ"],
      ["ch", "চ"], ["jh", "ঝ"], ["ph", "ফ"], ["bh", "ভ"],
      ["ng", "ঙ"], ["k", "ক"], ["g", "গ"], ["j", "জ"],
      ["t", "ত"], ["d", "দ"], ["n", "ন"], ["p", "প"],
      ["b", "ব"], ["v", "ভ"], ["f", "ফ"], ["m", "ম"],
      ["r", "র"], ["l", "ল"], ["s", "স"], ["h", "হ"],
      ["y", "য়"], ["z", "য"],
    ];

    const vowelKars: [string, string][] = [
      ["aa", "া"], ["a", "া"], ["ee", "ী"], ["i", "ি"],
      ["oo", "ূ"], ["u", "ু"], ["e", "ে"], ["oi", "ৈ"],
      ["o", "ো"], ["ou", "ৌ"],
    ];

    let res = "";
    let i = 0;
    const len = word.length;

    // Check initial vowel
    for (const [pattern, bengali] of initialVowels) {
      const match = word.slice(i).match(pattern);
      if (match) {
        res += bengali;
        i += match[0].length;
        break;
      }
    }

    while (i < len) {
      let matched = false;

      // Try matching consonant
      for (const [eng, bng] of consonants) {
        if (word.slice(i, i + eng.length).toLowerCase() === eng) {
          res += bng;
          i += eng.length;
          matched = true;

          // Check if followed by vowel kar
          for (const [vEng, vKar] of vowelKars) {
            if (word.slice(i, i + vEng.length).toLowerCase() === vEng) {
              res += vKar;
              i += vEng.length;
              break;
            }
          }
          break;
        }
      }

      if (!matched) {
        // Unknown or punctuation
        res += word[i];
        i++;
      }
    }

    return res || word;
  };

  const tokens = input.split(/(\s+|[.,!?;:])/);
  return tokens
    .map((token) => {
      if (!token || /^\s+$/.test(token) || /^[.,!?;:]$/.test(token)) {
        return token;
      }
      return transliterateWord(token);
    })
    .join("");
}

// --- Number to Words (Bengali & English) ---
const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const enDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export function toBengaliNumeral(num: string | number): string {
  return String(num).replace(/[0-9]/g, (w) => bnDigits[+w]);
}

export function toEnglishNumeral(num: string | number): string {
  return String(num).replace(/[০-৯]/g, (w) => String(bnDigits.indexOf(w)));
}

const bnOnes = [
  "", "এক", "দুই", "তিন", "চার", "পাঁচ", "ছয়", "সাত", "আট", "নয়", "দশ",
  "এগারো", "বারো", "তেরো", "চৌদ্দ", "পনেরো", "ষোলো", "সতেরো", "আঠারো", "উনিশ", "বিশ",
  "একুশ", "বাইশ", "তেইশ", "চব্বিশ", "পঁচিশ", "ছাব্বিশ", "সাতাশ", "আটাশ", "উনত্রিশ", "ত্রিশ",
  "একত্রিশ", "বত্রিশ", "তেত্রিশ", "চৌত্রিশ", "পঁয়ত্রিশ", "ছত্রিশ", "সাঁইত্রিশ", "আটত্রিশ", "উনচল্লিশ", "চল্লিশ",
  "একচল্লিশ", "বিয়াল্লিশ", "তেতাল্লিশ", "চুয়াল্লিশ", "পঁয়তাল্লিশ", "ছেচল্লিশ", "সাতচল্লিশ", "আটচল্লিশ", "উনপঞ্চাশ", "পঞ্চাশ",
  "একান্ন", "বায়ান্ন", "তিপ্পান্ন", "চুয়ান্ন", "পঞ্চান্ন", "ছাপ্পান্ন", "সাতান্ন", "আটান্ন", "উনষাট", "ষাট",
  "একষট্টি", "বাষট্টি", "তেষট্টি", "চৌষট্টি", "পঁয়ষট্টি", "ছেষট্টি", "সাতষট্টি", "আটষট্টি", "উনসত্তর", "সত্তর",
  "একাত্তর", "বাহাত্তর", "তিয়াত্তর", "চুয়াত্তর", "পঁচাত্তর", "ছিয়াত্তর", "সাতাত্তর", "আটাত্তর", "উনাশি", "আশি",
  "একাশি", "বিরাশি", "তিরাশি", "চুরাশি", "পঁচাশি", "ছিয়াশি", "সাতাশি", "অষ্টআশি", "উননব্বই", "নব্বই",
  "একানব্বই", "বানব্বই", "তিরানব্বই", "চুরানব্বই", "পঁচানব্বই", "ছিয়ানব্বই", "সাতানব্বই", "আটানব্বই", "নিরানব্বই"
];

const enOnes = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
];
const enTens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

export function numberToWordsEn(n: number): string {
  if (n === 0) return "Zero";
  if (n < 0) return "Minus " + numberToWordsEn(Math.abs(n));

  let words = "";

  if (Math.floor(n / 10000000) > 0) {
    words += numberToWordsEn(Math.floor(n / 10000000)) + " Crore ";
    n %= 10000000;
  }

  if (Math.floor(n / 100000) > 0) {
    words += numberToWordsEn(Math.floor(n / 100000)) + " Lakh ";
    n %= 100000;
  }

  if (Math.floor(n / 1000) > 0) {
    words += numberToWordsEn(Math.floor(n / 1000)) + " Thousand ";
    n %= 1000;
  }

  if (Math.floor(n / 100) > 0) {
    words += numberToWordsEn(Math.floor(n / 100)) + " Hundred ";
    n %= 100;
  }

  if (n > 0) {
    if (n < 20) {
      words += enOnes[n] + " ";
    } else {
      words += enTens[Math.floor(n / 10)] + " ";
      if (n % 10 > 0) {
        words += enOnes[n % 10] + " ";
      }
    }
  }

  return words.trim();
}

export function numberToWordsBn(n: number): string {
  if (n === 0) return "শূন্য";
  if (n < 0) return "ঋণাত্মক " + numberToWordsBn(Math.abs(n));

  let words = "";

  if (Math.floor(n / 10000000) > 0) {
    words += numberToWordsBn(Math.floor(n / 10000000)) + " কোটি ";
    n %= 10000000;
  }

  if (Math.floor(n / 100000) > 0) {
    words += bnOnes[Math.floor(n / 100000)] + " লাখ ";
    n %= 100000;
  }

  if (Math.floor(n / 1000) > 0) {
    words += bnOnes[Math.floor(n / 1000)] + " হাজার ";
    n %= 1000;
  }

  if (Math.floor(n / 100) > 0) {
    words += bnOnes[Math.floor(n / 100)] + " শত ";
    n %= 100;
  }

  if (n > 0 && n < 100) {
    words += bnOnes[n] + " ";
  }

  return words.trim();
}
