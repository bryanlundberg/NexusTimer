import { motion } from 'motion/react'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface InspectionToggleButtonProps {
  enabled: boolean
  onToggle: () => void
}

export default function InspectionToggleButton({ enabled, onToggle }: InspectionToggleButtonProps) {
  const t = useTranslations('Multiplayer')

  return (
    <motion.div
      className="absolute top-3 left-3 md:top-4 md:left-4"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={enabled ? 'default' : 'ghost'} size="icon" className="size-9 rounded-lg" onClick={onToggle}>
            {enabled ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">{enabled ? t('inspection-on') : t('inspection-off')}</TooltipContent>
      </Tooltip>
    </motion.div>
  )
}
