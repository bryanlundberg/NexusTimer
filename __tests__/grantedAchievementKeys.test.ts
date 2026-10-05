import { GRANTED_ACHIEVEMENT_KEYS } from '@nexustimer/contracts'
import { ACHIEVEMENTS_CONFIG } from '@/entities/achievement/model/achievements'

describe('GRANTED_ACHIEVEMENT_KEYS', () => {
  it('matches the granted achievements in the catalog', () => {
    const granted = ACHIEVEMENTS_CONFIG.filter((achievement) => achievement.type === 'granted').map(({ id }) => id)

    expect([...GRANTED_ACHIEVEMENT_KEYS].sort()).toEqual(granted.sort())
  })
})
