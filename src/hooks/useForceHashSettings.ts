"use client";

import { useRouter } from "@/i18n/routing";
import { useEffect } from "react";

// Resets all hashes on first load
export default function useForceHashSettings() {
  const router = useRouter();
  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      router.replace("/");
    }
  }, [router]);
}
