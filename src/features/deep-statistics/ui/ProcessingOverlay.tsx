import { LoaderCircle } from 'lucide-react'

interface ProcessingOverlayProps {
  isProcessing: boolean
}

export default function ProcessingOverlay({ isProcessing }: ProcessingOverlayProps) {
  if (!isProcessing) return null

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-background/70 z-99 flex flex-col justify-center items-center transition-opacity duration-300">
      <LoaderCircle className={'animate-spin'} />
      Calculating...
    </div>
  )
}
