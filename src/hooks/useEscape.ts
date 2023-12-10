import { useEffect } from "react";

export default function useEscape(callbackFunc: () => void) {
  useEffect(() => {
    function handlePressEsc(event: KeyboardEvent) {
      if (event.code === "Escape") callbackFunc();
    }
    document.addEventListener("keydown", handlePressEsc);
    return () => {
      document.removeEventListener("keydown", handlePressEsc);
    };
  });
}
