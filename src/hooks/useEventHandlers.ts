import { useRef, useEffect, useCallback } from "react";
import { TimerMode } from "@/enums/TimerMode";

type HandleHoldFunction = (isReleased: boolean) => void;
type HandleReleaseFunction = () => void;
type ResetTimerFunction = () => void;

interface UseEventHandlersProps {
  timerMode: TimerMode;
  handleHold: HandleHoldFunction;
  handleRelease: HandleReleaseFunction;
  resetTimer: ResetTimerFunction;
}

export default function useEventHandlers({
  timerMode,
  handleHold,
  handleRelease,
  resetTimer
}: UseEventHandlersProps) {
  const releasedKey = useRef<boolean>(true);

  const handleHoldWithReleasedState = useCallback(() => {
    handleHold(releasedKey.current);
    releasedKey.current = false;
  }, [handleHold]);

  const handleReleaseWithReleasedState = useCallback(() => {
    releasedKey.current = true;
    handleRelease();
  }, [handleRelease]);

  useEffect(() => {
    if (timerMode === TimerMode.STACKMAT) return;

    const handleTouchStart = (event: TouchEvent): void => {
      event.preventDefault();
      const quickActionButtons = document.querySelector(
        "#quick-action-buttons"
      ) as HTMLElement | null;
      if (
        quickActionButtons &&
        quickActionButtons.contains(event.target as Node)
      ) {
        // nothing
      } else {
        handleHoldWithReleasedState();
      }
    };

    const handleTouchEnd = (event: TouchEvent): void => {
      event.preventDefault();
      handleReleaseWithReleasedState();
    };

    const isTypingTarget = (): boolean => {
      const ae = document.activeElement as HTMLElement | null;
      if (!ae) return false;
      const tag = ae.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || ae.isContentEditable) return true;
      // Also consider elements with role="textbox"
      const role = ae.getAttribute?.("role");
      return role === "textbox";
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        resetTimer();
        return;
      }
      if (event.code !== "Space") {
        return;
      }
      if (isTypingTarget()) {
        return;
      }
      handleHoldWithReleasedState();
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        resetTimer();
        return;
      }
      if (event.code !== "Space") {
        return;
      }
      if (isTypingTarget()) {
        return;
      }
      handleReleaseWithReleasedState();
    };

    const touchElements = document.querySelectorAll("#touch");

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    touchElements.forEach((element: any) => {
      element.addEventListener("touchstart", handleTouchStart);
      element.addEventListener("touchend", handleTouchEnd);
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      touchElements.forEach((element: any) => {
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchend", handleTouchEnd);
      });
    };
  }, [handleHoldWithReleasedState, handleReleaseWithReleasedState, resetTimer, timerMode]);

  return {
    isReleased: () => releasedKey.current
  };
}
