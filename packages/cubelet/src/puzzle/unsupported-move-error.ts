export class UnsupportedMoveError extends Error {
  constructor(
    readonly puzzle: string,
    readonly move: string
  ) {
    super(`"${move}" is not a valid move on ${puzzle}`)
    this.name = 'UnsupportedMoveError'
  }
}
