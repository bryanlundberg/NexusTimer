import { cn } from '@/shared/lib/utils'
import { pillGhost, pillSmall } from '../lib/pill'
import FooterAnchor, { type FooterLink } from './FooterAnchor'

export default function PlanColumn({
  name,
  sub,
  value,
  unit,
  chips,
  action
}: {
  name: string
  sub: string
  value: string
  unit?: string
  chips: string[]
  action: FooterLink
}) {
  return (
    <div className="flex flex-col bg-background p-6 md:p-8">
      <h3 className="text-base font-medium text-foreground">{name}</h3>
      <p className="text-base text-muted-foreground">{sub}</p>

      <p className="mt-6 flex items-baseline gap-2">
        <span className="font-[family-name:var(--font-space-grotesk)] text-4xl font-medium tracking-[-0.03em] text-foreground md:text-5xl">
          {value}
        </span>
        {unit ? <span className="text-sm text-muted-foreground">{unit}</span> : null}
      </p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {chips.map((chip) => (
          <li key={chip} className="rounded-[8px] border border-border px-2.5 py-1 text-sm text-foreground">
            {chip}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <FooterAnchor link={action} className={cn(pillGhost, pillSmall)} />
      </div>
    </div>
  )
}
