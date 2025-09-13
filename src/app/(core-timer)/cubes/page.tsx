'use client';
import { Dialog } from '@/components/ui/dialog';
import { useCubes } from '@/hooks/useCubes';
import DialogDeleteCollection from '@/components/dialogs/dialog-delete-collection/dialog-delete-collection';
import { useDialogCubesOptions } from '@/store/DialogCubesOptions';
import DialogEditCollection from '@/components/dialogs/dialog-edit-collection/dialog-edit-collection';
import CubesCards from '@/components/cubes/cubes-cards';
import Navigation from '@/components/navigation/navigation';
import EmptyCubes from '@/components/cubes/EmptyCubes';
import FadeIn from '@/components/fade-in/fade-in';
import { useTimerStore } from '@/store/timerStore';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Page() {
  const { isOpen, type, closeDialog } = useDialogCubesOptions();
  const { handleFavoriteClick, handleRedirectToTimer } = useCubes();
  const cubes = useTimerStore(store => store.cubes)

  return (
    <ScrollArea className={'max-h-dvh overflow-auto'}>
      <FadeIn>
        <div className=" px-2 pt-2 flex flex-col w-full min-h-full">
          <Navigation showButtonCreateCollection showMainCubeSelector/>

          {cubes?.length ? (
            <CubesCards
              handleFavoriteClick={handleFavoriteClick}
              handleRedirectToTimer={handleRedirectToTimer}
              cubes={cubes}
            />
          ) : (
            <EmptyCubes/>
          )}

          <Dialog
            open={type === 'delete' && isOpen}
            onOpenChange={closeDialog}
          >
            <DialogDeleteCollection/>
          </Dialog>
          <Dialog
            open={type === 'edit' && isOpen}
            onOpenChange={closeDialog}
          >
            <DialogEditCollection/>
          </Dialog>
        </div>
      </FadeIn>
    </ScrollArea>
  );
}
