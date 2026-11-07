export const rect = (x: number, y: number, width: number, height: number): number[] => [
  x,
  y,
  x + width,
  y,
  x + width,
  y + height,
  x,
  y + height
]
