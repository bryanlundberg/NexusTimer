const NUMERALS: Array<[number, string]> = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I']
]

export function toRoman(value: number): string {
  if (!Number.isFinite(value) || value < 1) return ''

  let remaining = Math.floor(value)
  let out = ''

  for (const [amount, numeral] of NUMERALS) {
    while (remaining >= amount) {
      out += numeral
      remaining -= amount
    }
  }

  return out
}
