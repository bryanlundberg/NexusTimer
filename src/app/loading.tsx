import { Spinner } from '@/components/ui/spinner'

export default function Page() {
  return (
    <>
      <div className="min-h-dvh max-h-dvh w-full overflow-hidden flex items-center justify-center bg-background">
        <Spinner />
      </div>
    </>
  )
}
