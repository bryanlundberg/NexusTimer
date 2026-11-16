import { ContactShadow } from './contact-shadow'
import type { CubeFrame, CubeFrameRenderer } from './cube-frame'
import { cubeMesh, type MeshPart } from './cube-mesh'
import { ATTRIBUTE, createCubeProgram } from './cube-shader'
import { applyStudioMaterial, uniformLocator } from './studio-lighting'

interface PartBuffers {
  readonly vao: WebGLVertexArrayObject
  readonly indexCount: number
}

interface DynamicBuffer {
  readonly buffer: WebGLBuffer
  last: Float32Array | null
}

interface Scene {
  readonly outlineWidth: number
  readonly body: PartBuffers
  readonly stickers: PartBuffers
  readonly hints: PartBuffers
  readonly stickerColors: DynamicBuffer
  readonly hintColors: DynamicBuffer
  readonly hintAlphas: DynamicBuffer
  readonly pieceHalfSize: number
  readonly capDepth: number
  readonly pieceColors: PieceColors | null
}

interface PieceColors {
  readonly buffer: DynamicBuffer
  readonly stickerOf: Int32Array
  readonly verticesPerSticker: number
  readonly data: Float32Array
}

const fillPieceColors = (target: PieceColors, stickerColors: Float32Array): void => {
  const { stickerOf, verticesPerSticker, data } = target
  for (let vertex = 0; vertex < stickerOf.length; vertex++) {
    const source = stickerOf[vertex]! * verticesPerSticker * 3
    data[vertex * 3] = stickerColors[source]!
    data[vertex * 3 + 1] = stickerColors[source + 1]!
    data[vertex * 3 + 2] = stickerColors[source + 2]!
  }
}

interface Uniforms {
  readonly projection: WebGLUniformLocation | null
  readonly view: WebGLUniformLocation | null
  readonly scale: WebGLUniformLocation | null
  readonly turnAxis: WebGLUniformLocation | null
  readonly turnRange: WebGLUniformLocation | null
  readonly turnAngle: WebGLUniformLocation | null
  readonly ambient: WebGLUniformLocation | null
  readonly outlineWidth: WebGLUniformLocation | null
  readonly outlineAlpha: WebGLUniformLocation | null
  readonly studio: WebGLUniformLocation | null
  readonly edge: WebGLUniformLocation | null
  readonly pieceHalfSize: WebGLUniformLocation | null
  readonly capDepth: WebGLUniformLocation | null
  readonly core: WebGLUniformLocation | null
}

interface GlState {
  readonly canvas: HTMLCanvasElement
  readonly gl: WebGL2RenderingContext
  readonly program: WebGLProgram
  readonly uniforms: Uniforms
  readonly locate: (name: string) => WebGLUniformLocation | null
  shadow: ContactShadow | null
}

const OUTLINE_WIDTH = 0.008

type Track = <T>(resource: T, release: (resource: T) => void) => T

const trackedBuffer = (gl: WebGL2RenderingContext, track: Track): WebGLBuffer =>
  track(gl.createBuffer(), (buffer) => gl.deleteBuffer(buffer))

const uploadAttribute = (
  gl: WebGL2RenderingContext,
  track: Track,
  location: number,
  data: Float32Array,
  components = 3
): void => {
  gl.bindBuffer(gl.ARRAY_BUFFER, trackedBuffer(gl, track))
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  gl.enableVertexAttribArray(location)
  gl.vertexAttribPointer(location, components, gl.FLOAT, false, 0, 0)
}

const createPart = (gl: WebGL2RenderingContext, track: Track, part: MeshPart): PartBuffers => {
  const vao = track(gl.createVertexArray()!, (array) => gl.deleteVertexArray(array))
  gl.bindVertexArray(vao)
  uploadAttribute(gl, track, ATTRIBUTE.position, part.positions)
  uploadAttribute(gl, track, ATTRIBUTE.slot, part.slots)
  uploadAttribute(gl, track, ATTRIBUTE.normal, part.normals)
  uploadAttribute(gl, track, ATTRIBUTE.occlusion, part.occlusion, 1)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trackedBuffer(gl, track))
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, part.indices, gl.STATIC_DRAW)
  return { vao, indexCount: part.indices.length }
}

