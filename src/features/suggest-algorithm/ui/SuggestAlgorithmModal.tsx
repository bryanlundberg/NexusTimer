'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CategoryBadge } from '@/shared/ui/category-badge/CategoryBadge'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { toast } from 'sonner'
import type { SuggestMethodOption } from '../model/types'

type Props = {
  methods: SuggestMethodOption[]
  initialSlug?: string
}

export default function SuggestAlgorithmModal({ methods, initialSlug }: Props) {
  const { close } = useOverlayStore()
  const t = useTranslations('Index.AlgorithmsPage.suggest')
  const [methodSlug, setMethodSlug] = useState(initialSlug ?? '')
  const [caseName, setCaseName] = useState('')
  const [algorithm, setAlgorithm] = useState('')
  const [comment, setComment] = useState('')
  const [website, setWebsite] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const selectedMethod = methods.find((m) => m.slug === methodSlug)
  const showMethodSelect = methods.length > 1

  const handleSubmit = async () => {
    if (!methodSlug || !caseName || !algorithm.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/v1/algorithms/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ methodSlug, caseName, algorithm, comment: comment || undefined, website })
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        toast.error(t('error'))
      }
    } catch {
      toast.error(t('error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <DialogTitle>{t('success-title')}</DialogTitle>
          <DialogDescription>{t('success-description')}</DialogDescription>
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
        <DialogTitle>
          {selectedMethod && !showMethodSelect ? `${t('title')} - ${selectedMethod.title}` : t('title')}
        </DialogTitle>
        <DialogDescription>{t('description')}</DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        {showMethodSelect && (
          <div className="flex flex-col gap-2">
            <Label>{t('method')}</Label>
            <Select
              value={methodSlug}
              onValueChange={(value) => {
                setMethodSlug(value)
                setCaseName('')
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('method-placeholder')} />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {methods.map((m) => (
                  <SelectItem key={m.slug} value={m.slug}>
                    <span className="flex items-center gap-2">
                      {m.title}
                      <CategoryBadge category={m.puzzle} className="text-[11px] font-medium" />
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label>{t('case')}</Label>
          <Select value={caseName} onValueChange={setCaseName} disabled={!selectedMethod}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('case-placeholder')} />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {Array.from(new Set(selectedMethod?.caseNames ?? [])).map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="suggested-algorithm">{t('algorithm')}</Label>
          <Input
            id="suggested-algorithm"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            placeholder="R U R' U' ..."
            className="font-mono"
            maxLength={300}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="suggestion-comment">{t('comment')}</Label>
          <Textarea
            id="suggestion-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('comment-placeholder')}
            rows={3}
            className="resize-none"
            maxLength={1000}
          />
        </div>

        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
      </div>

      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={close}>
          {t('cancel')}
        </Button>
        <Button onClick={handleSubmit} disabled={!methodSlug || !caseName || !algorithm.trim() || isSubmitting}>
          {isSubmitting ? t('sending') : t('submit')}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
