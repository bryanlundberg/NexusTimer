import SheetNavbar from "@/components/sheets/sheet-navbar/sheet-navbar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { RowsIcon } from "@radix-ui/react-icons";

export default function ButtonNavbar() {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant={"ghost"} className="py-0 px-3">
            <RowsIcon />
          </Button>
        </SheetTrigger>
        <SheetNavbar />
      </Sheet>
    </>
  );
}
