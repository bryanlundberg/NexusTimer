export const NEXI_BODY_COLORS = [
  { id: 'indigo', hex: '#5b63f5' },
  { id: 'blue', hex: '#3b82f6' },
  { id: 'cyan', hex: '#22d3ee' },
  { id: 'teal', hex: '#14b8a6' },
  { id: 'mint', hex: '#6ee7b7' },
  { id: 'green', hex: '#2ec27e' },
  { id: 'lime', hex: '#a3e635' },
  { id: 'yellow', hex: '#ffce3a' },
  { id: 'cream', hex: '#fde68a' },
  { id: 'orange', hex: '#ff8a3c' },
  { id: 'caramel', hex: '#c08552' },
  { id: 'coral', hex: '#fb7185' },
  { id: 'red', hex: '#f0473f' },
  { id: 'cherry', hex: '#be123c' },
  { id: 'pink', hex: '#f472b6' },
  { id: 'lavender', hex: '#c4b5fd' },
  { id: 'violet', hex: '#8b5cf6' },
  { id: 'white', hex: '#eef0f4' },
  { id: 'silver', hex: '#94a3b8' },
  { id: 'gold', hex: '#e0b84a' }
] as const

export const NEXI_BACKGROUND_COLORS = [
  { id: 'steel', hex: '#2e4a7a' },
  { id: 'indigo', hex: '#3842a8' },
  { id: 'violet', hex: '#5a2d9c' },
  { id: 'grape', hex: '#6b3f8f' },
  { id: 'maroon', hex: '#7a2457' },
  { id: 'raspberry', hex: '#b03a6a' },
  { id: 'wine', hex: '#9b2c3a' },
  { id: 'rust', hex: '#a0481d' },
  { id: 'mustard', hex: '#8a6a12' },
  { id: 'olive', hex: '#3d5a1f' },
  { id: 'forest', hex: '#2f6b2f' },
  { id: 'petrol', hex: '#13706a' },
  { id: 'turquoise', hex: '#1f7a8c' },
  { id: 'ocean', hex: '#1b5f8f' },
  { id: 'graphite', hex: '#4a4f63' },
  { id: 'coffee', hex: '#7b4a2a' }
] as const

export type NexiBodyColorId = (typeof NEXI_BODY_COLORS)[number]['id']
export type NexiBackgroundColorId = (typeof NEXI_BACKGROUND_COLORS)[number]['id']
