// src/lib/instagramScraper.ts

/**
 * Highly reliable social crawler user agents.
 * Instagram serves complete SSR metadata (og:description, og:image, og:title)
 * to social bot crawlers (Facebook, WhatsApp, Twitter, Telegram) so link previews work everywhere.
 */
const CRAWLER_USER_AGENTS = [
  "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
  "Twitterbot/1.0",
  "WhatsApp/2.21.12.21 A",
  "TelegramBot (like TwitterBot)",
];

export interface InstagramProfileResult {
  exists: boolean;
  username?: string;
  isPrivate?: boolean;
  followersCount?: number | null;
  followingCount?: number | null;
  postsCount?: number | null;
  avatar?: string | null;
  error?: string;
}

export interface InstagramPostResult {
  exists: boolean;
  shortcode?: string;
  ownerUsername?: string | null;
  likesCount?: number | null;
  error?: string;
}

/**
 * ১. ইউআরএল থেকে রিলস বা পোস্টের Shortcode বের করা
 */
export function extractShortcode(url: string): string | null {
  try {
    if (!url || typeof url !== "string") return null;
    const regex = /instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i;
    const match = url.trim().match(regex);
    return match ? match[2] : null;
  } catch {
    return null;
  }
}

/**
 * Helper to parse K/M/B numbers into integers
 */
function parseCount(rawNum: string, multiplier?: string): number | null {
  try {
    const cleanNum = rawNum.replace(/,/g, "").trim();
    const mult = (multiplier || "").toUpperCase();
    if (mult === "K") return Math.round(parseFloat(cleanNum) * 1000);
    if (mult === "M") return Math.round(parseFloat(cleanNum) * 1000000);
    if (mult === "B") return Math.round(parseFloat(cleanNum) * 1000000000);
    const parsed = parseInt(cleanNum, 10);
    return isNaN(parsed) ? null : parsed;
  } catch {
    return null;
  }
}

/**
 * ২. প্রোফাইল চেক, প্রাইভেসি স্ট্যাটাস এবং এক্স্যাক্ট ফলোয়ার সংখ্যা বের করা
 */
