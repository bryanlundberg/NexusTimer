"use client";

import { useEffect, useRef } from "react";
import { useAudioPlayer } from "react-use-audio-player";

/**
 * Hook to play an audio when a trigger condition changes from false to true.
 *
 * @param {Object} props - The hook properties
 * @param {string} props.audioSrc - The path to the audio file to play
 * @param {boolean} props.trigger - The condition that triggers the audio playback
 * @param {boolean} [props.autoplay=true] - Whether to autoplay the audio when loaded
 */
type UseAudioTriggerProps = {
  audioSrc: string;
  trigger: boolean;
  autoplay?: boolean;
};

export const useAudioTrigger = ({ audioSrc, trigger, autoplay = true }: UseAudioTriggerProps) => {
  const previousTriggerState = useRef(trigger);
  const { load } = useAudioPlayer();

  useEffect(() => {
    if (trigger && !previousTriggerState.current) load(audioSrc, { autoplay });
    previousTriggerState.current = trigger;
  }, [trigger, audioSrc, autoplay, load]);
};
