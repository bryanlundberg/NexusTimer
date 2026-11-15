import { useQueryState } from 'nuqs'

export function useCubeSearchQuery() {
  const [raw, setRaw] = useQueryState('q', { defaultValue: '' })
  return [raw, (next: string) => setRaw(next || null)] as const
}

export function normalizeCubeSearch(value: string) {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase().trim()
}
