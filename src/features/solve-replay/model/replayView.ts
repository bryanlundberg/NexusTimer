export interface ReplayView {
  jumpTo(moves: readonly string[]): void
  animate(move: string): void
}
