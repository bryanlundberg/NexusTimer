"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { useCubes } from "@/hooks/useCubes";
import EmptyCubes from "@/components/cubes/EmptyCubes";
import { useLocale, useTranslations } from "next-intl";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import DialogDeleteCollection from "@/components/dialogs/dialog-delete-collection/dialog-delete-collection";
import DrawerCreateCollection from "@/components/drawners/drawner-create-collection/drawner-create-collection";
import { useDialogCubesOptions } from "@/store/DialogCubesOptions";
import DialogEditCollection from "@/components/dialogs/dialog-edit-collection/dialog-edit-collection";
import { useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import CubesTable from "@/components/cubes/cubes-table";

export default function Page() {
  const [isOpenDrawerNewCollection, setIsOpenDrawerNewCollection] =
    useState(false);
  const { isOpen, type, closeDialog } = useDialogCubesOptions();
  const {
    filterCubes,
    handleSearchFilter,
    handleFavoriteClick,
    handleRedirectToTimer,
  } = useCubes();

  const t = useTranslations("Index");
  return (
    <>
      {/* container */}
      <div className="max-w-7xl mx-auto p-1 flex flex-col min-h-full w-full bg-background">
        {/* header */}
        <Card className="w-full mb-2 border p-3 border-none">
          <div className="flex gap-10 items-center justify-between">
            <h2 className="font-black text-xl" data-testid="page-title-cubes">
              {t("CubesPage.title")}
            </h2>
            <div className="flex items-center justify-end gap-3 w-full">
              <Input
                placeholder={t("CubesPage.find-your-cube")}
                onChange={(e) => handleSearchFilter(e.target.value)}
                className="max-w-[300px] w-full bg-background"
                autoComplete="false"
              />
              <Drawer
                open={isOpenDrawerNewCollection}
                onOpenChange={setIsOpenDrawerNewCollection}
              >
                <DrawerTrigger asChild>
                  <Button
                    className="p-2"
                    data-testid="create-collection-button"
                  >
                    <PlusIcon className="size-4" strokeWidth={5} />{" "}
                    <span className="hidden sm:inline">
                      {t("CubesPage.new-collection")}
                    </span>
                  </Button>
                </DrawerTrigger>
                <DrawerCreateCollection
                  closeDrawer={() => setIsOpenDrawerNewCollection(false)}
                />
              </Drawer>
            </div>
          </div>
        </Card>

        {/* cubes list */}
        {filterCubes && filterCubes.length > 0 ? (
          <CubesTable
            handleFavoriteClick={handleFavoriteClick}
            handleRedirectToTimer={handleRedirectToTimer}
            cubes={filterCubes}
          />
        ) : (
          <EmptyCubes onClick={() => setIsOpenDrawerNewCollection(true)} />
        )}

        {/* dialogs */}
        <Dialog open={type === "delete" && isOpen} onOpenChange={closeDialog}>
          <DialogDeleteCollection />
        </Dialog>
        <Dialog open={type === "edit" && isOpen} onOpenChange={closeDialog}>
          <DialogEditCollection />
        </Dialog>
      </div>
    </>
  );
}
