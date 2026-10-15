// Full-featured, battle-tested Bijoy 52 / SutonnyMJ ANSI <-> Unicode Converter Engine

function isPreKar(char: string): boolean {
  return char === "ি" || char === "ৈ" || char === "ে";
}

function isBanglaConsonant(char: string): boolean {
  return (
    char === "ক" || char === "খ" || char === "গ" || char === "ঘ" || char === "ঙ" ||
    char === "চ" || char === "ছ" || char === "জ" || char === "ঝ" || char === "ঞ" ||
    char === "ট" || char === "ঠ" || char === "ড" || char === "ঢ" || char === "ণ" ||
    char === "ত" || char === "থ" || char === "দ" || char === "ধ" || char === "ন" ||
    char === "প" || char === "ফ" || char === "ব" || char === "ভ" || char === "ম" ||
    char === "শ" || char === "ষ" || char === "স" || char === "হ" || char === "য" ||
    char === "র" || char === "ল" || char === "য়" || char === "ং" || char === "ঃ" ||
    char === "ঁ" || char === "ৎ"
  );
}

function isHalant(char: string): boolean {
  return char === "্";
}

function isPostKar(char: string): boolean {
  return (
    char === "া" || char === "ো" || char === "ৌ" || char === "ৗ" ||
    char === "ু" || char === "ূ" || char === "ী" || char === "ৃ"
  );
}

function isKar(char: string): boolean {
  return isPreKar(char) || isPostKar(char);
}

function isAnusvarOrVisarga(char: string): boolean {
  return char === "ং" || char === "ঃ" || char === "ঁ";
}

function isSpaceOrNewline(char: string): boolean {
  return char === " " || char === "\t" || char === "\n" || char === "\r";
}

const unicodeToBijoyMap: Record<string, string> = {
  "।": "|", "‘": "Ô", "’": "Õ", "“": "Ò", "”": "Ó",
  "্র্য": "ª¨", "র‌্য": "i¨",
  "ক্ক": "°", "ক্ট": "±", "ক্ত": "³", "ক্ব": "K¡", "স্ক্র": "¯Œ", "ক্র": "µ", "ক্ল": "K¬", "ক্ষ": "¶", "ক্স": "·",
  "গু": "¸", "গ্ধ": "»", "গ্ন": "Mœ", "গ্ম": "M¥", "গ্ল": "M­", "গ্রু": "Mªy",
  "ঙ্ক": "¼", "ঙ্ক্ষ": "•¶", "ঙ্খ": "•L", "ঙ্গ": "½", "ঙ্ঘ": "•N",
  "চ্চ": "”P", "চ্ছ": "”Q", "চ্ছ্ব": "”Q¡", "চ্ঞ": "”T",
  "জ্জ্ব": "¾¡", "জ্জ": "¾", "জ্ঝ": "À", "জ্ঞ": "Á", "জ্ব": "R¡",
  "ঞ্চ": "Â", "ঞ্ছ": "Ã", "ঞ্জ": "Ä", "ঞ্ঝ": "Å",
  "ট্ট": "Æ", "ট্ব": "U¡", "ট্ম": "U¥", "ড্ড": "Ç", "ণ্ট": "È", "ণ্ঠ": "É", "ন্স": "Ý", "ণ্ড": "Ê", "ন্তু": "š‘", "ণ্ব": "Y^",
  "ত্ত": "Ë", "ত্ত্ব": "Ë¡", "ত্থ": "Ì", "ত্ন": "Zœ", "ত্ম": "Z¥", "ন্ত্ব": "š—¡", "ত্ব": "Z¡", "থ্ব": "_¡",
  "দ্গ": "˜M", "দ্ঘ": "˜N", "দ্দ": "Ï", "দ্ধ": "×", "দ্ব": "˜¡", "দ্ভ": "™¢", "দ্ম": "Ù", "দ্রু": "`ª“",
  "ধ্ব": "aŸ", "ধ্ম": "a¥", "ন্ট": "›U", "ন্ঠ": "Ú", "ন্ড": "Û", "ন্ত্র": "š¿", "ন্ত": "š—", "স্ত্র": "¯¿", "ত্র": "Î", "ন্থ": "š’",
  "ন্দ": "›`", "ন্দ্ব": "›Ø", "ন্ধ": "Ü", "ন্ন": "bœ", "ন্ব": "š^", "ন্ম": "b¥",
  "প্ট": "Þ", "প্ত": "ß", "প্ন": "cœ", "প্প": "à", "প্ল": "c­", "প্স": "á", "ফ্ল": "d¬",
  "ব্জ": "â", "ব্দ": "ã", "ব্ধ": "ä", "ব্ব": "eŸ", "ব্ল": "e­", "ভ্র": "å",
  "ম্ন": "gœ", "ম্প": "¤ú", "ম্ফ": "ç", "ম্ব": "¤^", "ম্ভ": "¤¢", "ম্ভ্র": "¤£", "ম্ম": "¤§", "ম্ল": "¤­",
  "রু": "i“", "রূ": "iƒ", "ল্ক": "é", "ল্গ": "ê", "ল্প": "í", "ল্ট": "ë", "ল্ড": "ì", "ল্ফ": "î", "ল্ব": "j¦", "ল্ম": "j¥", "ল্ল": "jø",
  "শু": "ï", "শ্চ": "ð", "শ্ন": "kœ", "শ্ব": "k¦", "শ্ম": "k¥", "শ্ল": "kø",
  "ষ্ক": "®‹", "ষ্ক্র": "®Œ", "ষ্ট": "ó", "ষ্ঠ": "ô", "ষ্ণ": "ò", "ষ্প": "®ú", "ষ্ফ": "õ", "ষ্ম": "®§",
  "স্ক": "¯‹", "স্ট": "÷", "স্খ": "ö", "স্ত": "¯—", "স্তু": "¯‘", "স্থ": "¯’", "স্ন": "mœ", "স্প": "¯ú", "স্ফ": "ù", "স্ব": "¯^", "স্ম": "¯§", "স্ল": "¯­",
  "হু": "û", "হ্ণ": "nè", "হ্ন": "ý", "হ্ম": "þ", "হ্ল": "n¬", "হৃ": "ü",
  "র্": "©", "্র": "«", "্য": "¨", "্": "&",
  "আ": "Av", "অ": "A", "ই": "B", "ঈ": "C", "উ": "D", "ঊ": "E", "ঋ": "F", "এ": "G", "ঐ": "H", "ও": "I", "ঔ": "J",
  "ক": "K", "খ": "L", "গ": "M", "ঘ": "N", "ঙ": "O", "চ": "P", "ছ": "Q", "জ": "R", "ঝ": "S", "ঞ": "T",
  "ট": "U", "ঠ": "V", "ড": "W", "ঢ": "X", "ণ": "Y", "ত": "Z", "থ": "_", "দ": "`", "ধ": "a", "ন": "b",
  "প": "c", "ফ": "d", "ব": "e", "ভ": "f", "ম": "g", "য": "h", "র": "i", "ল": "j", "শ": "k", "ষ": "l",
  "স": "m", "হ": "n", "ড়": "o", "ঢ়": "p", "য়": "q", "ৎ": "r",
  "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4", "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
  "া": "v", "ি": "w", "ী": "x", "ু": "y", "ূ": "~", "ৃ": "…", "ে": "‡", "ৈ": "‰", "ৗ": "Š", "ং": "s", "ঃ": "t", "ঁ": "u"
};

