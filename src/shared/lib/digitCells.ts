export const DIGIT_CELL_CLASS =
  'inline-block w-[var(--digit-cell-w,0.64em)] [text-align:var(--digit-cell-align,center)]'

export function isDigit(char: string): boolean {
  return char >= '0' && char <= '9'
}

export function digitCellsHTML(text: string): string {
  return text.replace(/\d/g, (digit) => `<span class="${DIGIT_CELL_CLASS}">${digit}</span>`)
}
