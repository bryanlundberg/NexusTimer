import genId from '@/shared/lib/genId'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { Cross1Icon } from '@radix-ui/react-icons'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function DrawerHintPanel() {
  const hint = useTimerStore((state) => state.hint)

  return (
    <DialogContent className="sm:max-w-[550px]">
      <DialogHeader>
        <DialogTitle className="flex gap-2 items-center">
          <Cross1Icon className="rotate-45" />
          Hints: Yellow layer
        </DialogTitle>
        <DialogDescription className="text-start">White on top - Green facing forward.</DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          {hint?.cross.map((i) => (
            <OptimalCrossLayer key={genId()} solution={i} type="cross" />
          ))}
        </div>

        <div className="mt-1 md:mt-0">
          {hint?.xcross.map((i, index) => (
            <OptimalCrossLayer key={genId()} solution={i} type="xcross" index={index} />
          ))}
        </div>
      </div>
    </DialogContent>
  )
}

function OptimalCrossLayer({
  solution,
  type,
  index = 0
}: {
  solution: string
  type: 'cross' | 'xcross'
  index?: number
}) {
  const { resolvedTheme } = useTheme()
  const rotation = (() => {
    switch (index) {
      case 0:
        return '-rotate-90'
      case 1:
        return '-rotate-180'
      case 2:
        return '-rotate-270'
      case 3:
        return '-rotate-360'
      default:
        return 'rotate-0'
    }
  })()

  return (
    <>
      <div className="select-text">
        {type === 'cross' ? (
          <Image
            src={'/icons/cross.svg'}
            alt={''}
            width={20}
            height={20}
            className={`inline mb-1 mr-1`}
            style={{
              filter:
                resolvedTheme === 'light'
                  ? 'brightness(0) saturate(100%)'
                  : 'invert(84%) sepia(85%) saturate(743%) hue-rotate(1deg) brightness(103%) contrast(102%)'
            }}
          />
        ) : (
          <Image
            src={'/icons/xcross.svg'}
            alt={''}
            width={20}
            height={20}
            className={`inline mb-1 mr-1 -rotate-90 ${rotation}`}
            style={{
              filter:
                resolvedTheme === 'light'
                  ? 'brightness(0) saturate(100%)'
                  : 'invert(84%) sepia(85%) saturate(743%) hue-rotate(1deg) brightness(103%) contrast(102%)'
            }}
          />
        )}{' '}
        - {solution}
      </div>
    </>
  )
}
