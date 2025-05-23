"use client";
import { Dialog } from "@/components/ui/dialog";
import { useCubes } from "@/hooks/useCubes";
import DialogDeleteCollection from "@/components/dialogs/dialog-delete-collection/dialog-delete-collection";
import { useDialogCubesOptions } from "@/store/DialogCubesOptions";
import DialogEditCollection from "@/components/dialogs/dialog-edit-collection/dialog-edit-collection";
import CubesCards from "@/components/cubes/cubes-cards";
import useErrorDialog from "@/hooks/useErrorDialog";
import Navigation from "@/components/navigation/navigation";
import EmptyCubes from "@/components/cubes/EmptyCubes";

export default function Page() {
  const { handleResetError, error, handleChangeError } = useErrorDialog();
  const { isOpen, type, closeDialog } = useDialogCubesOptions();
  const { filterCubes, handleFavoriteClick, handleRedirectToTimer } = useCubes();

  return (
    <>
      <div className="overflow-y-auto pb-4">
        {/* container */}
        <div className="max-w-7xl mx-auto px-2 pt-2 flex flex-col w-full min-h-full">
          {/* header */}
          <Navigation />

          {/* cubes list */}
          {filterCubes && filterCubes.length > 0 ? (
            <CubesCards
              handleFavoriteClick={handleFavoriteClick}
              handleRedirectToTimer={handleRedirectToTimer}
              cubes={filterCubes}
            />
          ) : (
            <EmptyCubes />
          )}

          {/* dialogs */}
          <Dialog
            open={type === "delete" && isOpen}
            onOpenChange={() => {
              handleResetError();
              closeDialog();
            }}
          >
            <DialogDeleteCollection
              error={error}
              handleChangeError={handleChangeError}
            />
          </Dialog>
          <Dialog
            open={type === "edit" && isOpen}
            onOpenChange={() => {
              handleResetError();
              closeDialog();
            }}
          >
            <DialogEditCollection
              error={error}
              handleChangeError={handleChangeError}
            />
          </Dialog>
        </div>
      </div>
    </>
  );
}
