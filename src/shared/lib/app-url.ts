export function appUrl(): string {
  return (
    process.env.BETTER_AUTH_URL ||
    (process.env.NODE_ENV === 'production' ? 'https://nexustimer.com' : 'http://localhost:3000')
  )
}
