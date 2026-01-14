import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useMemo, useEffect, useState, ReactNode, memo, useCallback } from 'react'

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

  useEffect(() => {
    if (!parentRef.current) return

    let timeoutId: NodeJS.Timeout

    const updateWidth = () => {
      if (parentRef.current) {
        const width = parentRef.current.clientWidth
        if (width !== containerWidth) {
          clearTimeout(timeoutId)
          timeoutId = setTimeout(() => {
            setContainerWidth(width)
          }, 100)
        }
      }
    }

    updateWidth()

    const resizeObserver = new ResizeObserver(updateWidth)
    resizeObserver.observe(parentRef.current)

    return () => {
      clearTimeout(timeoutId)
      resizeObserver.disconnect()
    }
  }, [containerWidth])

  const columns = useMemo(() => {
    if (containerWidth === 0) return 3
    return Math.max(1, Math.floor(containerWidth / (cellWidth + gridGap)))
  }, [containerWidth, cellWidth, gridGap])

  const rows = useMemo(() => {
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
