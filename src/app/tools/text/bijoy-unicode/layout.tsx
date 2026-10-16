import { Metadata } from "next";
import { TOOLS_DATA } from "@/lib/tools-data";
import { buildToolMetadata } from "@/lib/tool-seo-content";

const tool = TOOLS_DATA.find((t) => t.slug === "text/bijoy-unicode")!;

export const metadata: Metadata = buildToolMetadata(tool);

export default function BijoyUnicodeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
