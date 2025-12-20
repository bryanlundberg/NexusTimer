'use client'
import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import ButtonNextScramble from '@/features/navigation/ui/button-next-scramble'
import ButtonDisplayType from '@/features/navigation/ui/button-display-type'
import ButtonCreateCollection from '@/features/navigation/ui/button-create-collection'
import ButtonSelectMode from '@/features/navigation/ui/button-select-mode'
import MainCubeSelector from '@/features/select-cube/ui/MainCubeSelector'

export default function Navigation({
  children,
  showMenu = true,
  showMainCubeSelector = false,
  showButtonNextScramble = false,
  showButtonDisplayType = false,
  showButtonCreateCollection = false,
  showButtonSelectMode = false
}: {
  children?: ReactNode
  showMenu?: boolean
  showMainCubeSelector?: boolean
  showButtonNextScramble?: boolean
  showButtonDisplayType?: boolean
  showButtonCreateCollection?: boolean
  showButtonSelectMode?: boolean
}) {
  return (
    <>
      <motion.div
        className="w-full border mx-auto flex flex-col rounded-lg bg-card backdrop-blur-lg p-2 gap-2 mb-2"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {(showMenu ||
          showMainCubeSelector ||
          showButtonNextScramble ||
          showButtonDisplayType ||
          showButtonCreateCollection ||
          showButtonSelectMode) && (
          <div className="flex justify-center items-center gap-2">
            {showMenu && (
              <Button size={'icon'} variant={'ghost'}>
                <SidebarTrigger />
              </Button>
            )}
            {showMainCubeSelector && <MainCubeSelector />}
            {showButtonNextScramble && <ButtonNextScramble />}
            {showButtonDisplayType && <ButtonDisplayType />}
            {showButtonCreateCollection && <ButtonCreateCollection />}
            {showButtonSelectMode && <ButtonSelectMode />}
          </div>
        )}
        {children}
      </motion.div>
    </>
  )
}
