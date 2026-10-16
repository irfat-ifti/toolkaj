// src/app/api/tasks/verify/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, runTransaction, updateDoc } from "firebase/firestore";
import { getInstagramPostDetails, getInstagramProfile } from "@/lib/instagramScraper";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const { sessionId, workerUsername } = body || {};

    if (!sessionId || !workerUsername) {
      return NextResponse.json({ verified: false, error: "সেশন আইডি ও ইউজারনেম প্রয়োজন।" }, { status: 400 });
    }

    const cleanWorker = workerUsername.trim().replace(/^@/, "").toLowerCase();

    const sessionRef = doc(db, "task_sessions", sessionId);
    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists() || sessionSnap.data().status !== "pending") {
      return NextResponse.json({ verified: false, error: "অবৈধ বা ইতিমধ্যে ব্যবহৃত টাস্ক সেশন!" }, { status: 400 });
    }

    const session = sessionSnap.data();

    if (session.workerUsername !== cleanWorker) {
      return NextResponse.json({ verified: false, error: "অননুমোদিত অ্যাক্সেস!" }, { status: 403 });
    }

    const timeSpentSeconds = (Date.now() - session.startedAt) / 1000;

    const campRef = doc(db, "campaigns", session.campaignId);
    const campSnap = await getDoc(campRef);

    if (!campSnap.exists()) {
      return NextResponse.json({ verified: false, error: "ক্যাম্পেইনটি খুঁজে পাওয়া যায়নি।" }, { status: 404 });
    }

    const camp = campSnap.data();

    // শর্ত ১: ইউজার যদি ৬ সেকেন্ডের কম সময় কাটিয়ে ফিরে আসে, তবে সে লাইক/ফলো করেনি (অ্যান্টি-চিট)
    if (timeSpentSeconds < 6) {
      // আনলক করা যাতে অন্য কেউ ট্রাই করতে পারে
      await updateDoc(campRef, { lockedUntil: 0, lockedBy: null });
      return NextResponse.json(
        {
          verified: false,
          error: "আপনি খুব দ্রুত ফিরে এসেছেন! ইনস্টাগ্রাম ওপেন করে সত্যিকারের লাইক বা ফলো দিতে অন্তত ৬ সেকেন্ড সময় প্রয়োজন।",
        },
        { status: 400 }
      );
    }

    // ভেরিফিকেশন লজিক:
    // কখনোই ব্লাইন্ড টাইম দিয়ে ক্রেডিট দেওয়া যাবে না!
    // ১. Like Campaign: পোস্টের নতুন লাইক সংখ্যা অবশ্যই পূর্বের তুলনায় বেশি হতে হবে (newCount > initialCount)।
    // ২. Follow Campaign: ডাবল-সাইডেড ভেরিফিকেশন—টার্গেটের ফলোয়ার সংখ্যা বৃদ্ধি পেতে হবে অথবা ওয়ার্কারের Following বৃদ্ধি পেতে হবে।
    let isVerified = false;
    let failReason = "লাইক বা ফলো ভেরিফাই করা যায়নি! আপনি কি সত্যিই পোস্টটিতে লাইক বা অ্যাকাউন্টে ফলো দিয়েছেন?";

    if (camp.type === "like") {
      const details = await getInstagramPostDetails(camp.shortcode);
      const newCount = details.likesCount ?? null;

      if (session.initialCount !== null && newCount !== null) {
        if (newCount > session.initialCount) {
          isVerified = true;
        } else {
          isVerified = false;
          failReason = `পোস্টে লাইক বৃদ্ধি পাওয়া যায়নি! (শুরুর লাইক: ${session.initialCount}, বর্তমান লাইক: ${newCount})। সত্যি সত্যি লাইক দিয়ে পুনরায় চেষ্টা করুন।`;
        }
      } else {
        isVerified = false;
        failReason = "পোস্টের লাইক সংখ্যা যাচাই করা যায়নি। নিশ্চিত করুন পোস্টটির লাইক কাউন্ট হাইড করা নেই।";
      }
    } else {
      // Follow Campaign: Double-Sided Real Follower Check
      const targetProfile = await getInstagramProfile(camp.ownerUsername);
      const newTargetFollowers = targetProfile.followersCount ?? null;

      const workerProfile = await getInstagramProfile(cleanWorker);
      const workerNewFollowing = workerProfile.followingCount ?? null;

      const targetFollowersIncreased =
        session.initialCount !== null &&
        newTargetFollowers !== null &&
        newTargetFollowers > session.initialCount;

      const workerFollowingIncreased =
        session.workerInitialFollowing !== null &&
        workerNewFollowing !== null &&
        workerNewFollowing > session.workerInitialFollowing;

      if (targetFollowersIncreased || workerFollowingIncreased) {
        isVerified = true;
      } else {
        isVerified = false;
        failReason = `ফলোয়ার বৃদ্ধি পায়নি! টার্গেট অ্যাকাউন্টে (@${camp.ownerUsername}) আপনার ফলো রেকর্ড হয়নি। নিশ্চিত করুন আপনি প্রোফাইলটিতে সঠিকভাবে 'Follow' বাটনে ক্লিক করেছেন।`;
      }
    }

    if (!isVerified) {
      // টাস্ক আনলক করা যাতে অন্য কেউ চেষ্টা করতে পারে
      await updateDoc(campRef, { lockedUntil: 0, lockedBy: null });
      return NextResponse.json(
        {
          verified: false,
          error: failReason,
        },
        { status: 400 }
      );
    }

    // ভেরিফাইড হলে ক্রেডিট প্রদান এবং ক্যাম্পেইনের বাজেট কমানো
    const workerRef = doc(db, "users", cleanWorker);
    const completedRef = doc(db, "completed_tasks", `${cleanWorker}_${session.campaignId}`);

    await runTransaction(db, async (transaction) => {
      const workerSnap = await transaction.get(workerRef);
      const currentCampSnap = await transaction.get(campRef);

      if (!workerSnap.exists()) {
        throw new Error("ওয়ার্কার প্রোফাইল পাওয়া যায়নি!");
      }

      if (!currentCampSnap.exists()) {
        throw new Error("ক্যাম্পেইন পাওয়া যায়নি!");
      }

      const currentCredits = workerSnap.data().credits || 0;
      const remaining = currentCampSnap.data().remainingQuantity || 0;

      if (remaining <= 0) {
        throw new Error("দুঃখিত, এই ক্যাম্পেইনের নির্ধারিত কোটা ইতিমধ্যে শেষ হয়ে গেছে!");
      }

      // ওয়ার্কারকে ক্রেডিট দেওয়া
      transaction.update(workerRef, {
        credits: currentCredits + camp.rewardPerAction,
        totalEarned: (workerSnap.data().totalEarned || 0) + camp.rewardPerAction,
      });

      // ক্যাম্পেইন আপডেট ও আনলক করা
      transaction.update(campRef, {
        remainingQuantity: remaining - 1,
        active: remaining - 1 > 0,
        lockedUntil: 0,
        lockedBy: null,
      });

      // সেশন ও কমপ্লিটেড টাস্ক রেকর্ড করা
      transaction.update(sessionRef, { status: "completed" });
      transaction.set(completedRef, {
        workerUsername: cleanWorker,
        campaignId: session.campaignId,
        reward: camp.rewardPerAction,
        completedAt: Date.now(),
      });
    });

    return NextResponse.json({
      verified: true,
      reward: camp.rewardPerAction,
      message: `অভিনন্দন! আপনার কাজটি সফলভাবে ভেরিফাই হয়েছে এবং আপনি +${camp.rewardPerAction} ক্রেডিট পেয়েছেন!`,
    });
  } catch (error: any) {
    return NextResponse.json({ verified: false, error: error?.message || "টাস্ক ভেরিফাই করতে সমস্যা হয়েছে।" }, { status: 400 });
  }
}
