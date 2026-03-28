import { Colors } from '@/shared/types/colors'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import useWebsiteColors from '@/shared/model/useWebsiteColors'

const colorOptions: { key: Colors; bg: string; gradient: string; label: string }[] = [
  { key: 'red', bg: 'bg-red-500', gradient: 'from-red-400 to-red-600', label: 'Red' },
  { key: 'orange', bg: 'bg-orange-500', gradient: 'from-orange-400 to-orange-600', label: 'Orange' },
  { key: 'yellow', bg: 'bg-yellow-500', gradient: 'from-yellow-400 to-yellow-600', label: 'Yellow' },
  { key: 'green', bg: 'bg-green-500', gradient: 'from-green-400 to-green-600', label: 'Green' },
  { key: 'blue', bg: 'bg-blue-500', gradient: 'from-blue-400 to-blue-600', label: 'Blue' },
  { key: 'violet', bg: 'bg-violet-500', gradient: 'from-violet-400 to-violet-600', label: 'Violet' },
  { key: 'rose', bg: 'bg-rose-500', gradient: 'from-rose-400 to-rose-600', label: 'Rose' },
  { key: 'neutral', bg: 'bg-neutral-500', gradient: 'from-neutral-400 to-neutral-600', label: 'Neutral' }
]

export default function MenuSelectColor() {
  const settings = useSettingsStore((state) => state.settings)
  const updateSetting = useSettingsStore((state) => state.updateSetting)
  const { applyColorTheme } = useWebsiteColors()

  const handleChooseColor = (newColor: Colors) => {
    updateSetting('preferences.colorTheme', newColor)
    applyColorTheme(newColor)
  }

  const currentColor = settings.preferences.colorTheme

  return (
    <div className="flex flex-col gap-2 px-2 mt-5">
      <div className="flex flex-wrap gap-2">
        {colorOptions.map((color) => {
          const isSelected = currentColor === color.key
          return (
            <button
              key={color.key}
              onClick={() => handleChooseColor(color.key)}
              className={`group relative size-9 sm:size-11 rounded-full bg-gradient-to-br ${color.gradient} transition-all duration-200 focus:outline-hidden cursor-pointer shrink-0 ${
                isSelected
                  ? 'ring-3 ring-primary/50 ring-offset-2 ring-offset-background scale-110'
                  : 'hover:scale-110 hover:shadow-lg'
              }`}
            >
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              {isSelected && (
                <svg
                  className="absolute inset-0 m-auto size-5 text-white drop-shadow-md"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
