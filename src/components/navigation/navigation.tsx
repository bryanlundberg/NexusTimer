"use client";
import MainCubeSelector from "@/components/MainCubeSelector";
import { Button } from "@/components/ui/button";
import { RowsIcon } from "@radix-ui/react-icons";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import SheetNavbar from "../sheets/sheet-navbar/sheet-navbar";
import { usePathname } from "@/i18n/routing";
import ButtonDisplayType from "./buttons/button-display-type";
import ButtonCreateCollection from "./buttons/button-create-collection";
import ButtonNextScramble from "./buttons/button-next-scramble";

export default function Navigation({
  children,
}: {
  children?: React.ReactNode;
}) {
  const path = usePathname();

  return (
    <>
      <div className="w-full max-w-7xl border mx-auto flex flex-col rounded-lg bg-secondary/10 p-2 gap-2 mb-2 sticky top-0 left-0 backdrop-blur-lg z-50">
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

          {path === "/" && <ButtonNextScramble />}

          {path === "/stats" || path === "/solves" ? (
            <ButtonDisplayType />
          ) : null}

          {path === "/cubes" && <ButtonCreateCollection />}
        </div>
        {children}
      </div>
    </>
  );
}
