const W = 'var(--cube-white)'
const Y = 'var(--cube-yellow)'
const G = 'var(--cube-green)'
const B = 'var(--cube-blue)'
const R = 'var(--cube-red)'
const O = 'var(--cube-orange)'

const FACES = [
  { transform: 'rotateY(0deg)', stickers: [G, G, W, G, G, G, R, G, G] },
  { transform: 'rotateY(90deg)', stickers: [R, R, R, Y, R, R, R, R, B] },
  { transform: 'rotateY(180deg)', stickers: [B, B, B, B, B, O, B, B, B] },
  { transform: 'rotateY(-90deg)', stickers: [O, O, G, O, O, O, O, O, O] },
  { transform: 'rotateX(90deg)', stickers: [W, W, W, W, W, W, O, W, W] },
  { transform: 'rotateX(-90deg)', stickers: [Y, Y, Y, Y, Y, Y, Y, G, Y] }
]

export default function SpinningCube({ size = 48 }: { size?: number }) {
  return (
    <span className="block" style={{ width: size, height: size, perspective: size * 8 }}>
      <span className="lp-cube-spin relative block size-full [transform-style:preserve-3d]">
        {FACES.map((face) => (
          <span
            key={face.transform}
            className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-[6%] rounded-[12%] bg-[oklch(0.16_0.01_265)] p-[6%] [backface-visibility:hidden]"
            style={{ transform: `${face.transform} translateZ(${size / 2}px)` }}
          >
            {face.stickers.map((color, i) => (
              <span key={i} className="rounded-[18%]" style={{ backgroundColor: color }} />
            ))}
          </span>
        ))}
      </span>
    </span>
  )
}
