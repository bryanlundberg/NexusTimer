/**
 * Penalty rules for solves. These are the invariants the whole app relies on;
 * breaking one silently shifts every statistic, so change them only together
 * with `__tests__/solvePenalty.test.ts`, which locks them in.
 *
 * 1. `Solve.time` is always the FINAL time. When `plus2` is true the two
 *    seconds are already inside `time`; the flag only records why. No consumer
 *    should ever add or subtract 2000 by hand, use the helpers below.
 * 2. Only the writers apply penalties. Anything that reads a solve (means,
 *    deviation, Ao, PB, time spent, charts, exports) uses `time` as-is.
 * 3. A `dnf` solve keeps whatever the clock read, but that number is not a
 *    result: it is excluded from mean, deviation, best and worst, and trimmed
 *    out of an Ao. It still counts as time spent at the timer, because the
 *    cuber did spend it.
 * 4. `plus2` and `dnf` are mutually exclusive. Applying a +2 to a DNF clears
 *    the DNF (see `togglePlus2`).
 * 5. `endTime - startTime` is wall clock and may differ from `time` on a +2.
 *    Never derive one from the other.
 *
 */
export const PLUS_2_PENALTY_MS = 2000

export function withPlus2(timeMs: number, plus2: boolean): number {
  return plus2 ? timeMs + PLUS_2_PENALTY_MS : timeMs
}

export function withoutPlus2(timeMs: number, plus2: boolean): number {
  return plus2 ? timeMs - PLUS_2_PENALTY_MS : timeMs
}
