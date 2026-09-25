'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { languages } from '@/shared/const/languages'
import { useSwitchLocale } from '@/shared/config/i18n/useSwitchLocale'

export default function SelectLanguage() {
  const { locale, switchLocale, isPending } = useSwitchLocale()
  return (
    <Select value={locale} onValueChange={switchLocale} disabled={isPending}>
      <SelectTrigger className="w-[140px] sm:w-[180px] shrink-0 bg-background">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((item) => {
          return (
            <SelectItem value={item.code} key={item.code}>
              {item.flag}
              {item.name}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
