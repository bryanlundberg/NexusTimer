import React, { useEffect, useMemo } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CUBE_CATEGORIES, CubeCategory } from '@/shared/const/cube-categories'
import { Cube } from '@/entities/cube/model/types'

export type ImportReviewValues = {
  cubes: Array<{
    cubeId: string
    name: string
    category: CubeCategory
  }>
}

const normalizeName = (s: string) => (s || '').trim().toLowerCase()
const getDuplicateIndices = (names: string[]) => {
  const counts = new Map<string, number>()
  names.forEach((n) => counts.set(n, (counts.get(n) || 0) + 1))
  const dups = new Set<number>()
  names.forEach((n, i) => {
    if (n && (counts.get(n) || 0) > 1) dups.add(i)
  })
  return dups
}

export default function ImportReview({
  cubes,
  onCancel,
  onConfirm
}: {
  cubes: Cube[]
  onCancel: () => void
  onConfirm: (editedCubes: Cube[]) => void
}) {
  const defaultValues: ImportReviewValues = useMemo(
    () => ({ cubes: cubes.map((c) => ({ cubeId: c.id, name: c.name, category: c.category })) }),
    [cubes]
  )
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors }
  } = useForm<ImportReviewValues>({ defaultValues })
  const { fields, remove } = useFieldArray({ control, name: 'cubes' })

  const totalSolvesById = useMemo(() => {
    const map = new Map<string, number>()
    for (const c of cubes) {
      const total = (c.solves?.session?.length || 0) + (c.solves?.all?.length || 0)
      map.set(c.id, total)
    }
    return map
  }, [cubes])

  const onSubmit = (values: ImportReviewValues) => {
    const normalized = values.cubes.map((c) => normalizeName(c.name))
    const duplicates = getDuplicateIndices(normalized)
    if (duplicates.size > 0) {
      values.cubes.forEach((_, i) => {
        if (duplicates.has(i)) setError(`cubes.${i}.name`, { type: 'validate', message: 'Repeated collection name' })
      })
      return
    }

    const idsToKeep = new Set(values.cubes.map((c) => c.cubeId))
    const edited = cubes
      .filter((c) => idsToKeep.has(c.id))
      .map((c) => {
        const v = values.cubes.find((x) => x.cubeId === c.id)!
        return { ...c, name: v.name, category: v.category } as Cube
      })
    onConfirm(edited)
  }

  const watchedCubes = watch('cubes')
  useEffect(() => {
    if (!watchedCubes) return
    const normalized = watchedCubes.map((c) => normalizeName(c.name))
    const duplicates = getDuplicateIndices(normalized)

    normalized.forEach((_, i) => {
      if (duplicates.has(i)) {
        setError(`cubes.${i}.name`, { type: 'validate', message: 'Nombre repetido' })
      } else {
        clearErrors(`cubes.${i}.name`)
      }
    })
  }, [watchedCubes, setError, clearErrors])

  return (
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
                        <div>
                          <Input {...field} placeholder="Name" className={'w-full'} />
                          {errors?.cubes?.[index]?.name && (
                            <p className="text-xs text-destructive mt-1">
                              {errors.cubes[index]?.name?.message as string}
                            </p>
                          )}
                        </div>
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
                            {CUBE_CATEGORIES.map((cat) => (
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
                    <span className="text-muted-foreground">{totalSolvesById.get(field.cubeId) ?? 0}</span>
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
  )
}
