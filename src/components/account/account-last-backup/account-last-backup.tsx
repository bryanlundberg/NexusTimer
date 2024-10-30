"use client";

import { getLastBackupDate } from "@/actions/actions";
import { Session } from "next-auth";
import { useEffect, useState } from "react";

export default function AccountLastBackup({ session }: { session: Session }) {
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchLastBackupDate = async () => {
      if (!session || !session.user || !session.user.email) return;
      const date = await getLastBackupDate({ email: session.user.email });
      setLastBackupDate(date ? date : "No backup found");
      setIsLoading(false);
    };

    fetchLastBackupDate();
  }, [session]);

  return (
    <>
      <div>
        {!isLoading
          ? "Last backup: " + lastBackupDate
          : "Fetching information from server wait a moment..."}
      </div>
    </>
  );
}
