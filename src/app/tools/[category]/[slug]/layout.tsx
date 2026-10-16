import { Metadata } from "next";
import { TOOLS_DATA } from "@/lib/tools-data";
import { buildToolMetadata } from "@/lib/tool-seo-content";
import { SITE_CONFIG } from "@/lib/seo-config";

interface ToolLayoutProps {
  children: React.ReactNode;
  params: {
    category: string;
    slug: string;
  };
}

export function generateMetadata({ params }: { params: { category: string; slug: string } }): Metadata {
  const currentHref = `/tools/${params.category}/${params.slug}`;
  const tool = TOOLS_DATA.find((t) => t.href === currentHref);

  if (!tool) {
    return {
      title: "Tool Not Found | ToolKaj",
      description: "Requested tool could not be found.",
    };
  }

  return buildToolMetadata(tool);
}

export default function GenericToolLayout({ children }: ToolLayoutProps) {
  return <>{children}</>;
}
