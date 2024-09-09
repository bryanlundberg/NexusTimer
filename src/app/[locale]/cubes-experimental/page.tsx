"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/24/solid";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { useLocale } from "next-intl";

export default function Page() {
  const { filterCubes, handleSearchFilter } = useCubes();
  const locale = useLocale();
  return (
    <>
      {/* container */}
      <div className="max-w-5xl mx-auto p-3 w-full">
        {/* header */}
        <Card className="w-full mb-3 border p-3">
          <div className="flex gap-3 items-center justify-between">
            <h2 className="font-black text-xl">Cubes</h2>
            <div className="flex items-center justify-end gap-3 w-full">
              <Input
                placeholder="Search your cube"
                onChange={(e) => handleSearchFilter(e.target.value)}
                className="max-w-[300px] w-full"
              />
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="p-2">
                      <PlusIcon className="size-5" strokeWidth={5} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create collection</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </Card>

        {/* cubes list */}
        {filterCubes ? (
          <Card>
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead>Fav</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Solves</TableHead>
                  <TableHead>Options</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterCubes.map((cube) => {
                  return (
                    <TableRow key={cube.id}>
                      <TableCell>P</TableCell>
                      <TableCell>{cube.name}</TableCell>
                      <TableCell>{cube.category}</TableCell>
                      <TableCell>
                        {DateTime.fromMillis(cube.createdAt)
                          .setLocale(locale)
                          .toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {cube.solves.session.length}/{cube.solves.all.length}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant={"ghost"}>
                              <EllipsisHorizontalIcon className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
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
      </div>
    </>
  );
}
