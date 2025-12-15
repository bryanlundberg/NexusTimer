import { Check, TriangleAlert, XIcon } from 'lucide-react'

export default function RatedIcon({ type }: { type: 'check' | 'cross' | 'partial' }) {
  const backgroundClass =
    type === 'partial' ? 'bg-yellow-400/10' : type === 'check' ? 'bg-green-400/10' : 'bg-red-400/10'

  return (
    <div className={`size-10 rounded-full flex items-center justify-center mx-auto ${backgroundClass}`}>
      {type === 'check' && <Check className={'text-green-400 size-6'} />}
      {type === 'cross' && <XIcon className={'text-red-400 size-6'} />}
      {type === 'partial' && <TriangleAlert className={'size-6 text-yellow-400'} />}
    </div>
  )
}
