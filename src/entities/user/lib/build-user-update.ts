type UpdateBody = Record<string, unknown>

export interface UserUpdate {
  $set?: Record<string, unknown>
  $unset?: Record<string, ''>
}

export function buildUserUpdate(body: UpdateBody): UserUpdate | null {
  const $set: Record<string, unknown> = {}
  const $unset: Record<string, ''> = {}

  for (const [key, value] of Object.entries(body)) {
    if (value === undefined) continue
    if (value === null || (Array.isArray(value) && value.length === 0)) $unset[key] = ''
    else $set[key] = value
  }

  const update: UserUpdate = {}
  if (Object.keys($set).length) update.$set = $set
  if (Object.keys($unset).length) update.$unset = $unset
  return update.$set || update.$unset ? update : null
}
