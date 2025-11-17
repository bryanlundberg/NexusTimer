import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { languages } from '@/lib/const/languages'
import { syncTranslations } from '@/shared/lib/language'
import { useLocale } from 'next-intl'

export default function SelectLanguage() {
  const locale = useLocale()
  return (
    <Select defaultValue={locale} onValueChange={syncTranslations}>
      <SelectTrigger className="w-[180px] bg-background">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((item) => {
          return (
            <SelectItem value={item.code} key={item.code}>
              {item.name}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
