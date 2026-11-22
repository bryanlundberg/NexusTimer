export function formatKeyCode(code: string): string {
  if (!code) return 'Space'
  if (code === 'Space') return 'Space'
  if (code.startsWith('Key')) return code.slice(3)
  if (code.startsWith('Digit')) return code.slice(5)
  if (code.startsWith('Numpad')) return `Numpad ${code.slice(6)}`
  if (code.startsWith('Arrow')) return code.slice(5)
  const sided = code.match(/^(Control|Shift|Alt|Meta)(Left|Right)$/)
  if (sided) return `${sided[1] === 'Control' ? 'Ctrl' : sided[1]} (${sided[2] === 'Left' ? 'L' : 'R'})`
  return code
}
