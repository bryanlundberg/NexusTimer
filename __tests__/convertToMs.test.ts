import convertToMs from '@/shared/lib/convertToMs'

describe('convertToMs', () => {
  describe('length 1-2 (centiseconds only)', () => {
    it('parses single digit as centiseconds', () => {
      expect(convertToMs('5')).toBe(50)
    })

    it('parses two digits as centiseconds', () => {
      expect(convertToMs('99')).toBe(990)
      expect(convertToMs('00')).toBe(0)
    })
  })

  describe('length 3 (s + cs)', () => {
    it('parses S.CC format', () => {
      expect(convertToMs('123')).toBe(1230)
      expect(convertToMs('100')).toBe(1000)
      expect(convertToMs('959')).toBe(9590)
    })
  })

  describe('length 4 (ss + cs)', () => {
    it('parses SS.CC format', () => {
      expect(convertToMs('1234')).toBe(12340)
      expect(convertToMs('5959')).toBe(59590)
    })

    it('rolls seconds into minutes when ss >= 60', () => {
      expect(convertToMs('6000')).toBe(60000)
      expect(convertToMs('9999')).toBe(99990)
    })
  })

  describe('length 5 (m + ss + cs)', () => {
    it('parses M:SS.CC format', () => {
      expect(convertToMs('12345')).toBe(83450)
    })

    it('rolls seconds into minutes when ss >= 60', () => {
      expect(convertToMs('16000')).toBe(120000)
    })
  })

  describe('length 6 (mm + ss + cs)', () => {
    it('parses MM:SS.CC format', () => {
      expect(convertToMs('123456')).toBe(754560)
      expect(convertToMs('100000')).toBe(600000)
    })

    it('rolls seconds into minutes when ss >= 60', () => {
      expect(convertToMs('999999')).toBe(6039990)
    })
  })

  describe('out of range', () => {
    it('returns 0 for input longer than 6 chars', () => {
      expect(convertToMs('1234567')).toBe(0)
    })
  })
})
