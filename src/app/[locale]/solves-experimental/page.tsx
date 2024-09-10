"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BarsArrowDownIcon,
  ChevronDoubleDownIcon,
  Cog6ToothIcon,
  EllipsisHorizontalIcon,
  LockClosedIcon,
  LockOpenIcon,
  PlayIcon,
  PlusIcon,
  StopIcon,
} from "@heroicons/react/24/solid";
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
import MainCubeSelector from "@/components/MainCubeSelector";
import { Toggle } from "@/components/ui/toggle";
import { SolvesArea } from "@/components/solves/SolvesArea";
import { FAKE_SESSION } from "@/FAKE_SESSION";

export default function Page() {
  const { isOpen, type, openDialogType, closeDialog } = useDialogCubesOptions();
  const locale = useLocale();
  const t = useTranslations("Index");
  return (
    <>
      {/* container */}
      <div className="max-w-5xl mx-auto p-2 flex flex-col min-h-full w-full bg-background">
        {/* header */}
        <Card className="w-full mb-2 border p-3 flex items-center gap-2">
          <h2 className="font-black text-xl">Solves</h2>

          <div className="flex items-center gap-2 w-full justify-end">
            <MainCubeSelector />
            <Toggle
              variant="outline"
              aria-label="Toggle session"
              className="flex items-center justify-center gap-1"
            >
              <LockClosedIcon className="h-4 w-4" />
              <span className="hidden sm:block">Session</span>
            </Toggle>
            <Toggle
              variant="outline"
              aria-label="Toggle session"
              className="flex items-center justify-center gap-1"
            >
              <BarsArrowDownIcon className="h-4 w-4" />
              <span className="hidden sm:block">Options</span>
            </Toggle>
          </div>
        </Card>

        <SolvesArea displaySolves={FAKE_SESSION} currentTab={"Session"} />
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
