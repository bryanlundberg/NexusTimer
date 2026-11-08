import type { TurnMotion } from '../../geometry/axis-turn-system'
import type { Mat4 } from '../mat4'
import type { PolyMesh } from './poly-mesh'
import { MAX_MOTIONS, POLY_ATTRIBUTE, createPolyProgram } from './poly-shader'

export interface PolyFrame {
  readonly width: number
  readonly height: number
  readonly projection: Mat4
  readonly view: Mat4
  readonly scale: number
  readonly ambient: number
  readonly mesh: PolyMesh
  readonly colors: Float32Array
  readonly motions: readonly TurnMotion[]
}

interface Uploaded {
  readonly mesh: PolyMesh
  readonly indexCount: number
}

export class WebGlPolyRenderer {
  readonly #gl: WebGL2RenderingContext
  readonly #program: WebGLProgram
  readonly #vao: WebGLVertexArrayObject
  readonly #buffers: Record<'position' | 'normal' | 'center' | 'color' | 'index', WebGLBuffer>
  readonly #uniform: (name: string) => WebGLUniformLocation | null
  #uploaded: Uploaded | null = null
  #colors: Float32Array | null = null

  private constructor(
    private readonly canvas: HTMLCanvasElement,
    gl: WebGL2RenderingContext
  ) {
    this.#gl = gl
    this.#program = createPolyProgram(gl)
    gl.useProgram(this.#program)
    gl.enable(gl.DEPTH_TEST)
    this.#vao = gl.createVertexArray()!
    this.#buffers = {
      position: gl.createBuffer()!,
      normal: gl.createBuffer()!,
      center: gl.createBuffer()!,
      color: gl.createBuffer()!,
      index: gl.createBuffer()!
    }
    gl.bindVertexArray(this.#vao)
    for (const name of ['position', 'normal', 'center', 'color'] as const) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.#buffers[name])
      gl.enableVertexAttribArray(POLY_ATTRIBUTE[name])
      gl.vertexAttribPointer(POLY_ATTRIBUTE[name], 3, gl.FLOAT, false, 0, 0)
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#buffers.index)
    const locations = new Map<string, WebGLUniformLocation | null>()
    this.#uniform = (name) => {
      if (!locations.has(name)) locations.set(name, gl.getUniformLocation(this.#program, name))
      return locations.get(name)!
    }
  }

  static create(canvas: HTMLCanvasElement): WebGlPolyRenderer | null {
    try {
      const gl = canvas.getContext('webgl2', { antialias: true, alpha: true, premultipliedAlpha: true })
      return gl ? new WebGlPolyRenderer(canvas, gl) : null
    } catch {
      return null
    }
  }

  render(frame: PolyFrame): void {
    const gl = this.#gl
    if (this.canvas.width !== frame.width || this.canvas.height !== frame.height) {
      this.canvas.width = frame.width
      this.canvas.height = frame.height
    }
    gl.useProgram(this.#program)
    gl.bindVertexArray(this.#vao)
    this.#upload(frame)

    gl.viewport(0, 0, frame.width, frame.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.uniformMatrix4fv(this.#uniform('u_projection'), false, frame.projection)
    gl.uniformMatrix4fv(this.#uniform('u_view'), false, frame.view)
    gl.uniform1f(this.#uniform('u_scale'), frame.scale)
    gl.uniform1f(this.#uniform('u_ambient'), frame.ambient)
    const motions = frame.motions.slice(0, MAX_MOTIONS)
    gl.uniform1i(this.#uniform('u_motionCount'), motions.length)
    motions.forEach((motion, i) => {
      gl.uniform3f(this.#uniform(`u_axis[${i}]`), motion.axis[0]!, motion.axis[1]!, motion.axis[2]!)
      gl.uniform1f(this.#uniform(`u_above[${i}]`), motion.above)
      gl.uniform1f(this.#uniform(`u_angle[${i}]`), motion.angle)
    })
    gl.drawElements(gl.TRIANGLES, this.#uploaded!.indexCount, gl.UNSIGNED_INT, 0)
  }

  dispose(): void {
    const gl = this.#gl
    for (const buffer of Object.values(this.#buffers)) gl.deleteBuffer(buffer)
    gl.deleteVertexArray(this.#vao)
    gl.deleteProgram(this.#program)
  }

  #upload({ mesh, colors }: PolyFrame): void {
    const gl = this.#gl
    if (this.#uploaded?.mesh !== mesh) {
      const data = { position: mesh.positions, normal: mesh.normals, center: mesh.centers } as const
      for (const name of ['position', 'normal', 'center'] as const) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#buffers[name])
        gl.bufferData(gl.ARRAY_BUFFER, data[name], gl.STATIC_DRAW)
      }
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#buffers.index)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW)
      this.#uploaded = { mesh, indexCount: mesh.indices.length }
      this.#colors = null
    }
    if (this.#colors !== colors) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.#buffers.color)
      gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW)
      this.#colors = colors
    }
  }
}
