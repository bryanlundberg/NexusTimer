'use client';
import MainCubeSelector from '@/components/MainCubeSelector';
import ButtonDisplayType from './buttons/button-display-type';
import ButtonCreateCollection from './buttons/button-create-collection';
import ButtonNextScramble from './buttons/button-next-scramble';
import ButtonSelectMode from './buttons/button-select-mode';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export default function Navigation({
  children,
  showMenu = true,
  showMainCubeSelector = false,
  showButtonNextScramble = false,
  showButtonDisplayType = false,
  showButtonCreateCollection = false,
  showButtonSelectMode = false
}: {
  children?: ReactNode;
  showMenu?: boolean;
  showMainCubeSelector?: boolean;
  showButtonNextScramble?: boolean;
  showButtonDisplayType?: boolean;
  showButtonCreateCollection?: boolean;
  showButtonSelectMode?: boolean;

}) {
  return (
    <>
      <motion.div
        className="w-full border mx-auto flex flex-col rounded-lg bg-card backdrop-blur-lg p-2 gap-2 mb-2 sticky top-1 left-0 z-50"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {(showMenu || showMainCubeSelector || showButtonNextScramble || showButtonDisplayType || showButtonCreateCollection || showButtonSelectMode) && (
          <div className="flex justify-center items-center gap-2">
            {showMenu && (
              <Button size={"icon"} variant={"ghost"} asChild>
                <SidebarTrigger className="-ml-1"/>
              </Button>
            )}
            {showMainCubeSelector && <MainCubeSelector/>}
            {showButtonNextScramble && <ButtonNextScramble/>}
            {showButtonDisplayType && <ButtonDisplayType/>}
            {showButtonCreateCollection && <ButtonCreateCollection/>}
            {showButtonSelectMode && <ButtonSelectMode/>}
          </div>
        )}
        {children}
      </motion.div>
    </>
  );
}
