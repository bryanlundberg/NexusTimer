import formatTime from '@/shared/lib/formatTime'

describe('formatTime', () => {
  describe('default decimals (2)', () => {
    it('formats zero', () => {
      expect(formatTime(0)).toBe('0.00')
    })

    it('formats sub-second values', () => {
      expect(formatTime(500)).toBe('0.50')
      expect(formatTime(50)).toBe('0.05')
      expect(formatTime(5)).toBe('0.00')
    })

    it('formats seconds without minutes', () => {
      expect(formatTime(1500)).toBe('1.50')
      expect(formatTime(12340)).toBe('12.34')
      expect(formatTime(59999)).toBe('59.99')
    })

    it('formats values with minutes', () => {
      expect(formatTime(60000)).toBe('1:00.00')
      expect(formatTime(65500)).toBe('1:05.50')
      expect(formatTime(125750)).toBe('2:05.75')
    })

    it('pads seconds to two digits when minutes are present', () => {
      expect(formatTime(61000)).toBe('1:01.00')
      expect(formatTime(69000)).toBe('1:09.00')
    })
  })

  describe('custom decimals', () => {
    it('omits the decimal portion when decimals=0', () => {
      expect(formatTime(1500, 0)).toBe('1')
      expect(formatTime(60000, 0)).toBe('1:00')
    })

    it('shows one decimal when decimals=1', () => {
      expect(formatTime(500, 1)).toBe('0.5')
      expect(formatTime(1234, 1)).toBe('1.2')
    })

    it('shows three decimals when decimals=3', () => {
      expect(formatTime(500, 3)).toBe('0.500')
      expect(formatTime(1234, 3)).toBe('1.234')
      expect(formatTime(5, 3)).toBe('0.005')
    })

    it('pads with trailing zeros when decimals>3', () => {
      expect(formatTime(500, 4)).toBe('0.5000')
      expect(formatTime(1234, 5)).toBe('1.23400')
    })
  })

  describe('floating-point safety', () => {
    it('floors fractional millisecond portions for the decimal section', () => {
      expect(formatTime(1500.7)).toBe('1.50')
      expect(formatTime(999.9)).toBe('0.99')
    })
  })
})
