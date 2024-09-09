import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteCubeById, getAllCubes } from "@/db/dbOperations";
import { useDialogCubesOptions } from "@/store/DialogCubesOptions";
import { useTimerStore } from "@/store/timerStore";
import { useState } from "react";

export default function DialogDeleteCollection() {
  const { setCubes } = useTimerStore();
  const { cube, closeDialog } = useDialogCubesOptions();
  const [cubeName, setCubeName] = useState("");
  const [error, setError] = useState({
    status: false,
    message: "",
  });
  const handleDeleteCube = async () => {
    try {
      if (cubeName.trim() !== cube?.name) {
        setError((prev) => ({
          ...prev,
          status: true,
          message: "The name does not match",
        }));
        return;
      }

      await deleteCubeById(cube.id);
      const cubes = await getAllCubes();
      setCubes(cubes);
      closeDialog();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete collection</DialogTitle>
          <DialogDescription>
            This cube collection will be deleted, along with all of its solves,
            records, settings.
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-red-200/20 text-red-500">
          <AlertDescription className="font-semibold">
            <span className="font-black">Warning:</span> This action is not
            reversible.
          </AlertDescription>
        </Alert>

        <Label className="text-secondary-foreground/50">
          Enter the collection name{" "}
          <span className="text-secondary-foreground">{cube?.name}</span> to
          continue:
        </Label>
        <Input
          onChange={(e) => {
            setError((prev) => ({ ...prev, status: false, message: "" }));
            setCubeName(e.target.value);
          }}
        />

        {error && error.status && (
          <p className="text-destructive text-sm">{error.message}</p>
        )}
        <DialogFooter>
          <div className="flex justify-between w-full">
            <DialogClose asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>

            <Button variant={"default"} onClick={handleDeleteCube}>
              Continue
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </>
  );
}
