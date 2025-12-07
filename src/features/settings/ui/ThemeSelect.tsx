import { Themes } from '@/shared/types/Themes'
import { useBackgroundImageStore } from '@/shared/model/settings/useBackgroundImageStore'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { ThemeToggleButton, useThemeTransition } from '@/components/ui/shadcn-io/theme-toggle-button'

interface Variation {
  bg: string
  text: string
  name: string
  key: Themes
}

export default function ThemeSelect() {
  const { backgroundImage, deleteBackgroundImage } = useBackgroundImageStore()
  const { startTransition } = useThemeTransition()
  const { setTheme, resolvedTheme } = useTheme()
  const t = useTranslations('Index.Settings-menu')
  const variation: Variation[] = [
    {
      bg: 'bg-neutral-100',
      text: 'text-white',
      name: t('light'),
      key: 'light'
    },
    {
      bg: 'bg-zinc-950',
      text: 'text-white',
      name: t('dark'),
      key: 'dark'
    }
  ]

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSetTheme = useCallback(
    (mode: Themes) => {
      if (!mode || mode === resolvedTheme) return
      startTransition(() => setTheme(mode))
    },
    [resolvedTheme, setTheme, startTransition]
  )

  if (!mounted) {
    return null
  }

  return (
    <div className="flex mx-3 gap-3">
      {variation.map((item) => (
        <div key={item.key} className="flex flex-col items-center justify-center">
          <div
            className={`relative cursor-pointer size-20 rounded-full ${item.bg} ${
              item.key === resolvedTheme ? 'ring-3 ring-primary/50' : 'border border-neutral-400'
            }`}
          >
            <ThemeToggleButton
              theme={resolvedTheme as 'light' | 'dark'}
              onClick={() => handleSetTheme(item.key)}
              variant="circle"
              start="center"
              className="absolute inset-0 h-full w-full rounded-full p-0 m-0 opacity-0"
            />
          </div>
          <div className="mt-1 text-xs font-medium">{item.name}</div>
        </div>
      ))}
      {backgroundImage && (
        <div
          className="relative cursor-pointer size-20 rounded-full"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
        >
          <div
            onClick={deleteBackgroundImage}
            className="absolute top-0 -right-2 w-6 h-6 text-white rounded-xl bg-red-600 text-center align-middle hover:scale-110 transition duration-200 mt-1 me-1"
          >
            {t('close')}
          </div>
        </div>
      )}
    </div>
  )
}
