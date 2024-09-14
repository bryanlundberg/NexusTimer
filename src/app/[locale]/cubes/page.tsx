"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCubes } from "@/hooks/useCubes";
import EmptyCubes from "@/components/cubes/EmptyCubes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateTime } from "luxon";
import { useLocale, useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import DialogDeleteCollection from "@/components/dialogs/dialog-delete-collection/dialog-delete-collection";
import DrawerCreateCollection from "@/components/drawners/drawner-create-collection/drawner-create-collection";
import { useDialogCubesOptions } from "@/store/DialogCubesOptions";
import DialogEditCollection from "@/components/dialogs/dialog-edit-collection/dialog-edit-collection";
import { useState } from "react";
import {
  DotsHorizontalIcon,
  PlayIcon,
  PlusIcon,
  StopIcon,
} from "@radix-ui/react-icons";

export default function Page() {
  const [isOpenDrawerNewCollection, setIsOpenDrawerNewCollection] =
    useState(false);
  const { isOpen, type, openDialogType, closeDialog } = useDialogCubesOptions();
  const {
    filterCubes,
    handleSearchFilter,
    handleFavoriteClick,
    redirectToTimer,
  } = useCubes();
  const locale = useLocale();
  const t = useTranslations("Index");
  return (
    <>
      {/* container */}
      <div className="max-w-7xl mx-auto p-1 flex flex-col min-h-full w-full bg-background">
        {/* header */}
        <Card className="w-full mb-2 border p-3 border-none">
          <div className="flex gap-10 items-center justify-between">
            <h2 className="font-black text-xl">{t("CubesPage.title")}</h2>
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
                  <Button className="p-2">
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
        {filterCubes ? (
          <Card className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">
                    {t("CubesPage.favorite")}
                  </TableHead>
                  <TableHead>{t("CubesPage.name")}</TableHead>
                  <TableHead>{t("CubesPage.category")}</TableHead>
                  <TableHead className="hidden md:table-cell">
                    {t("CubesPage.created-at")}
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    {t("CubesPage.solves")}
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    {t("CubesPage.status")}
                  </TableHead>
                  <TableHead>{t("CubesPage.options")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterCubes.map((cube) => {
                  return (
                    <TableRow key={cube.id}>
                      <TableCell className="ps-5 hidden sm:table-cell">
                        <Checkbox
                          defaultChecked={cube.favorite}
                          onClick={(e) => {
                            handleFavoriteClick(cube.id);
                          }}
                        />
                      </TableCell>
                      <TableCell
                        onClick={() => redirectToTimer(cube.id)}
                        className="hover:cursor-pointer"
                      >
                        {cube.name}
                      </TableCell>
                      <TableCell
                        onClick={() => redirectToTimer(cube.id)}
                        className="hover:cursor-pointer"
                      >
                        {cube.category}
                      </TableCell>
                      <TableCell
                        onClick={() => redirectToTimer(cube.id)}
                        className="hover:cursor-pointer hidden md:table-cell"
                      >
                        {DateTime.fromMillis(cube.createdAt)
                          .setLocale(locale)
                          .toLocaleString()}
                      </TableCell>
                      <TableCell
                        onClick={() => redirectToTimer(cube.id)}
                        className="hover:cursor-pointer hidden md:table-cell"
                      >
                        {cube.solves.session.length}/{cube.solves.all.length}
                      </TableCell>
                      <TableCell
                        onClick={() => redirectToTimer(cube.id)}
                        className="hover:cursor-pointer hidden md:table-cell"
                      >
                        {cube.solves.session.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <PlayIcon />
                            {t("CubesPage.using")}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <StopIcon />
                            {t("CubesPage.idle")}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant={"ghost"}>
                              <DotsHorizontalIcon />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() =>
                                openDialogType({
                                  type: "edit",
                                  cube: cube,
                                })
                              }
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                openDialogType({
                                  type: "delete",
                                  cube: cube,
                                })
                              }
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <EmptyCubes onClick={() => {}} />
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
