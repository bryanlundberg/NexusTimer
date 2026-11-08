export type Point = readonly number[]

export const centroid = (points: readonly Point[]): number[] =>
  points[0]!.map((_, axis) => points.reduce((sum, point) => sum + point[axis]!, 0) / points.length)

export function triangleGrid(order: number, top: Point, left: Point, right: Point): Point[][] {
  const point = (row: number, column: number): Point =>
    top.map((value, axis) => value + (row * (left[axis]! - value) + column * (right[axis]! - left[axis]!)) / order)

  const triangles: Point[][] = []
  for (let row = 0; row < order; row++) {
    for (let column = 0; column <= row; column++) {
      triangles.push([point(row, column), point(row + 1, column), point(row + 1, column + 1)])
      if (column < row) triangles.push([point(row, column), point(row + 1, column + 1), point(row, column + 1)])
    }
  }
  return triangles
}
