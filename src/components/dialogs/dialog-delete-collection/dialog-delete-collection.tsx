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
import { useDialogCubesOptions } from "@/store/DialogCubesOptions";

export default function DialogDeleteCollection() {
  const { cube } = useDialogCubesOptions();
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
        <Input />
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
