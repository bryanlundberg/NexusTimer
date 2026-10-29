import { Link } from '@/shared/config/i18n/navigation'
import { BrandMark } from '@/widgets/sidebar/ui/brand-mark'

export default function BrandLink() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <BrandMark />
      <span className="font-brand text-base font-bold leading-tight tracking-tight text-foreground">NEXUSTIMER</span>
    </Link>
  )
}
