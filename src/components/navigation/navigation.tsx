"use client";
import MainCubeSelector from "@/components/MainCubeSelector";
import ButtonDisplayType from "./buttons/button-display-type";
import ButtonCreateCollection from "./buttons/button-create-collection";
import ButtonNextScramble from "./buttons/button-next-scramble";
import ButtonNavbar from "./buttons/button-navbar";
import ButtonSelectMode from "./buttons/button-select-mode";
import { ReactNode } from "react";

export default function Navigation({
  children,
  showMenu = true,
  showMainCubeSelector = false,
  showButtonNextScramble = false,
  showButtonDisplayType = false,
  showButtonCreateCollection = false,
  showButtonSelectMode = false
}: {
  children?: ReactNode;
  showMenu?: boolean;
  showMainCubeSelector?: boolean;
  showButtonNextScramble?: boolean;
  showButtonDisplayType?: boolean;
  showButtonCreateCollection?: boolean;
  showButtonSelectMode?: boolean;

}) {
  return (
    <>
      <div className="w-full max-w-7xl border mx-auto flex flex-col rounded-lg bg-background/50 backdrop-blur-lg p-2 gap-2 mb-2 sticky top-1 left-0 z-50">
        {(showMenu || showMainCubeSelector || showButtonNextScramble || showButtonDisplayType || showButtonCreateCollection || showButtonSelectMode) && (
          <div className="flex justify-center items-center gap-2">
            {showMenu && <ButtonNavbar/>}
            {showMainCubeSelector && <MainCubeSelector/>}
            {showButtonNextScramble && <ButtonNextScramble/>}
            {showButtonDisplayType && <ButtonDisplayType/>}
            {showButtonCreateCollection && <ButtonCreateCollection/>}
            {showButtonSelectMode && <ButtonSelectMode/>}
          </div>
        )}
        {children}
      </div>
    </>
  );
}
