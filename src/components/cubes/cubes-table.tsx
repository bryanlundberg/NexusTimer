import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DateTime } from "luxon";
import { useLocale, useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { GearIcon, PlayIcon, StopIcon, TrashIcon } from "@radix-ui/react-icons";
import { Card } from "../ui/card";
import { useDialogCubesOptions } from "@/store/DialogCubesOptions";
import { Cube } from "@/interfaces/Cube";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CubesTableProps {
  handleRedirectToTimer: (cubeId: string) => void;
  handleFavoriteClick: (cubeId: string) => void;
  cubes: Cube[];
}

export default function CubesTable({
  handleRedirectToTimer,
  handleFavoriteClick,
  cubes,
}: CubesTableProps) {
  const locale = useLocale();
  const t = useTranslations("Index");
  const { isOpen, type, closeDialog, openDialogType } = useDialogCubesOptions();

  return (
    <>
      <Card
        data-testid="table-of-cubes"
        className="bg-background/90 backdrop-blur-lg"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">{t("CubesPage.favorite")}</TableHead>
              <TableHead className="w-full md:w-auto">
                {t("CubesPage.name")}
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                {t("CubesPage.category")}
              </TableHead>
              <TableHead className="hidden md:table-cell">
                {t("CubesPage.created-at")}
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                {t("CubesPage.solves")}
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                {t("CubesPage.status")}
              </TableHead>
              <TableHead className="flex justify-end w-fit ms-auto"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cubes.map((cube) => {
              return (
                <TableRow key={cube.id}>
                  <TableCell className="ps-5">
                    <Checkbox
                      defaultChecked={cube.favorite}
                      onClick={(e) => {
                        handleFavoriteClick(cube.id);
                      }}
                    />
                  </TableCell>
                  <TableCell
                    onClick={() => handleRedirectToTimer(cube.id)}
                    className="hover:cursor-pointer text-ellipsis overflow-hidden truncate max-w-20 sm:max-w-32 md:max-w-40 lg:max-w-96"
                    data-testid={"cube-name-" + cube.name}
                  >
                    {cube.name}
                  </TableCell>
                  <TableCell
                    onClick={() => handleRedirectToTimer(cube.id)}
                    className="hover:cursor-pointer hidden sm:table-cell"
                  >
                    {cube.category}
                  </TableCell>
                  <TableCell
                    onClick={() => handleRedirectToTimer(cube.id)}
                    className="hover:cursor-pointer hidden md:table-cell"
                  >
                    {DateTime.fromMillis(cube.createdAt)
                      .setLocale(locale)
                      .toLocaleString()}
                  </TableCell>
                  <TableCell
                    onClick={() => handleRedirectToTimer(cube.id)}
                    className="hover:cursor-pointer hidden sm:table-cell"
                  >
                    {cube.solves.session.length}/{cube.solves.all.length}
                  </TableCell>
                  <TableCell
                    onClick={() => handleRedirectToTimer(cube.id)}
                    className="hover:cursor-pointer hidden sm:table-cell"
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
                  <TableCell className="flex justify-end w-fit ms-auto">
                    <Dialog
                      open={type === "edit" && isOpen}
                      onOpenChange={closeDialog}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              className="py-0 px-3"
                              variant={"ghost"}
                              data-testid="cube-options-edit"
                              onClick={() => {
                                openDialogType({
                                  type: "edit",
                                  cube: cube,
                                });
                              }}
                            >
                              <GearIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit `{cube.name}`</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Dialog>
                    <Dialog
                      open={type === "delete" && isOpen}
                      onOpenChange={closeDialog}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              className="py-0 px-3"
                              variant={"ghost"}
                              data-testid="cube-options-delete"
                              onClick={() => {
                                openDialogType({
                                  type: "delete",
                                  cube: cube,
                                });
                              }}
                            >
                              <TrashIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete `{cube.name}`</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Dialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
