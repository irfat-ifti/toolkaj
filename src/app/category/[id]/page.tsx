import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TOOLS_DATA, CATEGORIES } from "@/lib/tools-data";
import ToolCard from "@/components/ToolCard";
import { ArrowLeft } from "lucide-react";
import DynamicIcon from "@/components/DynamicIcon";
import { SITE_CONFIG } from "@/lib/seo-config";

interface CategoryPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return CATEGORIES.filter((c) => c.id !== "all").map((cat) => ({
    id: cat.id,
  }));
}

import { getPageMetadata } from "@/config/seoRegistry";

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  return getPageMetadata(`category/${params.id}`);
}

import CategoryClientView from "@/components/CategoryClientView";

export default function CategoryPage({ params }: CategoryPageProps) {
  const cat = CATEGORIES.find((c) => c.id === params.id);
  if (!cat) notFound();

  const tools = TOOLS_DATA.filter((t) => t.category === cat.id);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_CONFIG.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: cat.nameBn,
        item: `${SITE_CONFIG.url}/category/${cat.id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CategoryClientView cat={cat} tools={tools} />
    </>
  );
}