function reorderUnicodeForBijoy(text: string): string {
  let str = text;
  for (let idx = 0, j = 0; j < str.length; j++) {
    if (j < str.length && isPreKar(str.charAt(j))) {
      let count = 1;
      while (isBanglaConsonant(str.charAt(j - count)) && !(j - count < 0 || j - count <= idx)) {
        if (isHalant(str.charAt(j - count - 1))) {
          count += 2;
        } else {
          break;
        }
      }
      let sub = str.substring(0, j - count);
      sub += str.charAt(j);
      sub += str.substring(j - count, j);
      sub += str.substring(j + 1, str.length);
      str = sub;
      idx = j + 1;
      continue;
    }
    if (j < str.length - 1 && isHalant(str.charAt(j)) && str.charAt(j - 1) === "র" && !isHalant(str.charAt(j - 2))) {
      let count = 1;
      let offset = 0;
      while (true) {
        if (isBanglaConsonant(str.charAt(j + count)) && isHalant(str.charAt(j + count + 1))) {
          count += 2;
        } else if (isBanglaConsonant(str.charAt(j + count)) && isPreKar(str.charAt(j + count + 1))) {
          offset = 1;
          break;
        } else {
          break;
        }
      }
      let sub = str.substring(0, j - 1);
      sub += str.substring(j + count + 1, j + count + offset + 1);
      sub += str.substring(j + 1, j + count + 1);
      sub += str.charAt(j - 1);
      sub += str.charAt(j);
      sub += str.substring(j + count + offset + 1, str.length);
      str = sub;
      j += count + offset;
      idx = j + 1;
      continue;
    }
  }
  return str;
}

export function ConvertToASCII(_mode: string, input: string): string {
  if (!input) return "";
  let str = input;
  str = str.replace(/ো/g, "ো");
  str = str.replace(/ৌ/g, "ৌ");
  str = reorderUnicodeForBijoy(str);

  for (const unicodeChar in unicodeToBijoyMap) {
    const regex = new RegExp(unicodeChar, "g");
    str = str.replace(regex, unicodeToBijoyMap[unicodeChar]);
  }
  return str;
}

