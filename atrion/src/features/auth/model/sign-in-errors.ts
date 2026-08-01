const messages: Record<string, string> = {
  credentials: 'Wrong email or password.',
  missing: 'Enter your email and password.',
  server: 'Something went wrong. Try again.'
}

export function signInError(code: string | null): string | null {
  if (!code) return null
  return messages[code] ?? messages.server!
}
