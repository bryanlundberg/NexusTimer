export type OkResponse = { ok: true }

const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i

export function isObjectId(value: unknown): value is string {
  return typeof value === 'string' && OBJECT_ID_PATTERN.test(value)
}
