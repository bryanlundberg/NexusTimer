import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateTime } from "luxon";
import { useLocale, useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { DotsHorizontalIcon, PlayIcon, StopIcon } from "@radix-ui/react-icons";
import { Card } from "../ui/card";
import { useDialogCubesOptions } from "@/store/DialogCubesOptions";
import { Cube } from "@/interfaces/Cube";
import { Button } from "../ui/button";

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
  const { openDialogType } = useDialogCubesOptions();
  return (
    <>
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
            {cubes.map((cube) => {
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
                    onClick={() => handleRedirectToTimer(cube.id)}
                    className="hover:cursor-pointer"
                  >
                    {cube.name}
                  </TableCell>
                  <TableCell
                    onClick={() => handleRedirectToTimer(cube.id)}
                    className="hover:cursor-pointer"
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
                    className="hover:cursor-pointer hidden md:table-cell"
                  >
                    {cube.solves.session.length}/{cube.solves.all.length}
                  </TableCell>
                  <TableCell
                    onClick={() => handleRedirectToTimer(cube.id)}
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
    </>
  );
}
