import { Solve } from "@/interfaces/Solve";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

export default function useLocale(solve: Solve | null): string | null {
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    if (solve && solve.endTime) {
      console.log(navigator.language);
      
      const parsedDate = DateTime.fromMillis(solve.endTime).setLocale(navigator.language).toLocaleString(
        DateTime.DATE_MED
      );
      setFormattedDate(parsedDate);
    }
  }, [solve]);

  if (!solve) return null;

  return formattedDate;
}
