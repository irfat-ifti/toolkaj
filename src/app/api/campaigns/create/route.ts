// src/app/api/campaigns/create/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, doc, runTransaction } from "firebase/firestore";
import { extractShortcode, getInstagramPostDetails } from "@/lib/instagramScraper";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const { loggedInUsername, type, postUrl, rewardPerAction, quantity } = body || {};

    if (!loggedInUsername || typeof loggedInUsername !== "string") {
      return NextResponse.json({ error: "অনুগ্রহ করে প্রথমে লগইন করুন।" }, { status: 401 });
    }

    const cleanUser = loggedInUsername.trim().replace(/^@/, "").toLowerCase();
    const reward = Math.max(1, parseInt(String(rewardPerAction || 1), 10));
    const qty = Math.max(1, parseInt(String(quantity || 1), 10));
    const totalCost = reward * qty;

    let targetUrl = "";
    let shortcode: string | null = null;

    // শর্ত ১: যদি Follow ক্যাম্পেইন হয়, তবে বাধ্যতামূলকভাবে লগইন করা নিজের প্রোফাইলেই ফলোয়ার নিতে হবে
    if (type === "follow") {
      targetUrl = `https://www.instagram.com/${cleanUser}/`;
    } 
    // শর্ত ২: যদি Like ক্যাম্পেইন হয়, তবে পোস্টটি এই ইউজারের নিজের কি না তা ভেরিফাই করতে হবে
    else if (type === "like") {
      if (!postUrl || typeof postUrl !== "string") {
        return NextResponse.json({ error: "পোস্ট বা রিলসের লিংক প্রদান করুন।" }, { status: 400 });
      }

      shortcode = extractShortcode(postUrl);
      if (!shortcode) {
        return NextResponse.json(
          { error: "সঠিক Instagram Post বা Reel লিংক দিন! (যেমন: https://www.instagram.com/p/XXXXX/)" },
          { status: 400 }
        );
      }

      const postDetails = await getInstagramPostDetails(shortcode);
      if (!postDetails.exists) {
        return NextResponse.json(
          { error: "পোস্টটি খুঁজে পাওয়া যায়নি বা আপনার অ্যাকাউন্টটি প্রাইভেট করা রয়েছে।" },
          { status: 400 }
        );
      }

      // STRICT OWNERSHIP CHECK: পোস্টের মালিক আর লগইন করা ইউজার এক কি না?
      if (!postDetails.ownerUsername || postDetails.ownerUsername.toLowerCase() !== cleanUser) {
        return NextResponse.json(
          {
            error: `অ্যাক্সেস ডিনাইড! এই পোস্টটির মালিক @${postDetails.ownerUsername || "অজ্ঞাত"}। আপনি (@${cleanUser}) শুধুমাত্র নিজের ইনস্টাগ্রাম পোস্ট বা রিলসেই লাইক নিতে পারবেন!`,
          },
          { status: 403 }
        );
      }

      targetUrl = `https://www.instagram.com/p/${shortcode}/`;
    } else {
      return NextResponse.json({ error: "ভুল ক্যাম্পেইন টাইপ নির্বাচন করা হয়েছে।" }, { status: 400 });
    }

    // ৩. ইউজারের ক্রেডিট কেটে ক্যাম্পেইন তৈরি করা (Atomic Transaction)
    const userRef = doc(db, "users", cleanUser);
    const campaignRef = doc(collection(db, "campaigns"));

    await runTransaction(db, async (transaction) => {
      const userSnap = await transaction.get(userRef);
      if (!userSnap.exists()) {
        throw new Error("আপনার প্রোফাইল পাওয়া যায়নি! অনুগ্রহ করে পুনরায় লগইন করুন।");
      }

      const userData = userSnap.data();
      const currentCredits = userData.credits || 0;

      if (currentCredits < totalCost) {
        throw new Error(
          `পর্যাপ্ত ক্রেডিট নেই! আপনার বর্তমান ব্যালেন্স ${currentCredits} ক্রেডিট, কিন্তু ক্যাম্পেইনের জন্য প্রয়োজন ${totalCost} ক্রেডিট। অন্যদের পোস্টে লাইক বা ফলো করে আরও ক্রেডিট অর্জন করুন।`
        );
      }

      // ক্রেডিট মাইনাস করা
      transaction.update(userRef, {
        credits: currentCredits - totalCost,
        totalSpent: (userData.totalSpent || 0) + totalCost,
      });

      // লিস্টিং তৈরি করা
      transaction.set(campaignRef, {
        ownerUsername: cleanUser,
        type,
        targetUrl,
        shortcode,
        rewardPerAction: reward,
        remainingQuantity: qty,
        active: true,
        lockedUntil: 0,
        lockedBy: null,
        createdAt: Date.now(),
      });
    });

    return NextResponse.json({
      success: true,
      message: "আপনার ক্যাম্পেইন সফলভাবে যুক্ত হয়েছে এবং চালু করা হয়েছে!",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "ক্যাম্পেইন তৈরিতে সমস্যা হয়েছে।" }, { status: 400 });
  }
}
