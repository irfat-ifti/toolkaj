import { Metadata } from "next";
import { getPageMetadata } from "@/config/seoRegistry";

export const metadata: Metadata = getPageMetadata("privacyPolicy");

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
