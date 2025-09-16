"use client";

import React, { useMemo } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Cube } from "@/interfaces/Cube";
import { Categories } from "@/interfaces/Categories";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from '@/components/ui/scroll-area';

const categories: Categories[] = [
  "2x2",
  "3x3",
  "3x3 OH",
  "4x4",
  "5x5",
  "6x6",
  "7x7",
  "SQ1",
  "Skewb",
  "Pyraminx",
  "Megaminx",
  "Clock",
];

export type ImportReviewValues = {
  cubes: Array<{
    cubeId: string;
    name: string;
    category: Categories;
  }>;
};

export default function DialogImportReview({
  open,
  cubes,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  cubes: Cube[];
  onCancel: () => void;
  onConfirm: (editedCubes: Cube[]) => void;
}) {
  const defaultValues: ImportReviewValues = useMemo(
    () => ({
      cubes: cubes.map((c) => ({ cubeId: c.id, name: c.name, category: c.category })),
    }),
    [cubes]
  );

  const { control, handleSubmit } = useForm<ImportReviewValues>({ defaultValues });
  const { fields, remove } = useFieldArray({ control, name: "cubes" });

  const totalSolvesById = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of cubes) {
      const total = (c.solves?.session?.length || 0) + (c.solves?.all?.length || 0);
      map.set(c.id, total);
    }
    return map;
  }, [cubes]);

  const onSubmit = (values: ImportReviewValues) => {
    // Map back edited fields to original cubes and filter removed ones
    const idsToKeep = new Set(values.cubes.map((c) => c.cubeId));
    const edited = cubes
      .filter((c) => idsToKeep.has(c.id))
      .map((c) => {
        const v = values.cubes.find((x) => x.cubeId === c.id)!;
        return { ...c, name: v.name, category: v.category } as Cube;
      });
    onConfirm(edited);
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Review Imported Data</DialogTitle>
          <DialogDescription>
            Verify and edit the information before completing the import. You can remove rows you do not want to import.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <form id="import-review-form" onSubmit={handleSubmit(onSubmit)}>
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-background z-10">
                <tr className="text-left border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Solves</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {fields.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-muted-foreground">
                      No items to import.
                    </td>
                  </tr>
                )}
                {fields.map((field, index) => (
                  <tr key={field.id} className="border-b">
                    <td className="p-2">
                      <Controller
                        control={control}
                        name={`cubes.${index}.name`}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Name"
                            className={"w-full"}
                          />
                        )}
                      />
                    </td>
                    <td className="p-2">
                      <Controller
                        control={control}
                        name={`cubes.${index}.category`}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </td>
                    <td className="p-2 align-middle">
                      {/* Read-only total solves count */}
                      <span className="text-muted-foreground">
                        {totalSolvesById.get(field.cubeId) ?? 0}
                      </span>
                    </td>
                    <td className="p-2">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => remove(index)}
                        className="inline-flex items-center gap-1"
                        title="Eliminar fila"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </form>
        </ScrollArea>

        <DialogFooter>
          <div className="ml-auto flex gap-2">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" form="import-review-form">
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
