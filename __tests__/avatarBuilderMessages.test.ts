import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import {
  BACKGROUND_COLORS,
  BODY_COLORS,
  BUILDER_TABS,
  SLOT_MESSAGES,
  SLOT_OPTIONS
} from '@/features/avatar-builder/model/nexiOptions'

const MESSAGES = path.resolve(__dirname, '../messages')
const locales = readdirSync(MESSAGES).filter((file) => file.endsWith('.json'))

const expectedKeys = [
  ...BUILDER_TABS.map((tab) => `tabs.${tab}`),
  ...BODY_COLORS.map(({ id }) => `colors.${id}`),
  ...BACKGROUND_COLORS.map(({ id }) => `backgrounds.${id}`),
  ...Object.entries(SLOT_MESSAGES).flatMap(([slot, group]) =>
    SLOT_OPTIONS[slot as keyof typeof SLOT_MESSAGES].map((id) => `${group}.${id}`)
  )
]

describe('avatar builder messages', () => {
  it.each(locales)('%s labels every tab and option', (file) => {
    const builder = JSON.parse(readFileSync(path.join(MESSAGES, file), 'utf8')).Index.AvatarBuilder
    const missing = expectedKeys.filter((key) => {
      const [group, id] = key.split('.')
      return typeof builder?.[group]?.[id] !== 'string' || builder[group][id].trim() === ''
    })

    expect(missing).toEqual([])
    expect(builder.remove).toContain('{item}')
  })
})