const bijoyToUnicodeMap: Record<string, string> = {
  "i¨": "র‌্য", "ª¨": "্র্য", "°": "ক্ক", "±": "ক্ট", "³": "ক্ত", "K¡": "ক্ব", "¯Œ": "স্ক্র", "µ": "ক্র", "K¬": "ক্ল",
  "¶": "ক্ষ", "ÿ": "ক্ষ", "·": "ক্স", "¸": "গু", "»": "গ্ধ", "Mœ": "গ্ন", "M¥": "গ্ম", "M­": "গ্ল",
  "¼": "ঙ্ক", "•¶": "ঙ্ক্ষ", "•L": "ঙ্খ", "½": "ঙ্গ", "•N": "ঙ্ঘ", "•": "ক্স",
  "”P": "চ্চ", "”Q": "চ্ছ", "”Q¡": "চ্ছ্ব", "”T": "চ্ঞ", "¾¡": "জ্জ্ব", "¾": "জ্জ", "À": "জ্ঝ", "Á": "জ্ঞ", "R¡": "জ্ব",
  "Â": "ঞ্চ", "Ã": "ঞ্ছ", "Ä": "ঞ্জ", "Å": "ঞ্ঝ", "Æ": "ট্ট", "U¡": "ট্ব", "U¥": "ট্ম", "Ç": "ড্ড", "È": "ণ্ট", "É": "ণ্ঠ",
  "Ý": "ন্স", "Ê": "ণ্ড", "š‘": "ন্তু", "Y\\^": "ণ্ব", "Ë": "ত্ত", "Ë¡": "ত্ত্ব", "Ì": "ত্থ", "Z¥": "ত্ম", "š—¡": "ন্ত্ব", "Z¡": "ত্ব",
  "Î": "ত্র", "_¡": "থ্ব", "˜M": "দ্গ", "˜N": "দ্ঘ", "Ï": "দ্দ", "×": "দ্ধ", "˜¡": "দ্ব", "Ø": "দ্ব", "™¢": "দ্ভ", "Ù": "দ্ম",
  "`ª“": "দ্রু", "aŸ": "ধ্ব", "a¥": "ধ্ম", "›U": "ন্ট", "Ú": "ন্ঠ", "Û": "ন্ড", "šÍ": "ন্ত", "š—": "ন্ত", "š¿": "ন্ত্র", "š’": "ন্থ",
  "›`": "ন্দ", "›Ø": "ন্দ্ব", "Ü": "ন্ধ", "bœ": "ন্ন", "š\\^": "ন্ব", "b¥": "ন্ম",
  "Þ": "প্ট", "ß": "প্ত", "cœ": "প্ন", "à": "প্প", "cø": "প্ল", "c­": "প্ল", "á": "প্স", "d¬": "ফ্ল",
  "â": "ব্জ", "ã": "ব্দ", "ä": "ব্ধ", "eŸ": "ব্ব", "e­": "ব্ল", "å": "ভ্র", "gœ": "ম্ন", "¤ú": "ম্প", "ç": "ম্ফ",
  "¤\\^": "ম্ব", "¤¢": "ম্ভ", "¤£": "ম্ভ্র", "¤§": "ম্ম", "¤­": "ম্ল",
  "i“": "রু", "iæ": "রু", "iƒ": "রূ", "é": "ল্ক", "ê": "ল্গ", "ë": "ল্ট", "ì": "ল্ড", "í": "ল্প", "î": "ল্ফ",
  "j¦": "ল্ব", "j¥": "ল্ম", "jø": "ল্ল", "ï": "শু", "ð": "শ্চ", "kœ": "শ্ন", "kø": "শ্ল", "k¦": "শ্ব", "k¥": "শ্ম", "k­": "শ্ল",
  "®‹": "ষ্ক", "®Œ": "ষ্ক্র", "ó": "ষ্ট", "ô": "ষ্ঠ", "ò": "ষ্ণ", "®ú": "ষ্প", "õ": "ষ্ফ", "®§": "ষ্ম",
  "¯‹": "স্ক", "÷": "স্ট", "ö": "স্খ", "¯—": "স্ত", "¯Í": "স্ত", "¯‘": "স্তু", "¯¿": "স্ত্র", "¯’": "স্থ", "mœ": "স্ন",
  "¯ú": "স্প", "ù": "স্ফ", "¯\\^": "স্ব", "¯§": "স্ম", "¯­": "স্ল",
  "û": "হু", "nè": "হ্ণ", "ý": "হ্ন", "þ": "হ্ম", "n¬": "হ্ল", "ü": "হৃ", "©": "র্",
  "Av": "আ", "A": "অ", "B": "ই", "C": "ঈ", "D": "উ", "E": "ঊ", "F": "ঋ", "G": "এ", "H": "ঐ", "I": "ও", "J": "ঔ",
  "K": "ক", "L": "খ", "M": "গ", "N": "ঘ", "O": "ঙ", "P": "চ", "Q": "ছ", "R": "জ", "S": "ঝ", "T": "ঞ",
  "U": "ট", "V": "ঠ", "W": "ড", "X": "ঢ", "Y": "ণ", "Z": "ত", "_": "থ", "`": "দ", "a": "ধ", "b": "ন",
  "c": "প", "d": "ফ", "e": "ব", "f": "ভ", "g": "ম", "h": "য", "i": "র", "j": "ল", "k": "শ", "l": "ষ",
  "m": "স", "n": "হ", "o": "ড়", "p": "ঢ়", "q": "য়", "r": "ৎ",
  "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪", "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",
  "v": "া", "w": "ি", "x": "ী", "y": "ু", "z": "ু", "~": "ূ", "„": "ৃ", "‡": "ে", "†": "ে", "‰": "ৈ", "\\ˆ": "ৈ", "Š": "ৗ",
  "Ô": "‘", "Õ": "’", "\\|": "।", "Ò": "“", "Ó": "”", "s": "ং", "t": "ঃ", "u": "ঁ",
  "ª": "্র", "Ö": "্র", "«": "্র", "¨": "্য", "\\&": "্", "…": "ৃ"
};

