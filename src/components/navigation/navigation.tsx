"use client";
import MainCubeSelector from "@/components/MainCubeSelector";
import { usePathname } from "@/i18n/routing";
import ButtonDisplayType from "./buttons/button-display-type";
import ButtonCreateCollection from "./buttons/button-create-collection";
import ButtonNextScramble from "./buttons/button-next-scramble";
import ButtonNavbar from "./buttons/button-navbar";

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
          <ButtonNavbar />

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
