import { US, ES, FR, DE, JP, CN, RU, IN, PT, KR, UA, IT, PL, ID, VN, TH, PH } from 'country-flag-icons/string/3x2'
import { locales } from '@/shared/config/i18n/locales'

interface LanguageProp {
  code: (typeof locales)[number]
  name: string
  flag: React.ReactNode
}

const flag = (svg: string) => <img src={`data:image/svg+xml,${encodeURIComponent(svg)}`} alt="" className="w-4 h-4" />

export const languages: LanguageProp[] = [
  { code: 'en', name: 'English', flag: flag(US) },
  { code: 'es', name: 'Español', flag: flag(ES) },
  { code: 'fr', name: 'Français', flag: flag(FR) },
  { code: 'de', name: 'Deutsch', flag: flag(DE) },
  { code: 'ja', name: '日本語', flag: flag(JP) },
  { code: 'zh', name: '中文', flag: flag(CN) },
  { code: 'ru', name: 'Русский', flag: flag(RU) },
  { code: 'hi', name: 'हिन्दी', flag: flag(IN) },
  { code: 'pt', name: 'Português', flag: flag(PT) },
  { code: 'ko', name: '한국어', flag: flag(KR) },
  { code: 'uk', name: 'Українська', flag: flag(UA) },
  { code: 'it', name: 'Italiano', flag: flag(IT) },
  { code: 'pl', name: 'Polski', flag: flag(PL) },
  { code: 'id', name: 'Bahasa Indonesia', flag: flag(ID) },
  { code: 'vi', name: 'Tiếng Việt', flag: flag(VN) },
  { code: 'th', name: 'ไทย', flag: flag(TH) },
  { code: 'fil', name: 'Filipino', flag: flag(PH) }
]
