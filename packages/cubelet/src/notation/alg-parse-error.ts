export class AlgParseError extends Error {
  constructor(
    readonly alg: string,
    readonly position: number,
    reason: string
  ) {
    super(`${reason} at ${position} in "${alg}"`)
    this.name = 'AlgParseError'
  }
}
