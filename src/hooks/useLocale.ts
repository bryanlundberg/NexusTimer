import { DateTime } from "luxon";
import { useEffect, useState } from "react";

export default function useLocale(time: number | undefined): string | null {
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    if (time) {
      const parsedDate = DateTime.fromMillis(time)
        .setLocale(navigator.language)
        .toLocaleString(DateTime.DATE_MED);
      setFormattedDate(parsedDate);
    }
  }, [time]);

  if (!time) return null;

  return formattedDate;
}
