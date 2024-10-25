import { Button } from "@/components/ui/button";
import { RowsIcon } from "@radix-ui/react-icons";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DialogNavbar from "@/components/dialogs/dialog-navbar/dialog-navbar";

export default function ButtonNavbar() {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"ghost"} className="py-0 px-3">
            <RowsIcon />
          </Button>
        </DialogTrigger>
        <DialogNavbar />
      </Dialog>
    </>
  );
}
