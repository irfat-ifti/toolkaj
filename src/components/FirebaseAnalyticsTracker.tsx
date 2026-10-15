"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initAnalytics } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";

export default function FirebaseAnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Firebase analytics on client side
    initAnalytics()
      .then((analytics) => {
        if (analytics) {
          logEvent(analytics, "page_view", {
            page_path: pathname,
            page_title: typeof document !== "undefined" ? document.title : "",
          });
        }
      })
      .catch((err) => {
        console.warn("Firebase Analytics initialization skipped:", err);
      });
  }, [pathname]);

  return null;
}
