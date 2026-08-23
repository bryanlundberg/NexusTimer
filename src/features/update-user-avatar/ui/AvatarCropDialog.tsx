'use client'

import { useCallback, useEffect, useState } from 'react'
import Cropper from 'react-easy-crop'
import type { Area, Point, Size } from 'react-easy-crop'
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
const MAX_ZOOM = 4
const ZOOM_STEP = 0.25

// The crop circle is inset inside the frame so the image always overflows
const CROP_AREA_RATIO = 0.8

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
  // Callback ref instead of useRef: the dialog content is mounted by Radix in a
  // layout effect, so a ref read from an effect would still be null.
  const [frame, setFrame] = useState<HTMLDivElement | null>(null)
  const [cropSize, setCropSize] = useState<Size | null>(null)

  useEffect(() => {
    if (open) {
      setCrop({ x: 0, y: 0 })
      setZoom(MIN_ZOOM)
      setCroppedAreaPixels(null)
      setIsProcessing(false)
    }
  }, [open])

  useEffect(() => {
    if (!frame) return
    const observer = new ResizeObserver(([entry]) => {
      const size = Math.round(entry.contentRect.width * CROP_AREA_RATIO)
      if (size > 0) setCropSize({ width: size, height: size })
    })
    observer.observe(frame)
    return () => observer.disconnect()
  }, [frame])

  const handleCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const stepZoom = (delta: number) => {
    setZoom((current) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current + delta)))
  }

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

        <div
          ref={setFrame}
          className="relative mx-auto aspect-square w-full max-w-[min(100%,55vh)] overflow-hidden rounded-md bg-muted"
        >
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropSize={cropSize ?? undefined}
              cropShape="round"
              showGrid={false}
              objectFit="cover"
              minZoom={MIN_ZOOM}
              maxZoom={MAX_ZOOM}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={tAccount('crop-zoom-out')}
            disabled={zoom <= MIN_ZOOM}
            onClick={() => stepZoom(-ZOOM_STEP)}
          >
            <ZoomOut className="size-4" />
          </Button>
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
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={tAccount('crop-zoom-in')}
            disabled={zoom >= MAX_ZOOM}
            onClick={() => stepZoom(ZOOM_STEP)}
          >
            <ZoomIn className="size-4" />
          </Button>
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
