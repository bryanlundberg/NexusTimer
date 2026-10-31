import ToolChip, { type StreamTool } from './ToolChip'

const FADE_X = '[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]'

export default function ToolStream({ title, tools }: { title: string; tools: StreamTool[] }) {
  const half = Math.ceil(tools.length / 2)
  const rows = [tools.slice(0, half), tools.slice(half)]

  return (
    <div className="relative flex flex-col bg-background">
      <h3 className="p-6 text-center font-[family-name:var(--font-space-grotesk)] text-balance text-2xl font-medium tracking-[-0.02em] text-muted-foreground md:p-8 md:text-3xl">
        {title}
      </h3>

      <div className={`flex flex-col gap-3 ${FADE_X}`}>
        {rows.map((row, i) => (
          <div key={i} className="overflow-hidden">
            <div className={`flex w-max ${i === 0 ? 'lp-stream-left' : 'lp-stream-right'}`}>
              {[...row, ...row, ...row, ...row].map((tool, j) => (
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
