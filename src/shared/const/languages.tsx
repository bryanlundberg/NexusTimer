import { US, ES, FR, DE, JP, CN, RU, IN, PT, KR } from 'country-flag-icons/react/3x2'
import { locales } from '@/shared/config/i18n/locales'

interface LanguageProp {
  code: (typeof locales)[number]
  name: string
  flag: React.ReactNode
}

export const languages: LanguageProp[] = [
  { code: 'en', name: 'English', flag: <US className="w-4 h-4" /> },
  { code: 'es', name: 'Español', flag: <ES className="w-4 h-4" /> },
  { code: 'fr', name: 'Français', flag: <FR className="w-4 h-4" /> },
  { code: 'de', name: 'Deutsch', flag: <DE className="w-4 h-4" /> },
  { code: 'ja', name: '日本語', flag: <JP className="w-4 h-4" /> },
  { code: 'zh', name: '中文', flag: <CN className="w-4 h-4" /> },
  { code: 'ru', name: 'Русский', flag: <RU className="w-4 h-4" /> },
  { code: 'hi', name: 'हिन्दी', flag: <IN className="w-4 h-4" /> },
  { code: 'pt', name: 'Português', flag: <PT className="w-4 h-4" /> },
  { code: 'ko', name: '한국어', flag: <KR className="w-4 h-4" /> }
]
