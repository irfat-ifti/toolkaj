import { Metadata } from "next";
import { getPageMetadata } from "@/config/seoRegistry";

export const metadata: Metadata = getPageMetadata("about");

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
