import { ChangeEvent, useRef } from 'react'
import { useBackgroundImageStore } from '@/shared/model/settings/useBackgroundImageStore'
import { useTranslations } from 'next-intl'
import { Cross2Icon, ImageIcon } from '@radix-ui/react-icons'

export default function CustomTheme() {
  const dataInputRef = useRef<HTMLInputElement>(null)
  const { backgroundImage, setBackgroundImage, deleteBackgroundImage } = useBackgroundImageStore()
  const t = useTranslations('Index.Settings-menu')

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const newBackgroundImage = event.target.files?.[0]

    if (!newBackgroundImage) return

    if (!newBackgroundImage.type.startsWith('image/')) {
      alert(`${t('allowed-file-types')}`)
      if (dataInputRef.current) {
        dataInputRef.current.value = ''
      }
      return
    }

    // Convert image to string base64
    const base64Image = await readFileAsBase64(newBackgroundImage)

    // Save to IndexedDB
    setBackgroundImage(base64Image)

    // Allow picking the same file again after removing it
    if (dataInputRef.current) {
      dataInputRef.current.value = ''
    }
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

  const openFilePicker = () => dataInputRef.current?.click()

  return (
    <div className="flex flex-col items-center">
      <input type="file" accept="image/*" ref={dataInputRef} className="hidden" onChange={handleImageChange} />

      {backgroundImage ? (
        <div
          onClick={openFilePicker}
          className="relative w-28 h-20 sm:w-36 sm:h-24 notch-bl-tr [--nblt:14px] overflow-hidden cursor-pointer transition-all duration-200 border-2 border-primary scale-[1.02]"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
        >
          <button
            type="button"
            aria-label={t('close')}
            onClick={(event) => {
              event.stopPropagation()
              deleteBackgroundImage()
            }}
            className="absolute top-1 right-1 w-5 h-5 text-white rounded-full bg-red-600 flex items-center justify-center hover:scale-110 transition duration-200"
          >
            <Cross2Icon className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div
          onClick={openFilePicker}
          className="w-28 h-20 sm:w-36 sm:h-24 notch-bl-tr [--nblt:14px] overflow-hidden cursor-pointer transition-all duration-200 border border-dashed border-neutral-400 hover:border-primary text-muted-foreground hover:text-foreground flex items-center justify-center"
        >
          <ImageIcon className="w-6 h-6" />
        </div>
      )}

      <div className="mt-1.5 max-w-28 sm:max-w-36 text-center text-xs font-medium leading-tight">
        {t('custom-background-image')}
      </div>
    </div>
  )
}
