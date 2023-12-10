import { useEffect, RefObject } from "react";

export default function useClickOutside(
  targetRef: RefObject<HTMLElement>,
  clickOutsideCallback: () => void
) {
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        targetRef.current &&
        !targetRef.current.contains(event.target as Node)
      ) {
        clickOutsideCallback();
      }
    }

    function handlePressEsc(event: KeyboardEvent) {
      if (event.code === "Escape") clickOutsideCallback();
    }

    document.addEventListener("keydown", handlePressEsc);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handlePressEsc);
    };
  }, [targetRef, clickOutsideCallback]);
}
