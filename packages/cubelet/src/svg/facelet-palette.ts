export interface FaceletPalette {
  readonly id: string
  readonly colors: readonly string[]
  readonly dimColors: readonly string[]
  readonly ignored: string
  readonly outline: string
}

export const WCA_CUBE_PALETTE: FaceletPalette = {
  id: 'wca-cube',
  colors: ['#f4f4f5', '#e5322f', '#2fc469', '#f3c623', '#f57c1f', '#3b82f6'],
  dimColors: ['#7a7a80', '#73191a', '#186236', '#7a6312', '#7b3e10', '#1e417b'],
  ignored: '#a1a1aa',
  outline: '#71717a'
}
