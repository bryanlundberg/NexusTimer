import type { KeyboardEvent } from 'react'

export function isImeEnter(event: KeyboardEvent): boolean {
  return event.nativeEvent.isComposing || event.keyCode === 229
}
