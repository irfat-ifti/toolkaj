import { Metadata } from "next";
import { getPageMetadata } from "@/config/seoRegistry";

export const metadata: Metadata = getPageMetadata("contact");

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
