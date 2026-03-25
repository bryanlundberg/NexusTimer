'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'

const RATING_EMOJIS = [
  { value: 1, emoji: '😞', label: 'Terrible' },
  { value: 2, emoji: '😕', label: 'Bad' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 5, emoji: '🤩', label: 'Amazing' }
]

export default function FeedbackModal() {
  const { data: session } = useSession()
  const { close } = useOverlayStore()
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
          <DialogTitle>Thanks for your feedback!</DialogTitle>
          <Button onClick={close} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    )
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Give Feedback</DialogTitle>
        <DialogDescription>How is your experience with NexusTimer?</DialogDescription>
      </DialogHeader>

      <div className="flex justify-center gap-2 py-4">
        {RATING_EMOJIS.map(({ value, emoji, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all cursor-pointer ${
              rating === value ? 'bg-accent scale-110 ring-2 ring-primary' : 'hover:bg-accent/50'
            }`}
          >
            <span className="text-3xl">{emoji}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </button>
        ))}
      </div>

      <Textarea
        placeholder="Tell us more about your experience... (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        className="resize-none"
      />

      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={close}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!rating || isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Submit'}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
