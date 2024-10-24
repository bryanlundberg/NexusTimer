"use client";
import MainCubeSelector from "@/components/MainCubeSelector";
import { Button } from "@/components/ui/button";
import { RowsIcon } from "@radix-ui/react-icons";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import SheetNavbar from "../sheets/sheet-navbar/sheet-navbar";
import { usePathname } from "@/i18n/routing";
import ButtonMoveSolves from "./buttons/button-move-solves";

export default function Navigation({
  children,
}: {
  children?: React.ReactNode;
}) {
  const path = usePathname();
  console.log(path);
  return (
    <>
      <div className="w-full max-w-7xl border mx-auto flex flex-col rounded-lg bg-secondary/10 p-2 gap-2 mb-2">
        <div className="flex justify-center items-center gap-2">
          {/* menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant={"ghost"} className="py-0 px-3">
                <RowsIcon />
              </Button>
            </SheetTrigger>
            <SheetNavbar />
          </Sheet>

          <MainCubeSelector />
          <ButtonMoveSolves />
        </div>
        {children}
      </div>
    </>
  );
}
