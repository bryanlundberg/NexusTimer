import { Colors } from '@/interfaces/types/colors'
import { useSettingsModalStore } from '@/store/SettingsModalStore'
import useWebsiteColors from '@/hooks/useWebsiteColors'

export default function MenuSelectColor() {
  const settings = useSettingsModalStore((state) => state.settings)
  const updateSetting = useSettingsModalStore((state) => state.updateSetting)
  const { applyColorTheme } = useWebsiteColors()

  const handleChooseColor = (newColor: Colors) => {
    updateSetting('preferences.colorTheme', newColor)
    applyColorTheme(newColor)
  }

  const currentColor = settings.preferences.colorTheme

  return (
    <div className="flex flex-col gap-2 px-2 mt-5">
      <div className="flex flex-wrap gap-2">
        <div
          className={`size-10 rounded-full bg-red-500 hover:bg-red-600 focus:outline-hidden ${currentColor === 'red' ? 'ring-3 ring-primary/50' : ''}`}
          onClick={() => handleChooseColor('red')}
        ></div>
        <div
          className={`size-10 rounded-full bg-orange-500 hover:bg-orange-600 focus:outline-hidden ${currentColor === 'orange' ? 'ring-3 ring-primary/50' : ''}`}
          onClick={() => handleChooseColor('orange')}
        ></div>
        <div
          className={`size-10 rounded-full bg-yellow-500 hover:bg-yellow-600 focus:outline-hidden ${currentColor === 'yellow' ? 'ring-3 ring-primary/50' : ''}`}
          onClick={() => handleChooseColor('yellow')}
        ></div>
        <div
          className={`size-10 rounded-full bg-green-500 hover:bg-green-600 focus:outline-hidden ${currentColor === 'green' ? 'ring-3 ring-primary/50' : ''}`}
          onClick={() => handleChooseColor('green')}
        ></div>
        <div
          className={`size-10 rounded-full bg-blue-500 hover:bg-blue-600 focus:outline-hidden ${currentColor === 'blue' ? 'ring-3 ring-primary/50' : ''}`}
          onClick={() => handleChooseColor('blue')}
        ></div>
        <div
          className={`size-10 rounded-full bg-violet-500 hover:bg-violet-600 focus:outline-hidden ${currentColor === 'violet' ? 'ring-3 ring-primary/50' : ''}`}
          onClick={() => handleChooseColor('violet')}
        ></div>
        <div
          className={`size-10 rounded-full bg-rose-500 hover:bg-rose-600 focus:outline-hidden ${currentColor === 'rose' ? 'ring-3 ring-primary/50' : ''}`}
          onClick={() => handleChooseColor('rose')}
        ></div>
        <div
          className={`size-10 rounded-full bg-neutral-500 hover:bg-neutral-600 focus:outline-hidden ${currentColor === 'neutral' ? 'ring-3 ring-primary/50' : ''}`}
          onClick={() => handleChooseColor('neutral')}
        ></div>
      </div>
    </div>
  )
}
