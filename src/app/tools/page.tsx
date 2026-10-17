import { Metadata } from "next";
import ToolsClientView from "@/components/ToolsClientView";
import { getPageMetadata } from "@/config/seoRegistry";

export const metadata: Metadata = getPageMetadata("tools");

export default function AllToolsPage() {
  return <ToolsClientView />;
}
