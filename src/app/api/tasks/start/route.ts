// src/app/api/tasks/start/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getInstagramPostDetails, getInstagramProfile } from "@/lib/instagramScraper";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const { campaignId, workerUsername } = body || {};

    if (!campaignId || !workerUsername) {
      return NextResponse.json({ error: "ক্যাম্পেইন আইডি ও ইউজারনেম প্রয়োজন।" }, { status: 400 });
    }

    const cleanWorker = workerUsername.trim().replace(/^@/, "").toLowerCase();

    const campRef = doc(db, "campaigns", campaignId);
    const campSnap = await getDoc(campRef);

    if (!campSnap.exists() || !campSnap.data().active || (campSnap.data().remainingQuantity || 0) <= 0) {
      return NextResponse.json({ error: "এই টাস্কটি এখন আর সচল নেই বা কোটা শেষ হয়ে গেছে।" }, { status: 404 });
    }

    const camp = campSnap.data();

    // নিজের পোস্টে নিজে লাইক বা ফলো করতে পারবে না
    if (camp.ownerUsername === cleanWorker) {
      return NextResponse.json({ error: "নিজের ক্যাম্পেইনে নিজে কাজ করা যাবে না!" }, { status: 400 });
    }

    // আগে এই টাস্ক করেছে কি না চেক করা
    const completedRef = doc(db, "completed_tasks", `${cleanWorker}_${campaignId}`);
    const completedSnap = await getDoc(completedRef);
    if (completedSnap.exists()) {
      return NextResponse.json({ error: "আপনি ইতিমধ্যে এই টাস্কটি সম্পন্ন করেছেন!" }, { status: 400 });
    }

    // অন্য কেউ এই মুহূর্তে টাস্কটি করছে কি না চেক করা (Concurrency Lock)
    const now = Date.now();
    if (camp.lockedUntil > now && camp.lockedBy !== cleanWorker) {
      const waitSeconds = Math.ceil((camp.lockedUntil - now) / 1000);
      return NextResponse.json(
        {
          error: `অন্য একজন ইউজার এই মুহূর্তে এই টাস্কে কাজ করছে। অনুগ্রহ করে ${waitSeconds} সেকেন্ড পর চেষ্টা করুন।`,
        },
        { status: 429 }
      );
    }

    // ২৫ সেকেন্ডের জন্য টাস্ক লক করা
    await updateDoc(campRef, {
      lockedUntil: now + 25000,
      lockedBy: cleanWorker,
    });

    // বর্তমান লাইক বা ফলোয়ার সংখ্যা স্ক্র্যাপ করা (Before Action)
    let initialCount: number | null = null;
    let workerInitialFollowing: number | null = null;

    if (camp.type === "like") {
      const details = await getInstagramPostDetails(camp.shortcode);
      initialCount = details.likesCount ?? null;

      if (initialCount === null) {
        // লাইক কাউন্ট পাওয়া না গেলে আনলক করে এরর দেওয়া
        await updateDoc(campRef, { lockedUntil: 0, lockedBy: null });
        return NextResponse.json(
          {
            error:
              "পোস্টের বর্তমান লাইক সংখ্যা স্ক্র্যাপ করা সম্ভব হয়নি। পোস্টের লাইক কাউন্ট হাইড করা আছে কি না পরীক্ষা করুন।",
          },
          { status: 400 }
        );
      }
    } else {
      // Follow ক্যাম্পেইনের ক্ষেত্রে টার্গেট অ্যাকাউন্টের ফলোয়ার সংখ্যা
      const targetProfile = await getInstagramProfile(camp.ownerUsername);
      initialCount = targetProfile.followersCount ?? null;

      // একই সাথে ওয়ার্কারের নিজের Following সংখ্যাও রেকর্ড করা (Double-Sided Verification)
      const workerProfile = await getInstagramProfile(cleanWorker);
      workerInitialFollowing = workerProfile.followingCount ?? null;

      if (initialCount === null && workerInitialFollowing === null) {
        // আনলক করা
        await updateDoc(campRef, { lockedUntil: 0, lockedBy: null });
        return NextResponse.json(
          {
            error:
              "ইনস্টাগ্রাম প্রোফাইলের তথ্য পড়া যাচ্ছে না। উভয় অ্যাকাউন্ট পাবলিক আছে কি না যাচাই করুন।",
          },
          { status: 400 }
        );
      }
    }

    // সেশন তৈরি করা
    const sessionRef = doc(collection(db, "task_sessions"));
    await setDoc(sessionRef, {
      campaignId,
      workerUsername: cleanWorker,
      initialCount,
      workerInitialFollowing,
      startedAt: now,
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      sessionId: sessionRef.id,
      targetUrl: camp.targetUrl,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "টাস্ক শুরু করতে সমস্যা হয়েছে।" }, { status: 500 });
  }
}
