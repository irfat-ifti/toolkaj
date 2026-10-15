import { Metadata } from "next";
import ToolsClientView from "@/components/ToolsClientView";

export const metadata: Metadata = {
  title: "সবগুলো অনলাইন টুলস (All Online Tools) — ৫০+ ফ্রি টুলস | ToolKaj",
  description: "ToolKaj-এর ৫০+ ফ্রি অনলাইন টুলসের সম্পূর্ণ তালিকা। PDF, ইমেজ, টেক্সট, ভিডিও, সোশ্যাল মিডিয়া ও দৈনন্দিন ক্যালকুলেটর এক জায়গায়।",
};

export default function AllToolsPage() {
  return <ToolsClientView />;
}
