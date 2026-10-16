// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getInstagramProfile } from "@/lib/instagramScraper";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const username = body?.username;

    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "ইনস্টাগ্রাম ইউজারনেম প্রদান করা প্রয়োজন।" }, { status: 400 });
    }

    const cleanUsername = username.trim().replace(/^@/, "").toLowerCase();

    if (!cleanUsername || cleanUsername.length > 30) {
      return NextResponse.json({ error: "সঠিক ইনস্টাগ্রাম ইউজারনেম লিখুন।" }, { status: 400 });
    }

    // ১. Instagram-এ আইডি আছে কি না এবং পাবলিক কি না চেক করা
    const igProfile = await getInstagramProfile(cleanUsername);

    if (!igProfile.exists) {
      return NextResponse.json(
        { error: "এই নামে কোনো Instagram আইডি পাওয়া যায়নি! অনুগ্রহ করে সঠিক ইউজারনেম লিখুন।" },
        { status: 404 }
      );
    }

    if (igProfile.isPrivate) {
      return NextResponse.json(
        {
          error: "আপনার Instagram অ্যাকাউন্টটি Private! ক্রেডিট আর্ন ও ক্যাম্পেইন চালু করতে প্রোফাইলটি Public করে পুনরায় চেষ্টা করুন।",
        },
        { status: 403 }
      );
    }

    // ২. Firestore-এ ইউজার চেক বা তৈরি করা
    const userRef = doc(db, "users", cleanUsername);
    const userSnap = await getDoc(userRef);

    let userData: {
      username: string;
      credits: number;
      totalEarned: number;
      totalSpent: number;
      strikes: number;
      createdAt: number;
      avatar?: string | null;
    };

    if (!userSnap.exists()) {
      userData = {
        username: cleanUsername,
        credits: 10, // নতুন ইউজারের জন্য স্টার্টার বোনাস
        totalEarned: 0,
        totalSpent: 0,
        strikes: 0,
        createdAt: Date.now(),
        avatar: igProfile.avatar || null,
      };
      await setDoc(userRef, userData);
    } else {
      userData = userSnap.data() as typeof userData;
      // যদি আগে অ্যাভাটার না থাকে, তবে আপডেট করা
      if (!userData.avatar && igProfile.avatar) {
        userData.avatar = igProfile.avatar;
      }
    }

    return NextResponse.json({ success: true, user: userData });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন।" }, { status: 500 });
  }
}
