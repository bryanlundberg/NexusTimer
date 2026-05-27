import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useMemo, useEffect, useLayoutEffect, useState, ReactNode, memo, useCallback } from 'react'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

interface VirtualizedGridProps<T> {
  items: T[]
  cellWidth: number
  cellHeight: number
  gridGap?: number
  overscan?: number
  className?: string
  renderItem: (item: T, index: number) => ReactNode
  getItemKey: (item: T, index: number) => string
}

function VirtualizedGridComponent<T>({
  items,
  cellWidth,
  cellHeight,
  gridGap = 8,
  overscan = 3,
  className = '',
  renderItem,
  getItemKey
}: VirtualizedGridProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useIsomorphicLayoutEffect(() => {
    if (!parentRef.current) return

    const node = parentRef.current
    let timeoutId: NodeJS.Timeout | null = null
    let initialized = false

    const applyWidth = (width: number) => {
      setContainerWidth((prev) => (prev === width ? prev : width))
    }

    const measure = () => {
      const width = node.clientWidth
      if (!initialized) {
        initialized = true
        applyWidth(width)
        return
      }
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => applyWidth(width), 100)
    }

    measure()

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(node)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      resizeObserver.disconnect()
    }
  }, [])

  const columns = useMemo(() => {
    if (containerWidth === 0) return 0
    return Math.max(1, Math.floor(containerWidth / (cellWidth + gridGap)))
  }, [containerWidth, cellWidth, gridGap])

  const rows = useMemo(() => {
    if (columns === 0) return 0
    return Math.ceil(items.length / columns)
  }, [items.length, columns])

  const getScrollElement = useCallback(() => parentRef.current, [])
  const estimateSize = useCallback(() => cellHeight + gridGap, [cellHeight, gridGap])

  const rowVirtualizer = useVirtualizer({
    count: rows,
    getScrollElement,
    estimateSize,
    overscan
  })

  const virtualItems = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()

  return (
    <div ref={parentRef} className={`h-full overflow-auto ${className}`}>
      <div
        style={{
          height: `${totalSize}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {virtualItems.map((virtualRow) => {
          const startIndex = virtualRow.index * columns

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${cellHeight}px`,
                transform: `translateY(${virtualRow.start}px)`,
                willChange: 'transform'
              }}
            >
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                  gap: `${gridGap}px`,
                  height: '100%'
                }}
              >
                {Array.from({ length: columns }).map((_, colIndex) => {
                  const index = startIndex + colIndex
                  if (index >= items.length) return null

                  const item = items[index]
                  return <div key={getItemKey(item, index)}>{renderItem(item, index)}</div>
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const VirtualizedGrid = memo(VirtualizedGridComponent) as typeof VirtualizedGridComponent

export default VirtualizedGrid
