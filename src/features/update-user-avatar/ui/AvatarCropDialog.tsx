'use client'

import { useCallback, useEffect, useState } from 'react'
import Cropper from 'react-easy-crop'
import type { Area, Point } from 'react-easy-crop'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Loader2, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { getCroppedAvatarFile } from '../model/cropImage'

const MIN_ZOOM = 1
const MAX_ZOOM = 3

interface AvatarCropDialogProps {
  open: boolean
  imageSrc: string | null
  onConfirm: (file: File) => void
  onCancel: () => void
}

export function AvatarCropDialog({ open, imageSrc, onConfirm, onCancel }: AvatarCropDialogProps) {
  const tAccount = useTranslations('Index.AccountPage')
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (open) {
      setCrop({ x: 0, y: 0 })
      setZoom(MIN_ZOOM)
      setCroppedAreaPixels(null)
      setIsProcessing(false)
    }
  }, [open])

  const handleCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCancel = () => {
    if (isProcessing) return
    onCancel()
  }

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels || isProcessing) return
    try {
      setIsProcessing(true)
      const file = await getCroppedAvatarFile(imageSrc, croppedAreaPixels)
      onConfirm(file)
    } catch {
      toast.error(tAccount('crop-error'))
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && handleCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{tAccount('crop-title')}</DialogTitle>
          <DialogDescription>{tAccount('crop-description')}</DialogDescription>
        </DialogHeader>

        <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-md bg-muted">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              minZoom={MIN_ZOOM}
              maxZoom={MAX_ZOOM}
              zoomWithScroll
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          <ZoomOut className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            aria-label={tAccount('crop-zoom')}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="w-full accent-primary"
          />
          <ZoomIn className="size-4 shrink-0 text-muted-foreground" />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isProcessing}>
            {tAccount('crop-cancel')}
          </Button>
          <Button onClick={handleConfirm} disabled={isProcessing || !imageSrc} className="gap-2">
            {isProcessing && <Loader2 className="size-4 animate-spin" />}
            {tAccount('crop-confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
