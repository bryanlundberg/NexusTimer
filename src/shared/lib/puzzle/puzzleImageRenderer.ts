export type PuzzleImageView = 'net' | 'last-layer'

export type PuzzleImageRenderer = (alg: string, view: PuzzleImageView, stickering: string) => string | null