const createDynamic = (
  gl: WebGL2RenderingContext,
  track: Track,
  part: PartBuffers,
  location: number,
  components: number,
  vertexCount: number
): DynamicBuffer => {
  gl.bindVertexArray(part.vao)
  const buffer = trackedBuffer(gl, track)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertexCount * components * 4, gl.DYNAMIC_DRAW)
  gl.enableVertexAttribArray(location)
  gl.vertexAttribPointer(location, components, gl.FLOAT, false, 0, 0)
  return { buffer, last: null }
}

const update = (gl: WebGL2RenderingContext, target: DynamicBuffer, data: Float32Array): void => {
  if (target.last === data) return
  gl.bindBuffer(gl.ARRAY_BUFFER, target.buffer)
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, data)
  target.last = data
}

export class WebGlCubeRenderer implements CubeFrameRenderer {
  #state: GlState | null = null
  #releases: Array<() => void> = []
  readonly #scenes = new Map<string, Scene>()

  constructor(private readonly createCanvas: () => HTMLCanvasElement = () => document.createElement('canvas')) {}

  prepare(): boolean {
    try {
      this.#ensureState()
      return true
    } catch {
      return false
    }
  }

  dispose(): void {
    for (const release of this.#releases.splice(0)) release()
    if (this.#state) {
      this.#state.shadow?.dispose()
      this.#state.gl.deleteProgram(this.#state.program)
    }
    this.#scenes.clear()
    this.#state = null
  }

  render(target: HTMLCanvasElement, frame: CubeFrame): void {
    const state = this.#ensureState()
    const { gl, canvas, uniforms, program } = state
    const material = frame.material ?? null
    gl.useProgram(program)
    const scene = this.#scene(gl, frame)

    if (canvas.width !== frame.width || canvas.height !== frame.height) {
      canvas.width = frame.width
      canvas.height = frame.height
    }
    gl.viewport(0, 0, frame.width, frame.height)
    gl.clearColor(0, 0, 0, 0)
    gl.depthMask(true)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.uniformMatrix4fv(uniforms.projection, false, frame.projection)
    gl.uniformMatrix4fv(uniforms.view, false, frame.view)
    gl.uniform1f(uniforms.scale, 1 / frame.size)
    gl.uniform1f(uniforms.ambient, frame.ambient)
    gl.uniform1i(uniforms.turnAxis, frame.turn ? frame.turn.axis : -1)
    gl.uniform2f(uniforms.turnRange, frame.turn?.from ?? 0, frame.turn?.to ?? 0)
    gl.uniform1f(uniforms.turnAngle, frame.turn?.angle ?? 0)
    gl.uniform1f(uniforms.outlineWidth, 0)
    gl.uniform1f(uniforms.outlineAlpha, 0)
    applyStudioMaterial(gl, state.locate, material)
    const core = material?.core ?? null
    const capped = core !== null && scene.pieceColors !== null
    gl.uniform1f(uniforms.edge, frame.size - 1)
    gl.uniform1f(uniforms.pieceHalfSize, scene.pieceHalfSize)
    gl.uniform1f(uniforms.capDepth, capped ? scene.capDepth : 0)
    if (core) gl.uniform3fv(uniforms.core, core)
    if (scene.pieceColors && scene.stickerColors.last !== frame.stickerColors) {
      fillPieceColors(scene.pieceColors, frame.stickerColors)
      scene.pieceColors.buffer.last = null
      update(gl, scene.pieceColors.buffer, scene.pieceColors.data)
    }
    update(gl, scene.stickerColors, frame.stickerColors)

    gl.disable(gl.BLEND)
    gl.disable(gl.CULL_FACE)
    gl.depthFunc(gl.LESS)
    this.#drawPieces(gl, scene, frame, capped)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.CULL_FACE)
    gl.cullFace(gl.FRONT)
    gl.depthMask(false)

    if (material && material.shadow > 0 && frame.groundView) {
      state.shadow ??= new ContactShadow(gl)
      gl.disable(gl.CULL_FACE)
      state.shadow.draw(frame.projection, frame.groundView, material.shadow)
      gl.useProgram(program)
      gl.enable(gl.CULL_FACE)
    }
    gl.uniform1i(uniforms.studio, 0)

    if (frame.hints) {
      update(gl, scene.hintColors, frame.hints.colors)
      update(gl, scene.hintAlphas, frame.hints.alphas)
      gl.bindVertexArray(scene.hints.vao)
      gl.drawElements(gl.TRIANGLES, scene.hints.indexCount, gl.UNSIGNED_INT, 0)
    }

    if (frame.outlineAlpha > 0) {
      gl.depthFunc(gl.LEQUAL)
      gl.uniform1f(uniforms.outlineWidth, scene.outlineWidth)
      gl.uniform1f(uniforms.outlineAlpha, frame.outlineAlpha)
      this.#drawPieces(gl, scene, frame, capped)
    }

    if (target === canvas) return
    if (target.width !== frame.width || target.height !== frame.height) {
      target.width = frame.width
      target.height = frame.height
    }
    const context = target.getContext('2d')
    if (!context) return
    context.clearRect(0, 0, frame.width, frame.height)
    context.drawImage(canvas, 0, 0)
  }

  readonly #track: Track = (resource, release) => {
    this.#releases.push(() => release(resource))
    return resource
  }

