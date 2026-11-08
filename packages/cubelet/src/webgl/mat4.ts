export type Mat4 = Float32Array

export type Quaternion = readonly [x: number, y: number, z: number, w: number]

export const IDENTITY_QUATERNION: Quaternion = [0, 0, 0, 1]

export const identity = (): Mat4 => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])

export function multiply(a: Mat4, b: Mat4): Mat4 {
  const out = new Float32Array(16)
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      let sum = 0
      for (let k = 0; k < 4; k++) sum += a[k * 4 + row]! * b[col * 4 + k]!
      out[col * 4 + row] = sum
    }
  }
  return out
}

export function perspective(fieldOfView: number, aspect: number, near: number, far: number): Mat4 {
  const f = 1 / Math.tan(fieldOfView / 2)
  const out = new Float32Array(16)
  out[0] = f / aspect
  out[5] = f
  out[10] = (far + near) / (near - far)
  out[11] = -1
  out[14] = (2 * far * near) / (near - far)
  return out
}

export function translation(x: number, y: number, z: number): Mat4 {
  const out = identity()
  out[12] = x
  out[13] = y
  out[14] = z
  return out
}

export function rotationX(angle: number): Mat4 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  const out = identity()
  out[5] = c
  out[6] = s
  out[9] = -s
  out[10] = c
  return out
}

export function rotationY(angle: number): Mat4 {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  const out = identity()
  out[0] = c
  out[2] = -s
  out[8] = s
  out[10] = c
  return out
}

export function fromQuaternion([x, y, z, w]: Quaternion): Mat4 {
  const out = identity()
  out[0] = 1 - 2 * (y * y + z * z)
  out[1] = 2 * (x * y + z * w)
  out[2] = 2 * (x * z - y * w)
  out[4] = 2 * (x * y - z * w)
  out[5] = 1 - 2 * (x * x + z * z)
  out[6] = 2 * (y * z + x * w)
  out[8] = 2 * (x * z + y * w)
  out[9] = 2 * (y * z - x * w)
  out[10] = 1 - 2 * (x * x + y * y)
  return out
}

export function transformPoint(m: Mat4, [x, y, z]: readonly [number, number, number]): [number, number, number] {
  const w = m[3]! * x + m[7]! * y + m[11]! * z + m[15]!
  return [
    (m[0]! * x + m[4]! * y + m[8]! * z + m[12]!) / w,
    (m[1]! * x + m[5]! * y + m[9]! * z + m[13]!) / w,
    (m[2]! * x + m[6]! * y + m[10]! * z + m[14]!) / w
  ]
}
