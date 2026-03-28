import { Themes } from '@/shared/types/Themes'
import { useBackgroundImageStore } from '@/shared/model/settings/useBackgroundImageStore'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'
import { ThemeToggleButton, useThemeTransition } from '@/components/ui/shadcn-io/theme-toggle-button'

function ThemePreviewLight({ selected }: { selected: boolean }) {
  return (
    <div
      className={`relative w-36 h-24 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
        selected ? 'ring-3 ring-primary/60 scale-[1.02]' : 'border border-neutral-300 hover:border-neutral-400'
      }`}
    >
      <div className="h-full w-full bg-neutral-50 flex">
        {/* Sidebar */}
        <div className="w-8 h-full bg-neutral-200 flex flex-col items-center gap-1.5 pt-2">
          <div className="w-4 h-4 rounded-md bg-neutral-300" />
          <div className="w-4 h-1 rounded-full bg-neutral-300" />
          <div className="w-4 h-1 rounded-full bg-neutral-300" />
          <div className="w-4 h-1 rounded-full bg-neutral-300" />
        </div>
        {/* Content */}
        <div className="flex-1 p-2 flex flex-col gap-1.5">
          {/* Header bar */}
          <div className="flex items-center gap-1">
            <div className="w-10 h-1.5 rounded-full bg-neutral-300" />
            <div className="ml-auto w-3 h-3 rounded-full bg-neutral-200" />
          </div>
          {/* Main content blocks */}
          <div className="flex gap-1 flex-1">
            <div className="flex-1 rounded-md bg-neutral-200" />
            <div className="flex-1 rounded-md bg-neutral-200" />
          </div>
          <div className="h-3 rounded-md bg-neutral-100" />
        </div>
      </div>
    </div>
  )
}

function ThemePreviewDark({ selected }: { selected: boolean }) {
  return (
    <div
      className={`relative w-36 h-24 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
        selected ? 'ring-3 ring-primary/60 scale-[1.02]' : 'border border-neutral-700 hover:border-neutral-600'
      }`}
    >
      <div className="h-full w-full bg-zinc-950 flex">
        {/* Sidebar */}
        <div className="w-8 h-full bg-zinc-900 flex flex-col items-center gap-1.5 pt-2">
          <div className="w-4 h-4 rounded-md bg-zinc-800" />
          <div className="w-4 h-1 rounded-full bg-zinc-800" />
          <div className="w-4 h-1 rounded-full bg-zinc-800" />
          <div className="w-4 h-1 rounded-full bg-zinc-800" />
        </div>
        {/* Content */}
        <div className="flex-1 p-2 flex flex-col gap-1.5">
          {/* Header bar */}
          <div className="flex items-center gap-1">
            <div className="w-10 h-1.5 rounded-full bg-zinc-800" />
            <div className="ml-auto w-3 h-3 rounded-full bg-zinc-900" />
          </div>
          {/* Main content blocks */}
          <div className="flex gap-1 flex-1">
            <div className="flex-1 rounded-md bg-zinc-900" />
            <div className="flex-1 rounded-md bg-zinc-900" />
          </div>
          <div className="h-3 rounded-md bg-zinc-900/50" />
        </div>
      </div>
    </div>
  )
}

export default function ThemeSelect() {
  const { backgroundImage, deleteBackgroundImage } = useBackgroundImageStore()
  const { startTransition } = useThemeTransition()
  const { setTheme, resolvedTheme } = useTheme()
  const t = useTranslations('Index.Settings-menu')

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
      <div className="flex flex-col items-center">
        <div className="relative">
          <ThemePreviewLight selected={resolvedTheme === 'light'} />
          <ThemeToggleButton
            theme={resolvedTheme as 'light' | 'dark'}
            onClick={() => handleSetTheme('light')}
            variant="circle"
            start="center"
            className="absolute inset-0 h-full w-full rounded-xl p-0 m-0 opacity-0"
          />
        </div>
        <div className="mt-1.5 text-xs font-medium">{t('light')}</div>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative">
          <ThemePreviewDark selected={resolvedTheme === 'dark'} />
          <ThemeToggleButton
            theme={resolvedTheme as 'light' | 'dark'}
            onClick={() => handleSetTheme('dark')}
            variant="circle"
            start="center"
            className="absolute inset-0 h-full w-full rounded-xl p-0 m-0 opacity-0"
          />
        </div>
        <div className="mt-1.5 text-xs font-medium">{t('dark')}</div>
      </div>

      {backgroundImage && (
        <div className="flex flex-col items-center">
          <div
            className="relative w-36 h-24 rounded-xl overflow-hidden cursor-pointer border border-neutral-400"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover'
            }}
          >
            <div
              onClick={deleteBackgroundImage}
              className="absolute top-1 right-1 w-5 h-5 text-xs text-white rounded-full bg-red-600 flex items-center justify-center hover:scale-110 transition duration-200"
            >
              {t('close')}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