function reorderBijoyToUnicode(text: string): string {
  let str = text;
  for (let e = 0; e < str.length; e++) {
    if (e > 0 && str.charAt(e) === "্" && (isKar(str.charAt(e - 1)) || isAnusvarOrVisarga(str.charAt(e - 1))) && e < str.length - 1) {
      let r = str.substring(0, e - 1);
      r += str.charAt(e);
      r += str.charAt(e + 1);
      r += str.charAt(e - 1);
      r += str.substring(e + 2, str.length);
      str = r;
    }
    if (e > 0 && e < str.length - 1 && str.charAt(e) === "্" && str.charAt(e - 1) === "র" && str.charAt(e - 2) !== "্" && isKar(str.charAt(e + 1))) {
      let r = str.substring(0, e - 1);
      r += str.charAt(e + 1);
      r += str.charAt(e - 1);
      r += str.charAt(e);
      r += str.substring(e + 2, str.length);
      str = r;
    }
    if (e < str.length - 1 && str.charAt(e) === "র" && isHalant(str.charAt(e + 1)) && !isHalant(str.charAt(e - 1))) {
      let c = 1;
      while (!(e - c < 0)) {
        if (isBanglaConsonant(str.charAt(e - c)) && isHalant(str.charAt(e - c - 1))) {
          c += 2;
        } else if (c === 1 && isKar(str.charAt(e - c))) {
          c++;
        } else {
          break;
        }
      }
      let r = str.substring(0, e - c);
      r += str.charAt(e);
      r += str.charAt(e + 1);
      r += str.substring(e - c, e);
      r += str.substring(e + 2, str.length);
      str = r;
      e += 1;
      continue;
    }
    if (e < str.length - 1 && isPreKar(str.charAt(e)) && !isSpaceOrNewline(str.charAt(e + 1))) {
      let r = str.substring(0, e);
      let c = 1;
      while (isBanglaConsonant(str.charAt(e + c)) && isHalant(str.charAt(e + c + 1))) {
        c += 2;
      }
      r += str.substring(e + 1, e + c + 1);
      let h = 0;
      if (str.charAt(e) === "ে" && str.charAt(e + c + 1) === "া") {
        r += "ো";
        h = 1;
      } else if (str.charAt(e) === "ে" && str.charAt(e + c + 1) === "ৗ") {
        r += "ৌ";
        h = 1;
      } else {
        r += str.charAt(e);
      }
      r += str.substring(e + c + h + 1, str.length);
      str = r;
      e += c;
    }
    if (e < str.length - 1 && str.charAt(e) === "ঁ" && isPostKar(str.charAt(e + 1))) {
      let r = str.substring(0, e);
      r += str.charAt(e + 1);
      r += str.charAt(e);
      r += str.substring(e + 2, str.length);
      str = r;
    }
  }
  return str;
}

export function ConvertToUnicode(_mode: string, input: string): string {
  if (!input) return "";
  let str = input.toString();

  for (const bijoyChar in bijoyToUnicodeMap) {
    const regex = new RegExp(bijoyChar, "g");
    str = str.replace(regex, bijoyToUnicodeMap[bijoyChar]);
  }
  str = reorderBijoyToUnicode(str);
  str = str.replace(/অা/g, "আ");
  return str;
}
