import { useTranslations } from 'next-intl'
import ScrollableUnderlineTabs from '@/shared/ui/animated-tabs/ScrollableUnderlineTabs'
import { BUILDER_TABS, type BuilderTab } from '../model/nexiOptions'

interface BuilderTabsProps {
  activeTab: BuilderTab
}

export function BuilderTabs({ activeTab }: BuilderTabsProps) {
  const t = useTranslations('Index.AvatarBuilder')
  const items = BUILDER_TABS.map((tab) => ({ value: tab, label: t(`tabs.${tab}`) }))

  return <ScrollableUnderlineTabs items={items} activeValue={activeTab} layoutId="avatar-builder-tab-indicator" />
}
