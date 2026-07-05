import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface EmptyTabContentProps {
  message?: string
}

export default function EmptyTabContent({ message }: EmptyTabContentProps) {
  const t = useTranslations('Index.PeoplePage')
  return (
    <div className="relative flex flex-col items-center justify-center h-96 overflow-hidden">
      <Image
        src="/bg.webp"
        alt="Background Image"
        className="absolute inset-0 object-cover w-full h-full opacity-30 dark:opacity-10"
        width={1920}
        height={1080}
        draggable={false}
        quality={50}
        style={{
          zIndex: 0,
          maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 100%)'
        }}
      ></Image>
      <div className="relative scroll-m-20 text-xl tracking-tight max-w-prose md:max-w-xl mx-auto text-center px-4">
        {message ?? t('no-backup-data')}
      </div>
    </div>
  )
}
