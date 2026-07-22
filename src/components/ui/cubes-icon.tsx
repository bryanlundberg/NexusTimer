import type { SVGProps } from 'react'

export default function CubesIcon({ size = 24, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  const cells = [
    [1, 5],
    [9, 5],
    [17, 5],
    [1, 13],
    [9, 13],
    [17, 13]
  ]
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={6} height={6} rx={1} />
      ))}
    </svg>
  )
}
