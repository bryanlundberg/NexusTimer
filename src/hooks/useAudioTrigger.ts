"use client";

import { useRef, useEffect } from "react";

type UseAudioTriggerProps = {
  audioSrc: string;
  trigger: boolean;
};

export const useAudioTrigger = ({
  audioSrc,
  trigger,
}: UseAudioTriggerProps) => {
  const prev = useRef(trigger);

  useEffect(() => {
    if (!prev.current && trigger) {
      const audio = new Audio(audioSrc);
      audio.play();
    }
    prev.current = trigger;
  }, [trigger, audioSrc]);
};
