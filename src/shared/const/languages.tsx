import {
  US,
  ES,
  FR,
  DE,
  JP,
  CN,
  RU,
  IN,
  PT,
  IT,
  KR,
  NL,
  SE,
  TR,
  PL,
  VN,
  FI,
  UA,
  CZ,
  RO,
  NO,
  MY,
  HU,
  ID,
  BD,
  SK,
  EE,
  PH,
  DK,
  SA
} from 'country-flag-icons/react/3x2'
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
  { code: 'it', name: 'Italiano', flag: <IT className="w-4 h-4" /> },
  { code: 'ko', name: '한국어', flag: <KR className="w-4 h-4" /> },
  { code: 'nl', name: 'Nederlands', flag: <NL className="w-4 h-4" /> },
  { code: 'sv', name: 'Svenska', flag: <SE className="w-4 h-4" /> },
  { code: 'tr', name: 'Türkçe', flag: <TR className="w-4 h-4" /> },
  { code: 'pl', name: 'Polski', flag: <PL className="w-4 h-4" /> },
  { code: 'vi', name: 'Tiếng Việt', flag: <VN className="w-4 h-4" /> },
  { code: 'fi', name: 'Suomi', flag: <FI className="w-4 h-4" /> },
  { code: 'uk', name: 'Українська', flag: <UA className="w-4 h-4" /> },
  { code: 'cs', name: 'Čeština', flag: <CZ className="w-4 h-4" /> },
  { code: 'ro', name: 'Română', flag: <RO className="w-4 h-4" /> },
  { code: 'no', name: 'Norsk', flag: <NO className="w-4 h-4" /> },
  { code: 'ms', name: 'Bahasa Melayu', flag: <MY className="w-4 h-4" /> },
  { code: 'hu', name: 'Magyar', flag: <HU className="w-4 h-4" /> },
  { code: 'id', name: 'Bahasa Indonesia', flag: <ID className="w-4 h-4" /> },
  { code: 'bn', name: 'বাংলা', flag: <BD className="w-4 h-4" /> },
  { code: 'sk', name: 'Slovenčina', flag: <SK className="w-4 h-4" /> },
  { code: 'et', name: 'Eesti', flag: <EE className="w-4 h-4" /> },
  { code: 'mr', name: 'मराठी', flag: <IN className="w-4 h-4" /> },
  { code: 'tl', name: 'Filipino', flag: <PH className="w-4 h-4" /> },
  { code: 'da', name: 'Dansk', flag: <DK className="w-4 h-4" /> },
  { code: 'ar', name: 'العربية', flag: <SA className="w-4 h-4" /> }
]
