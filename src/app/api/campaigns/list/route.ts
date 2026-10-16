// src/app/api/campaigns/list/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from "firebase/firestore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "ইউজারনেম প্রয়োজন" }, { status: 400 });
    }

    const cleanUser = username.trim().replace(/^@/, "").toLowerCase();

    // ১. ইউজারের লেটেস্ট তথ্য পাওয়া
    const userRef = doc(db, "users", cleanUser);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ error: "ইউজার পাওয়া যায়নি" }, { status: 404 });
    }

    const user = userSnap.data();

    // ২. অ্যাক্টিভ ক্যাম্পেইনগুলো আনা
    const campaignsQuery = query(
      collection(db, "campaigns"),
      where("active", "==", true),
      limit(50)
    );
    const campaignsSnap = await getDocs(campaignsQuery);

    const allActive: any[] = [];
    campaignsSnap.forEach((docSnap) => {
      allActive.push({ id: docSnap.id, ...docSnap.data() });
    });

    // ৩. ইউজার ইতিমধ্যে যেসব টাস্ক শেষ করেছে সেগুলো বের করা
    const completedTasksQuery = query(
      collection(db, "completed_tasks"),
      where("workerUsername", "==", cleanUser)
    );
    const completedTasksSnap = await getDocs(completedTasksQuery);
    const completedCampIds = new Set<string>();
    completedTasksSnap.forEach((docSnap) => {
      completedCampIds.add(docSnap.data().campaignId);
    });

    const now = Date.now();

    // ইউজার যেগুলোতে কাজ করতে পারবে (নিজের ক্যাম্পেইন ও সম্পন্ন করা ক্যাম্পেইন বাদে)
    const availableCampaigns = allActive
      .filter((camp) => {
        const isNotOwner = camp.ownerUsername !== cleanUser;
        const notCompleted = !completedCampIds.has(camp.id);
        const hasRemaining = (camp.remainingQuantity || 0) > 0;
        return isNotOwner && notCompleted && hasRemaining;
      })
      .map((camp) => ({
        id: camp.id,
        ownerUsername: camp.ownerUsername,
        type: camp.type,
        rewardPerAction: camp.rewardPerAction,
        isLocked: camp.lockedUntil > now && camp.lockedBy !== cleanUser,
        targetUrl: camp.targetUrl,
      }));

    // ইউজারের নিজের ক্যাম্পেইনগুলো
    const myCampaigns = allActive.filter((camp) => camp.ownerUsername === cleanUser);

    return NextResponse.json({
      success: true,
      user,
      availableCampaigns,
      myCampaigns,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "ডাটা লোড করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}
