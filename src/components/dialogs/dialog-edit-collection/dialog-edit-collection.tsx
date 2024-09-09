import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cubeCollection } from "@/lib/const/cubeCollection";
import { useDialogCubesOptions } from "@/store/DialogCubesOptions";

export default function DialogEditCollection() {
  const { cube } = useDialogCubesOptions();
  return (
    <>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit collection</DialogTitle>
        </DialogHeader>

        <Alert className="bg-yellow-200/20 text-amber-700">
          <AlertDescription className="font-semibold">
            <span className="font-black">Warning:</span> Modify the collection
            category, changes the solves from their category too.
          </AlertDescription>
        </Alert>

        <Label>Name</Label>
        <Input />

        <Label>Category</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {cubeCollection.map((cube) => {
              return (
                <SelectItem key={cube.id} value={cube.displayId}>
                  {cube.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <DialogFooter>
          <div className="flex justify-between w-full">
            <DialogClose asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>

            <Button variant={"default"}>Continue</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </>
  );
}
