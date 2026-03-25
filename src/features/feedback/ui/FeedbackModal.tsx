'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'

const RATING_EMOJIS = [
  { value: 1, emoji: '😞', labelKey: 'rating-1' },
  { value: 2, emoji: '😕', labelKey: 'rating-2' },
  { value: 3, emoji: '😐', labelKey: 'rating-3' },
  { value: 4, emoji: '😊', labelKey: 'rating-4' },
  { value: 5, emoji: '🤩', labelKey: 'rating-5' }
] as const

export default function FeedbackModal() {
  const { data: session } = useSession()
  const { close } = useOverlayStore()
  const t = useTranslations('Index.Feedback')
  const [rating, setRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!rating || !session?.user?.id) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/v1/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment })
      })

      if (res.ok) {
        setSubmitted(true)
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center gap-4 py-8">
          <span className="text-5xl">🎉</span>
          <DialogTitle>{t('thanks')}</DialogTitle>
          <Button onClick={close} variant="outline">
            {t('close')}
          </Button>
        </div>
      </DialogContent>
    )
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{t('title')}</DialogTitle>
        <DialogDescription>{t('description')}</DialogDescription>
      </DialogHeader>

      <div className="flex justify-center gap-2 py-4">
        {RATING_EMOJIS.map(({ value, emoji, labelKey }) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all cursor-pointer ${
              rating === value ? 'bg-accent scale-110 ring-2 ring-primary' : 'hover:bg-accent/50'
            }`}
          >
            <span className="text-3xl">{emoji}</span>
            <span className="text-xs text-muted-foreground">{t(labelKey)}</span>
          </button>
        ))}
      </div>

      <Textarea
        placeholder={t('placeholder')}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        className="resize-none"
      />

      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={close}>
          {t('cancel')}
        </Button>
        <Button onClick={handleSubmit} disabled={!rating || isSubmitting}>
          {isSubmitting ? t('sending') : t('submit')}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
