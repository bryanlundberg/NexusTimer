'use client'

import { useTranslations } from 'next-intl'
import { Loader2, Shuffle } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Link, useRouter } from '@/shared/config/i18n/navigation'
import { PageHeader } from '@/shared/ui/page-header/PageHeader'
import { BUILDER_TABS, type BuilderTab } from '../model/nexiOptions'
import { useAvatarBuilder } from '../model/useAvatarBuilder'
import { useSaveAvatar } from '../model/useSaveAvatar'
import { AvatarPreview } from './AvatarPreview'
import { BuilderTabPanel } from './BuilderTabPanel'
import { BuilderTabs } from './BuilderTabs'
import { RemoveButtons } from './RemoveButtons'

const isBuilderTab = (value: string): value is BuilderTab => (BUILDER_TABS as readonly string[]).includes(value)

export function AvatarBuilder() {
  const t = useTranslations('Index.AvatarBuilder')
  const router = useRouter()
  const { recipe, tab, setTab, change, remove, randomize } = useAvatarBuilder()
  const { save, isSaving } = useSaveAvatar()

  const handleSave = async () => {
    if (await save(recipe)) router.push('/account')
  }

  return (
    <>
      <PageHeader
        title={t('title')}
        description={t('description')}
        actions={
          <>
            <Link
              href="/account"
              aria-disabled={isSaving}
              className={buttonVariants({
                variant: 'ghost',
                className: isSaving ? 'pointer-events-none opacity-50' : ''
              })}
            >
              {t('cancel')}
            </Link>
            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              {isSaving && <Loader2 className="size-4 animate-spin" />}
              {t('save')}
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <aside className="flex shrink-0 flex-col items-center gap-3 lg:sticky lg:top-4 lg:w-64 lg:items-start">
          <AvatarPreview recipe={recipe} />
          <Button type="button" variant="outline" size="sm" className="gap-2" onClick={randomize}>
            <Shuffle className="size-3.5" />
            {t('random')}
          </Button>
          <RemoveButtons recipe={recipe} onRemove={remove} />
        </aside>

        <Tabs
          value={tab}
          onValueChange={(value) => isBuilderTab(value) && setTab(value)}
          className="min-w-0 flex-1 gap-4"
        >
          <BuilderTabs activeTab={tab} />
          <TabsContent value={tab}>
            <BuilderTabPanel tab={tab} recipe={recipe} onChange={change} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
