import { ChangeEvent, useRef } from 'react'
import { useBackgroundImageStore } from '@/store/BackgroundThemeStore'
import { useTranslations } from 'next-intl'
import { ImageIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'

export default function CustomTheme() {
  const dataInputRef = useRef<HTMLInputElement>(null)
  const setBackgroundImage = useBackgroundImageStore((state) => state.setBackgroundImage)
  const t = useTranslations('Index')
  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const newBackgroundImage = event.target.files?.[0]

    if (!newBackgroundImage) return

    if (!newBackgroundImage.type.startsWith('image/')) {
      alert(`${t('Settings-menu.allowed-file-types')}`)
      if (dataInputRef.current) {
        dataInputRef.current.value = ''
      }
      return
    }

    // Convert image to string base64
    const base64Image = await readFileAsBase64(newBackgroundImage)

    // Save to IndexedDB
    setBackgroundImage(base64Image)
  }

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64Image = reader.result as string
        resolve(base64Image)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  return (
    <>
      <div className="ps-3 pe-3 mb-3">
        <input type="file" accept="image/*" ref={dataInputRef} className="hidden" onChange={handleImageChange} />
        <Button
          variant={'outline'}
          className="mt-3 flex items-center gap-1"
          onClick={() => dataInputRef.current && dataInputRef.current.click()}
        >
          <ImageIcon className="w-4 h-4" />
          {t('Settings-menu.custom-background-image')}
        </Button>
        <div className="text-xs text-muted-foreground mt-1">
          {t('Settings-descriptions.custom-background-description')}
        </div>
      </div>
    </>
  )
}