  #drawPieces(gl: WebGL2RenderingContext, scene: Scene, frame: CubeFrame, capped: boolean): void {
    gl.vertexAttrib1f(ATTRIBUTE.alpha, 1)
    gl.bindVertexArray(scene.body.vao)
    if (scene.pieceColors) {
      if (capped) gl.enableVertexAttribArray(ATTRIBUTE.color)
      else gl.disableVertexAttribArray(ATTRIBUTE.color)
    }
    gl.vertexAttrib3f(ATTRIBUTE.color, frame.bodyColor[0], frame.bodyColor[1], frame.bodyColor[2])
    gl.drawElements(gl.TRIANGLES, scene.body.indexCount, gl.UNSIGNED_INT, 0)
    gl.bindVertexArray(scene.stickers.vao)
    gl.drawElements(gl.TRIANGLES, scene.stickers.indexCount, gl.UNSIGNED_INT, 0)
  }

  #ensureState(): GlState {
    if (this.#state) return this.#state
    const canvas = this.createCanvas()
    const gl = canvas.getContext('webgl2', { antialias: true, alpha: true, premultipliedAlpha: true })
    if (!gl) throw new Error('WebGL2 is not available')
    const program = createCubeProgram(gl)
    gl.useProgram(program)
    gl.enable(gl.DEPTH_TEST)
    const location = (name: string) => gl.getUniformLocation(program, name)
    this.#state = {
      canvas,
      gl,
      program,
      uniforms: {
        projection: location('u_projection'),
        view: location('u_view'),
        scale: location('u_scale'),
        turnAxis: location('u_turnAxis'),
        turnRange: location('u_turnRange'),
        turnAngle: location('u_turnAngle'),
        ambient: location('u_ambient'),
        outlineWidth: location('u_outlineWidth'),
        outlineAlpha: location('u_outlineAlpha'),
        studio: location('u_studio'),
        edge: location('u_edge'),
        pieceHalfSize: location('u_pieceHalfSize'),
        capDepth: location('u_capDepth'),
        core: location('u_core')
      },
      locate: uniformLocator(gl, program),
      shadow: null
    }
    return this.#state
  }

  #scene(gl: WebGL2RenderingContext, frame: CubeFrame): Scene {
    const key = `${frame.size}:${Object.values(frame.style).join(':')}`
    let scene = this.#scenes.get(key)
    if (!scene) {
      const mesh = cubeMesh(frame.size, frame.style)
      const track = this.#track
      const body = createPart(gl, track, mesh.body)
      const stickers = createPart(gl, track, mesh.stickers)
      const hints = createPart(gl, track, mesh.hints)
      scene = {
        outlineWidth: OUTLINE_WIDTH * mesh.extent,
        body,
        stickers,
        hints,
        stickerColors: createDynamic(gl, track, stickers, ATTRIBUTE.color, 3, mesh.stickers.vertexCount),
        hintColors: createDynamic(gl, track, hints, ATTRIBUTE.color, 3, mesh.hints.vertexCount),
        hintAlphas: createDynamic(gl, track, hints, ATTRIBUTE.alpha, 1, mesh.hints.vertexCount),
        pieceHalfSize: mesh.pieceHalfSize,
        capDepth: mesh.capDepth,
        pieceColors: mesh.body.stickerOf
          ? {
              buffer: createDynamic(gl, track, body, ATTRIBUTE.color, 3, mesh.body.vertexCount),
              stickerOf: mesh.body.stickerOf,
              verticesPerSticker: mesh.verticesPerSticker,
              data: new Float32Array(mesh.body.vertexCount * 3)
            }
          : null
      }
      this.#scenes.set(key, scene)
    }
    return scene
  }
}
