export function eventTime(event: Event): number {
  const now = performance.now()
  return event.timeStamp > 0 && event.timeStamp <= now ? event.timeStamp : now
}
