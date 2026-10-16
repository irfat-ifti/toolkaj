import { Metadata } from "next";
import { TOOLS_DATA } from "@/lib/tools-data";
import { buildToolMetadata } from "@/lib/tool-seo-content";

const tool = TOOLS_DATA.find((t) => t.slug === "image/govt-job-resizer")!;

export const metadata: Metadata = buildToolMetadata(tool);

export default function GovtJobResizerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
