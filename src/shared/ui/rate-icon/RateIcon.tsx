import { Check, TriangleAlert, XIcon } from 'lucide-react'

export default function RatedIcon({ type }: { type: 'check' | 'cross' | 'partial' }) {
  const backgroundClass =
    type === 'partial' ? 'bg-warning/10' : type === 'check' ? 'bg-success/10' : 'bg-destructive/10'

  return (
    <div className={`size-10 flex items-center justify-center mx-auto ${backgroundClass}`}>
      {type === 'check' && <Check className={'text-success size-6'} />}
      {type === 'cross' && <XIcon className={'text-destructive size-6'} />}
      {type === 'partial' && <TriangleAlert className={'size-6 text-warning'} />}
    </div>
  )
}
