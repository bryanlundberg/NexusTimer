const WARMUP_MS = 200
const SAMPLE_MS = 1000

const runFor = (fn: () => void, durationMs: number): number => {
  const end = performance.now() + durationMs
  let iterations = 0
  while (performance.now() < end) {
    for (let i = 0; i < 100; i++) fn()
    iterations += 100
  }
  return iterations
}

export function measure(name: string, fn: () => void): void {
  runFor(fn, WARMUP_MS)
  const start = performance.now()
  const iterations = runFor(fn, SAMPLE_MS)
  const microsPerOp = ((performance.now() - start) * 1000) / iterations
  console.log(`${name.padEnd(48)} ${microsPerOp.toFixed(2).padStart(10)} µs/op`)
}
