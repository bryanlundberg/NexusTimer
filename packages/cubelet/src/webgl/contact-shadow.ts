import type { Mat4 } from './mat4'
import { linkProgram } from './cube-shader'

const GROUND_HEIGHT = -1.12
const HALF_WIDTH = 1.7

const VERTEX_SHADER = `#version 300 es
layout(location = 0) in vec2 a_corner;
uniform mat4 u_projection;
uniform mat4 u_groundView;
out vec2 v_corner;

void main() {
  v_corner = a_corner;
  gl_Position = u_projection * u_groundView * vec4(a_corner.x * ${HALF_WIDTH}, ${GROUND_HEIGHT}, a_corner.y * ${HALF_WIDTH}, 1.0);
}
`

const FRAGMENT_SHADER = `#version 300 es
precision mediump float;
in vec2 v_corner;
uniform float u_opacity;
out vec4 outColor;

void main() {
  float radius = length(v_corner);
  float core = 1.0 - smoothstep(0.0, 0.62, radius);
  float halo = 1.0 - smoothstep(0.2, 1.0, radius);
  float alpha = u_opacity * (0.55 * core * core + 0.45 * halo * halo);
  outColor = vec4(0.0, 0.0, 0.0, alpha);
}
`

export class ContactShadow {
  readonly #program: WebGLProgram
  readonly #vao: WebGLVertexArrayObject
  readonly #buffer: WebGLBuffer
  readonly #projection: WebGLUniformLocation | null
  readonly #groundView: WebGLUniformLocation | null
  readonly #opacity: WebGLUniformLocation | null

  constructor(private readonly gl: WebGL2RenderingContext) {
    this.#program = linkProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER)
    this.#projection = gl.getUniformLocation(this.#program, 'u_projection')
    this.#groundView = gl.getUniformLocation(this.#program, 'u_groundView')
    this.#opacity = gl.getUniformLocation(this.#program, 'u_opacity')
    this.#vao = gl.createVertexArray()!
    gl.bindVertexArray(this.#vao)
    this.#buffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.#buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.bindVertexArray(null)
  }

  draw(projection: Mat4, groundView: Mat4, opacity: number): void {
    const facing = groundView[6]!
    const visible = opacity * Math.min(Math.max((facing - 0.05) / 0.25, 0), 1)
    if (visible <= 0) return
    const { gl } = this
    gl.useProgram(this.#program)
    gl.uniformMatrix4fv(this.#projection, false, projection)
    gl.uniformMatrix4fv(this.#groundView, false, groundView)
    gl.uniform1f(this.#opacity, visible)
    gl.bindVertexArray(this.#vao)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  dispose(): void {
    this.gl.deleteBuffer(this.#buffer)
    this.gl.deleteVertexArray(this.#vao)
    this.gl.deleteProgram(this.#program)
  }
}
