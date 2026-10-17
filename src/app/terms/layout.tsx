import { Metadata } from "next";
import { getPageMetadata } from "@/config/seoRegistry";

export const metadata: Metadata = getPageMetadata("terms");

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
