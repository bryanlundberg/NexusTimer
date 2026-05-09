'use client'

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import _ from 'lodash'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { AlgorithmCollection } from '@/features/algorithms-list/model/types'
import AlgorithmRender from '@/shared/ui/twisty/AlgorithmRender'
import { TwistyPlayer } from 'cubing/twisty'
import { cn } from '@/shared/lib/utils'
import { Check } from 'lucide-react'

interface TrainerPickCasesModalProps {
  algorithms: AlgorithmCollection[]
  initialSelected: Set<string>
  vizConfig?: Partial<TwistyPlayer>
  puzzle: string
  onApply: (next: Set<string>) => void
}

interface CaseTileProps {
  alg: AlgorithmCollection
  config: Partial<TwistyPlayer>
  isSelected: boolean
  onToggle: (id: string) => void
}

const CaseTile = memo(function CaseTile({ alg, config, isSelected, onToggle }: CaseTileProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || visible) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            io.disconnect()
            break
          }
        }
      },
      { root: null, rootMargin: '200px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [visible])

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onToggle(alg.id)}
      className={cn(
        'group relative flex flex-col items-center gap-1.5 rounded-lg border p-2 cursor-pointer transition-colors',
        isSelected
          ? 'border-primary bg-primary/5 ring-2 ring-primary/30'
          : 'border-input bg-background/60 hover:bg-muted/40 hover:border-muted-foreground/40'
      )}
    >
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 size-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center z-10">
          <Check className="size-3" />
        </div>
      )}
      <div
        className={cn(
          'rounded-md bg-muted/40 p-1 pointer-events-none flex items-center justify-center size-[80px]',
          !isSelected && 'opacity-80'
        )}
      >
        {visible ? (
          <AlgorithmRender config={config} width={72} height={72} />
        ) : (
          <div className="size-[72px] rounded animate-pulse bg-muted" />
        )}
      </div>
      <span className="text-[11px] font-medium truncate w-full text-center">{alg.name}</span>
    </button>
  )
})

export default function TrainerPickCasesModal({
  algorithms,
  initialSelected,
  vizConfig,
  puzzle,
  onApply
}: TrainerPickCasesModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected))
  const { close } = useOverlayStore()

  const groups = useMemo(() => _.groupBy(algorithms, 'group'), [algorithms])

  const configById = useMemo(() => {
    const base = _.merge(
      {
        visualization: 'experimental-2D-LL',
        background: 'none',
        controlPanel: 'none',
        experimentalStickering: 'OLL',
        experimentalSetupAnchor: 'end',
        experimentalDragInput: 'none'
      },
      vizConfig,
      { puzzle }
    )
    const map = new Map<string, Partial<TwistyPlayer>>()
    for (const alg of algorithms) {
      map.set(alg.id, { ...base, alg: alg.algs[0]?.moves ?? '' } as Partial<TwistyPlayer>)
    }
    return map
  }, [algorithms, vizConfig, puzzle])

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleGroup = useCallback(
    (groupName: string) => {
      const groupIds = groups[groupName].map((a) => a.id)
      setSelected((prev) => {
        const allSelected = groupIds.every((id) => prev.has(id))
        const next = new Set(prev)
        groupIds.forEach((id) => (allSelected ? next.delete(id) : next.add(id)))
        return next
      })
    },
    [groups]
  )

  const selectAll = useCallback(() => setSelected(new Set(algorithms.map((a) => a.id))), [algorithms])
  const selectNone = useCallback(() => setSelected(new Set()), [])

  const handleApply = () => {
    onApply(selected)
    close()
  }

  return (
    <DialogContent className="sm:max-w-3xl gap-0 p-0 overflow-hidden flex flex-col" style={{ maxHeight: '85vh' }}>
      <DialogHeader className="p-6 pb-3 shrink-0">
        <DialogTitle>Pick cases</DialogTitle>
        <DialogDescription>
          {selected.size} of {algorithms.length} cases selected
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center gap-2 px-6 pb-3 shrink-0">
        <Button type="button" variant="outline" size="sm" onClick={selectAll}>
          Select all
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={selectNone}>
          Clear
        </Button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-6">
        <div className="flex flex-col gap-5 py-2">
          {Object.entries(groups).map(([groupName, items]) => {
            const groupIds = items.map((a) => a.id)
            const allSelected = groupIds.every((id) => selected.has(id))
            const selectedCount = items.filter((i) => selected.has(i.id)).length

            return (
              <div key={groupName} className="flex flex-col gap-3">
                <div className="flex items-center gap-2 sticky top-0 bg-background py-1 z-10">
                  <button
                    type="button"
                    onClick={() => toggleGroup(groupName)}
                    className="text-sm font-semibold tracking-tight hover:underline cursor-pointer"
                  >
                    {groupName}
                  </button>
                  <Badge
                    variant={allSelected ? 'default' : 'outline'}
                    className="text-[10px] font-normal cursor-pointer"
                    onClick={() => toggleGroup(groupName)}
                  >
                    {selectedCount} / {items.length}
                  </Badge>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {items.map((alg) => (
                    <CaseTile
                      key={alg.id}
                      alg={alg}
                      config={configById.get(alg.id)!}
                      isSelected={selected.has(alg.id)}
                      onToggle={toggle}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <DialogFooter className="p-6 pt-3 border-t shrink-0">
        <Button type="button" variant="outline" onClick={close}>
          Cancel
        </Button>
        <Button type="button" onClick={handleApply} disabled={selected.size === 0}>
          Apply ({selected.size})
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
