import MainCubeSelector from "@/components/MainCubeSelector";
import { Button } from "@/components/ui/button";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { DashboardIcon, RowsIcon } from "@radix-ui/react-icons";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import SheetNavbar from "../sheets/sheet-navbar/sheet-navbar";

export default function Navigation() {
  return (
    <>
      <div className="w-full max-w-96 border mx-auto flex justify-center items-center p-2 gap-3 rounded-lg bg-secondary/10">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <RowsIcon />
            </Button>
          </SheetTrigger>
          <SheetNavbar />
        </Sheet>

        <MainCubeSelector />
        <Button variant={"ghost"} size={"icon"}>
          <DashboardIcon className="size-4" />
        </Button>
        <Button variant={"ghost"} size={"icon"}>
          <SparklesIcon className="size-4" />
        </Button>
      </div>
    </>
  );
}