export async function getInstagramProfile(username: string): Promise<InstagramProfileResult> {
  const cleanUser = username.trim().replace(/^@/, "").toLowerCase();

  if (!cleanUser) {
    return { exists: false, error: "ইউজারনেম প্রয়োজন" };
  }

  // Iterate crawler user agents with timeout
  for (const ua of CRAWLER_USER_AGENTS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`https://www.instagram.com/${cleanUser}/`, {
        headers: {
          "User-Agent": ua,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok && res.status !== 404) {
        continue;
      }

      if (res.status === 404) {
        return { exists: false };
      }

      const html = await res.text();

      // Check if user page does not exist
      if (
        html.includes("Sorry, this page isn't available") ||
        html.includes("Page Not Found") ||
        html.includes("The link you followed may be broken")
      ) {
        return { exists: false };
      }

      // Check if account is private
      const isPrivate =
        html.includes("This Account is Private") ||
        html.includes("This account is private") ||
        html.includes('"is_private":true');

      // Extract og:description: "680M Followers, 649 Following, 4,143 Posts - See Instagram photos and videos from Name (@username)"
      const ogDescMatch = html.match(
        /<meta\s+(?:property|name)=["'](?:og:)?description["']\s+content=["']([^"']+)["']/i
      );
      const ogDesc = ogDescMatch ? ogDescMatch[1] : "";

      if (!ogDesc && html.includes("<title>Instagram</title>")) {
        // Empty shell received, try next crawler UA
        continue;
      }

      let followersCount: number | null = null;
      let followingCount: number | null = null;
      let postsCount: number | null = null;

      if (ogDesc) {
        const followerMatch = ogDesc.match(/([0-9,.]+)([KMBkmb]?)\s+Followers/i);
        if (followerMatch) {
          followersCount = parseCount(followerMatch[1], followerMatch[2]);
        }

        const followingMatch = ogDesc.match(/([0-9,.]+)([KMBkmb]?)\s+Following/i);
        if (followingMatch) {
          followingCount = parseCount(followingMatch[1], followingMatch[2]);
        }

        const postsMatch = ogDesc.match(/([0-9,.]+)([KMBkmb]?)\s+Posts/i);
        if (postsMatch) {
          postsCount = parseCount(postsMatch[1], postsMatch[2]);
        }
      }

      // Extract Avatar URL from og:image
      const avatarMatch = html.match(
        /<meta\s+(?:property|name)=["'](?:og:)?image["']\s+content=["']([^"']+)["']/i
      );
      const avatar = avatarMatch ? avatarMatch[1].replace(/&amp;/g, "&") : null;

      // Extract exact verified username from title if possible
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : "";

      // If followers count was found, return immediately
      if (followersCount !== null || ogDesc.length > 0) {
        return {
          exists: true,
          username: cleanUser,
          isPrivate,
          followersCount,
          followingCount,
          postsCount,
          avatar,
        };
      }
    } catch {
      // Continue to next crawler fallback
    }
  }

  // Fallback Method: Public Web Profile API with Instagram App ID
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const apiRes = await fetch(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${cleanUser}`,
      {
        headers: {
          "x-ig-app-id": "936619743392459",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "*/*",
        },
        cache: "no-store",
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (apiRes.ok) {
      const json = await apiRes.json();
      const user = json?.data?.user;
      if (user) {
        return {
          exists: true,
          username: user.username?.toLowerCase() || cleanUser,
          isPrivate: Boolean(user.is_private),
          followersCount: user.edge_followed_by?.count ?? null,
          followingCount: user.edge_follow?.count ?? null,
          avatar: user.profile_pic_url || null,
        };
      }
    }
  } catch {
    // ignore
  }

  return { exists: false, error: "প্রোফাইলটি খুঁজে পাওয়া যায়নি বা ইনস্টাগ্রাম সার্ভার থেকে ব্লক করা হয়েছে।" };
}

/**
 * ৩. পোস্ট বা রিলসের মালিক (Author/Owner) এবং বর্তমান লাইক সংখ্যা বের করা
 */
export async function getInstagramPostDetails(shortcode: string): Promise<InstagramPostResult> {
  if (!shortcode) return { exists: false, error: "শর্টকোড নেই" };

  for (const ua of CRAWLER_USER_AGENTS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`https://www.instagram.com/p/${shortcode}/`, {
        headers: {
          "User-Agent": ua,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok && res.status !== 404) {
        continue;
      }

      if (res.status === 404) {
        return { exists: false };
      }

      const html = await res.text();

      if (
        html.includes("Sorry, this page isn't available") ||
        html.includes("Page Not Found") ||
        html.includes("The link you followed may be broken")
      ) {
        return { exists: false };
      }

      // Extract og:description: "46K likes, 172 comments - sandiegozoo on September 15, 2023: ..."
      const ogDescMatch = html.match(
        /<meta\s+(?:property|name)=["'](?:og:)?description["']\s+content=["']([^"']+)["']/i
      );
      const ogDesc = ogDescMatch ? ogDescMatch[1] : "";

      let likesCount: number | null = null;
      let ownerUsername: string | null = null;

      if (ogDesc) {
        // 1. Likes
        const lMatch = ogDesc.match(/([0-9,.]+)([KMBkmb]?)\s+likes/i);
        if (lMatch) {
          likesCount = parseCount(lMatch[1], lMatch[2]);
        }

        // 2. Owner username: "- author on Month Day, Year:"
        const oMatch = ogDesc.match(/-\s+([a-zA-Z0-9_.]+)\s+on\s+/i);
        if (oMatch) {
          ownerUsername = oMatch[1].trim().toLowerCase();
        }
      }

      // If owner not found in description, try og:title or embed
      if (!ownerUsername) {
        const ogTitleMatch = html.match(
          /<meta\s+(?:property|name)=["'](?:og:)?title["']\s+content=["']([^"']+)["']/i
        );
        const ogTitle = ogTitleMatch ? ogTitleMatch[1] : "";
        const titleOwner = ogTitle.match(/@([a-zA-Z0-9_.]+)/i) || ogTitle.match(/from\s+([a-zA-Z0-9_.]+)/i);
        if (titleOwner) {
          ownerUsername = titleOwner[1].trim().toLowerCase();
        }
      }

      if (ownerUsername || likesCount !== null) {
        return {
          exists: true,
          shortcode,
          ownerUsername,
          likesCount,
        };
      }
    } catch {
      // Continue to next crawler UA
    }
  }

  // Fallback: Embed endpoint
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
    const res = await fetch(embedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const html = await res.text();
      let ownerUsername: string | null = null;
      let likesCount: number | null = null;

      const usernameMatch =
        html.match(/class="UsernameText"[^>]*>([^<]+)</i) ||
        html.match(/instagram\.com\/([A-Za-z0-9_.]+)\/\?utm_source=ig_embed/i) ||
        html.match(/"owner":\{"id":"[0-9]+","username":"([A-Za-z0-9_.]+)"/i);

      if (usernameMatch && usernameMatch[1]) {
        ownerUsername = usernameMatch[1].trim().toLowerCase();
      }

      const likesMatch =
        html.match(/([0-9,]+)\s+likes/i) || html.match(/"edge_media_preview_like":\{"count":([0-9]+)/i);

      if (likesMatch && likesMatch[1]) {
        likesCount = parseInt(likesMatch[1].replace(/,/g, ""), 10);
      }

      if (ownerUsername) {
        return {
          exists: true,
          shortcode,
          ownerUsername,
          likesCount,
        };
      }
    }
  } catch {
    // ignore
  }

  return { exists: false, error: "পোস্টটি খুঁজে পাওয়া যায়নি।" };
}
