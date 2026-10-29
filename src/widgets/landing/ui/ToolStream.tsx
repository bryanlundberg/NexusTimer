import ToolChip, { type StreamTool } from './ToolChip'

const FADE_Y = '[mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent)]'
const FADE_X = '[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]'

export default function ToolStream({ title, tools }: { title: string; tools: StreamTool[] }) {
  const half = Math.ceil(tools.length / 2)
  const columns = [tools.slice(0, half), tools.slice(half)]

  return (
    <div className="relative flex flex-col overflow-hidden bg-background md:h-[440px]">
      <h3 className="relative z-10 p-6 font-[family-name:var(--font-space-grotesk)] text-balance text-2xl font-medium tracking-[-0.02em] text-muted-foreground md:absolute md:inset-x-0 md:top-0 md:bg-linear-to-b md:from-background md:from-60% md:to-transparent md:p-8 md:pb-14 md:text-3xl">
        {title}
      </h3>

      <div className={`hidden flex-1 gap-3 px-8 md:flex ${FADE_Y}`}>
        {columns.map((column, i) => (
          <div key={i} className="flex-1 overflow-hidden">
            <div className={`flex flex-col ${i === 0 ? 'lp-stream-up' : 'lp-stream-down'}`}>
              {[...column, ...column, ...column, ...column].map((tool, j) => (
                <div key={`${tool.name}-${j}`} className="pb-3">
                  <ToolChip {...tool} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={`flex flex-col gap-3 pb-8 md:hidden ${FADE_X}`}>
        {columns.map((column, i) => (
          <div key={i} className="overflow-hidden">
            <div className={`flex w-max ${i === 0 ? 'lp-stream-left' : 'lp-stream-right'}`}>
              {[...column, ...column, ...column, ...column].map((tool, j) => (
                <div key={`${tool.name}-${j}`} className="pr-3">
                  <ToolChip {...tool} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
