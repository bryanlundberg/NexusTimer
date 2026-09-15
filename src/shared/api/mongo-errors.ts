const DUPLICATE_KEY = 11000

export const isDuplicateKeyError = (error: unknown) => (error as { code?: number } | null)?.code === DUPLICATE_KEY
