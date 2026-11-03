import { formatMs } from '@/features/trainer/lib/trainerUtils'

describe('formatMs', () => {
  it('uses two decimals by default', () => {
    expect(formatMs(1234)).toBe('1.23')
  })

  it('follows the requested decimals', () => {
    expect(formatMs(0, 1)).toBe('0.0')
    expect(formatMs(0, 3)).toBe('0.000')
    expect(formatMs(1234, 3)).toBe('1.234')
  })
})
