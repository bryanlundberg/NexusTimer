import { Fragment } from 'react'
import { cn } from '@/shared/lib/utils'
import { parseNotation } from '@/shared/lib/parseNotation'

interface AlgorithmNotationProps {
  alg: string
  triggers?: boolean
  className?: string
}

export default function AlgorithmNotation({ alg, triggers = true, className }: AlgorithmNotationProps) {
  const tokens = parseNotation(alg, { triggers })

  return (
    <code className={cn('font-display font-medium [word-spacing:0.12em]', className, 'leading-loose')}>
      {tokens.map((token, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          {token.type === 'group' ? (
            <span className="whitespace-nowrap rounded-br-[0.4em] bg-primary/15 px-[0.35em] py-[0.1em] [corner-shape:bevel]">
              {token.moves.join(' ')}
            </span>
          ) : (
            <span className="whitespace-nowrap">{token.move}</span>
          )}
        </Fragment>
      ))}
    </code>
  )
}
