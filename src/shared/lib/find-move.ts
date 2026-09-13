export function findMove<T>(before: readonly T[], after: readonly T[]): [number, number] | null {
  let start = 0
  while (start < before.length && before[start] === after[start]) start++
  if (start === before.length) return null

  let end = before.length - 1
  while (end > start && before[end] === after[end]) end--

  return before[start] === after[end] ? [start, end] : [end, start]
}

export function splitPastedTokens(text: string): string[] {
  return text.split(/[\s,]+/).filter(Boolean)
}
