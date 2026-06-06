const UNITS = ['B', 'KB', 'MB', 'GB']

/** Format a byte count into a human-readable string (e.g. `1.5 MB`). */
export function formatBytes(bytes: number): string {
  if (!bytes) return '0 B'
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), UNITS.length - 1)
  const value = bytes / Math.pow(1024, exponent)
  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${UNITS[exponent]}`
}
