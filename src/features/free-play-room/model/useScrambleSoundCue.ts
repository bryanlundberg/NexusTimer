import { useEffect, useRef, useState } from 'react'

export function useScrambleSoundCue(scramble: string) {
  const previousScrambleRef = useRef<string>('')
  const [shouldPlaySound, setShouldPlaySound] = useState(false)

  useEffect(() => {
    if (previousScrambleRef.current && previousScrambleRef.current !== scramble) {
      setShouldPlaySound(true)
      const timeout = setTimeout(() => setShouldPlaySound(false), 100)
      return () => clearTimeout(timeout)
    }
    previousScrambleRef.current = scramble
  }, [scramble])

  return shouldPlaySound
}
