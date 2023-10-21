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

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [targetRef, clickOutsideCallback]);
}
